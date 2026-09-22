/// <reference types="vite/client" />

import { convexTest } from "convex-test";

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { api } from "../convex/_generated/api";
import type { Id } from "../convex/_generated/dataModel";
import schema from "../convex/schema";

const modules = import.meta.glob("../convex/**/*.ts");

/** Documented TypeSafe response shape, level index per question. */
function judgeResponse(levels: {
  a: number;
  b: number;
  coherence: number;
  specificity: number;
}) {
  const scoreAnswer = (level: number) => ({
    type: "score" as const,
    score: level,
    legend: { "0": "l0", "1": "l1", "2": "l2", "3": "l3" },
    probabilities: { "0": 0, "1": 0, "2": 0, "3": 0, [String(level)]: 1 },
    confidence: 0.9,
  });
  return {
    model: "jev-test",
    answers: {
      plausibility_a: scoreAnswer(levels.a),
      plausibility_b: scoreAnswer(levels.b),
      coherence: scoreAnswer(levels.coherence),
      specificity: scoreAnswer(levels.specificity),
    },
  };
}

function installJudge(levels: {
  a: number;
  b: number;
  coherence: number;
  specificity: number;
}) {
  vi.stubEnv("JEV_DECISIONS_URL", "https://judge.test/decisions");
  vi.stubEnv("JEV_MODEL", "typesafe/jev-1.13");
  vi.stubEnv("OPENROUTER_API_KEY", "test-key-not-real");
  const fetchMock = vi.fn(async () => {
    return new Response(JSON.stringify(judgeResponse(levels)), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  });
  vi.stubGlobal("fetch", fetchMock);
  return fetchMock;
}

async function fixture(
  count = 2,
  levels = { a: 3, b: 3, coherence: 3, specificity: 2 },
) {
  vi.stubEnv("PRODUCT_ENVIRONMENT", "test");
  installJudge(levels);
  const t = convexTest(schema, modules);
  const clients = Array.from({ length: count }, (_, index) =>
    t.withIdentity({ subject: `player-${index}`, issuer: "double-take-test" }),
  );
  const host = clients[0]!;
  const room = await host.mutation(api.rooms.createRoom, {
    displayName: "Host",
  });
  const playerIds: Id<"players">[] = [room.playerId];
  for (let index = 1; index < count; index += 1) {
    const joined = await clients[index]!.mutation(api.rooms.joinRoom, {
      code: room.code,
      displayName: `Player ${index}`,
    });
    if (!joined.ok) throw new Error(joined.code);
    playerIds.push(joined.playerId);
  }
  const gameId = await host.mutation(api.game.start, {
    roomId: room.roomId,
    requestId: "first-match",
  });
  return { t, clients, host, room, playerIds, gameId };
}

describe("double take game", () => {
  beforeEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  it("starts idempotently for the same requestId", async () => {
    const { host, room, gameId } = await fixture();
    const again = await host.mutation(api.game.start, {
      roomId: room.roomId,
      requestId: "first-match",
    });
    expect(again).toBe(gameId);
  });

  it("records the match funnel without retaining player sentences in events", async () => {
    const { t, clients, host, gameId } = await fixture();
    await clients[0]!.mutation(api.game.submit, {
      gameId,
      text: "I never said it was yours",
    });
    await clients[1]!.mutation(api.game.submit, {
      gameId,
      text: "That changes everything",
    });
    await host.action(api.game.judge, { gameId });
    await host.mutation(api.game.beginReveal, { gameId });

    const events = await t.run(async (ctx) =>
      ctx.db.query("productEvents").collect(),
    );
    expect(events.map((event) => event.eventName)).toEqual([
      "round_start",
      "submission",
      "submission",
      "judgment",
      "judgment",
      "round_complete",
    ]);
    expect(new Set(events.map((event) => event.eventId)).size).toBe(
      events.length,
    );
    expect(JSON.stringify(events)).not.toMatch(
      /I never said|That changes everything/,
    );
    expect(
      events.every(
        (event) => event.environment === "test" && event.actorId === null,
      ),
    ).toBe(true);
  });

  it("rejects long, empty, and stitched-style inputs at validation, before judging", async () => {
    const { clients, gameId } = await fixture();
    const long = await clients[0]!.mutation(api.game.submit, {
      gameId,
      text: "one two three four five six seven eight nine ten eleven twelve thirteen",
    });
    expect(long).toMatchObject({ ok: false, code: "TOO_MANY_WORDS" });
    const empty = await clients[0]!.mutation(api.game.submit, {
      gameId,
      text: "   ",
    });
    expect(empty.ok).toBe(false);
    const fetchMock = vi.mocked(fetch);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("keeps other players' text secret during the writing phase", async () => {
    const { clients, gameId } = await fixture();
    await clients[0]!.mutation(api.game.submit, {
      gameId,
      text: "I will love you until death takes me",
    });
    const view = await clients[1]!.query(api.game.view, { gameId });
    expect(view.phase).toBe("writing");
    expect(view.reveal).toBeNull();
    const serialized = JSON.stringify(view);
    expect(serialized).not.toContain("death takes me");
    expect(view.players.find((p) => p.seatIndex === 0)?.submitted).toBe(true);
    expect(view.me.submission).toBeNull();
  });

  it("judges every pending submission once and applies the weaker reading", async () => {
    const { clients, host, gameId } = await fixture(2, {
      a: 0,
      b: 3,
      coherence: 2,
      specificity: 2,
    });
    await clients[0]!.mutation(api.game.submit, {
      gameId,
      text: "You will never escape me now",
    });
    await clients[1]!.mutation(api.game.submit, {
      gameId,
      text: "I will love you until death takes me",
    });
    const judged = await host.action(api.game.judge, { gameId });
    expect(judged).toMatchObject({ ok: true, judged: 2, failed: 0 });
    const reveal = await host.mutation(api.game.beginReveal, { gameId });
    expect(reveal.ok).toBe(true);
    const view = await host.query(api.game.view, { gameId });
    expect(view.phase).toBe("reveal");
    expect(view.reveal?.submissions).toHaveLength(2);
    for (const item of view.reveal!.submissions) {
      expect(item.adjudication?.points).toBe(0);
      expect(item.adjudication?.note).toBe(
        "One reading collapses in its context.",
      );
      expect(JSON.stringify(item.adjudication)).not.toMatch(
        /confidence|rubric|model|gate/i,
      );
    }
    const scored = view.players.find((p) => p.seatIndex === 0);
    expect(scored?.score).toBe(0);
  });

  it("retains the first adjudication for a duplicate sentence (no reroll)", async () => {
    const { clients, host, t, gameId } = await fixture(2, {
      a: 3,
      b: 3,
      coherence: 3,
      specificity: 2,
    });
    const sentence = "I will love you until death takes me";
    await clients[0]!.mutation(api.game.submit, { gameId, text: sentence });
    await clients[1]!.mutation(api.game.submit, {
      gameId,
      text: sentence.toUpperCase(),
    });
    const first = await host.action(api.game.judge, { gameId });
    expect(first.judged).toBe(2);
    const adjudications = await t.run(async (ctx) =>
      ctx.db.query("adjudications").collect(),
    );
    expect(adjudications).toHaveLength(1);
    // A second judge pass over the same retained sentence must not create a new row.
    const calls = vi.mocked(fetch).mock.calls.length;
    await host.mutation(api.game.beginReveal, { gameId });
    expect(vi.mocked(fetch).mock.calls.length).toBe(calls);
  });

  it("scores the good line 6 and lets the host advance through rounds to finish", async () => {
    const { clients, host, t, gameId } = await fixture();
    await clients[0]!.mutation(api.game.submit, {
      gameId,
      text: "Tonight we feast on what remains",
    });
    await clients[1]!.mutation(api.game.submit, {
      gameId,
      text: "I will love you until death takes me",
    });
    await host.action(api.game.judge, { gameId });
    await host.mutation(api.game.beginReveal, { gameId });
    let view = await host.query(api.game.view, { gameId });
    expect(view.players.every((p) => p.score === 6)).toBe(true);
    for (let round = 1; round <= 3; round += 1) {
      const advanced = await host.mutation(api.game.advance, { gameId });
      if (round < 3) {
        expect(advanced).toMatchObject({ ok: true, finished: false });
        view = await host.query(api.game.view, { gameId });
        expect(view.phase).toBe("writing");
        expect(view.round).toBe(round + 1);
        await clients[0]!.mutation(api.game.submit, {
          gameId,
          text: `Round ${round} words that hold twice`,
        });
        await clients[1]!.mutation(api.game.submit, {
          gameId,
          text: `Round ${round} another line for both`,
        });
        await host.action(api.game.judge, { gameId });
        await host.mutation(api.game.beginReveal, { gameId });
      } else {
        expect(advanced).toMatchObject({ ok: true, finished: true });
      }
    }
    view = await host.query(api.game.view, { gameId });
    expect(view.phase).toBe("finished");
    const matchStatus = await t.run(async (ctx) => {
      const matches = await ctx.db.query("matches").collect();
      return matches[0]?.status ?? null;
    });
    expect(matchStatus).toBe("completed");
  });

  it("blocks non-participants and non-hosts from advancing", async () => {
    const { clients, host, t, gameId } = await fixture(2);
    const outsider = t.withIdentity({
      subject: "outsider",
      issuer: "double-take-test",
    });
    await expect(outsider.query(api.game.view, { gameId })).rejects.toThrow();
    await clients[0]!.mutation(api.game.submit, {
      gameId,
      text: "A line that works in both worlds",
    });
    await clients[1]!.mutation(api.game.submit, {
      gameId,
      text: "Another line for two contexts",
    });
    await host.action(api.game.judge, { gameId });
    await host.mutation(api.game.beginReveal, { gameId });
    const refused = await clients[1]!.mutation(api.game.advance, { gameId });
    expect(refused).toMatchObject({ ok: false, code: "HOST_REQUIRED" });
  });

  it("reports a judge outage honestly and leaves submissions retryable", async () => {
    const { clients, host, t, gameId } = await fixture();
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => new Response("overloaded", { status: 529 })),
    );
    await clients[0]!.mutation(api.game.submit, {
      gameId,
      text: "A line that works in both worlds",
    });
    const failed = await host.action(api.game.judge, { gameId });
    expect(failed.ok).toBe(false);
    expect(failed.failed).toBe(1);
    expect(failed.code).toBe("JUDGE_HTTP_529");
    const submissions = await t.run(async (ctx) =>
      ctx.db.query("submissions").collect(),
    );
    expect(submissions[0]?.status).toBe("pending");
    const adjudications = await t.run(async (ctx) =>
      ctx.db.query("adjudications").collect(),
    );
    expect(adjudications).toHaveLength(0);
  });

  it("accepts revisions up to the cap and refuses the next without charging", async () => {
    const { clients, t, gameId } = await fixture();
    for (const text of [
      "First draft line",
      "Second draft line",
      "Third draft line",
    ]) {
      const accepted = await clients[0]!.mutation(api.game.submit, {
        gameId,
        text,
      });
      expect(accepted).toMatchObject({ ok: true });
    }
    const charged = await t.run(async (ctx) => {
      const rows = await ctx.db.query("rateLimits").collect();
      return rows[0]?.count ?? 0;
    });
    const refused = await clients[0]!.mutation(api.game.submit, {
      gameId,
      text: "Fourth draft line",
    });
    expect(refused).toMatchObject({ ok: false, code: "REVISION_LIMIT" });
    const afterRefusal = await t.run(async (ctx) => {
      const rows = await ctx.db.query("rateLimits").collect();
      return rows[0]?.count ?? 0;
    });
    expect(afterRefusal).toBe(charged);
    const submissions = await t.run(async (ctx) =>
      ctx.db.query("submissions").collect(),
    );
    expect(submissions[0]?.revision).toBe(3);
    expect(submissions[0]?.text).toBe("Third draft line");
  });

  it("drops an in-flight judgment when the line was revised, then judges the revision", async () => {
    const { clients, host, t, gameId } = await fixture(2, {
      a: 3,
      b: 3,
      coherence: 3,
      specificity: 2,
    });
    await clients[0]!.mutation(api.game.submit, {
      gameId,
      text: "First draft of the line",
    });
    let revised = false;
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => {
        if (!revised) {
          revised = true;
          await clients[0]!.mutation(api.game.submit, {
            gameId,
            text: "Second draft of the line",
          });
        }
        return new Response(
          JSON.stringify(
            judgeResponse({ a: 3, b: 3, coherence: 3, specificity: 2 }),
          ),
          {
            status: 200,
            headers: { "Content-Type": "application/json" },
          },
        );
      }),
    );
    const stale = await host.action(api.game.judge, { gameId });
    expect(stale.judged).toBe(0);
    let submissions = await t.run(async (ctx) =>
      ctx.db.query("submissions").collect(),
    );
    expect(submissions[0]?.status).toBe("pending");
    expect(submissions[0]?.revision).toBe(2);
    const fresh = await host.action(api.game.judge, { gameId });
    expect(fresh).toMatchObject({ ok: true, judged: 1 });
    submissions = await t.run(async (ctx) =>
      ctx.db.query("submissions").collect(),
    );
    expect(submissions[0]?.status).toBe("judged");
    expect(submissions[0]?.normalized).toBe("second draft of the line");
  });

  it("refuses judge calls from callers who are not seated at the table", async () => {
    const { t, clients, gameId } = await fixture();
    await clients[0]!.mutation(api.game.submit, {
      gameId,
      text: "A line that works in both worlds",
    });
    const anonymous = await t.action(api.game.judge, { gameId });
    expect(anonymous).toMatchObject({ ok: false, code: "NOT_AUTHORIZED" });
    const outsider = t.withIdentity({
      subject: "outsider-judge",
      issuer: "double-take-test",
    });
    await outsider.mutation(api.rooms.createRoom, { displayName: "Outsider" });
    const refused = await outsider.action(api.game.judge, { gameId });
    expect(refused).toMatchObject({
      ok: false,
      code: "MATCH_PARTICIPANT_REQUIRED",
    });
    expect(vi.mocked(fetch)).not.toHaveBeenCalled();
  });

  it("refunds the caller's judge charge when the judge is down", async () => {
    const { clients, host, t, gameId } = await fixture();
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => new Response("overloaded", { status: 529 })),
    );
    await clients[0]!.mutation(api.game.submit, {
      gameId,
      text: "A line that works in both worlds",
    });
    const before = await t.run(async (ctx) => {
      const rows = await ctx.db.query("rateLimits").collect();
      return rows[0]?.count ?? 0;
    });
    const failed = await host.action(api.game.judge, { gameId });
    expect(failed.ok).toBe(false);
    const after = await t.run(async (ctx) => {
      const rows = await ctx.db.query("rateLimits").collect();
      return rows[0]?.count ?? 0;
    });
    expect(after).toBe(before);
  });

  it("lets the table reveal after the deadline even when a player never submits", async () => {
    const { clients, host, t, gameId } = await fixture();
    await clients[0]!.mutation(api.game.submit, {
      gameId,
      text: "A line that works in both worlds",
    });
    await host.action(api.game.judge, { gameId });
    const early = await host.mutation(api.game.beginReveal, { gameId });
    expect(early).toMatchObject({ ok: false, code: "NOT_READY" });
    await t.run(async (ctx) => {
      const rounds = await ctx.db.query("rounds").collect();
      await ctx.db.patch(rounds[0]!._id, { deadline: Date.now() - 1 });
    });
    const late = await clients[1]!.mutation(api.game.beginReveal, { gameId });
    expect(late.ok).toBe(true);
    const view = await clients[1]!.query(api.game.view, { gameId });
    expect(view.phase).toBe("reveal");
    expect(
      view.players.find((player) => player.seatIndex === 0)?.roundPoints,
    ).toBe(6);
  });

  it("host force-reveal ends the round early and scores judged lines", async () => {
    const { clients, host, gameId } = await fixture();
    await clients[0]!.mutation(api.game.submit, {
      gameId,
      text: "A line that works in both worlds",
    });
    // The client ends the round early only after judging what was submitted.
    const judged = await host.action(api.game.judge, { gameId });
    expect(judged).toMatchObject({ ok: true });
    const forced = await host.mutation(api.game.beginReveal, {
      gameId,
      force: true,
    });
    expect(forced.ok).toBe(true);
    const view = await host.query(api.game.view, { gameId });
    expect(view.phase).toBe("reveal");
    expect(
      view.players.find((player) => player.seatIndex === 0)?.roundPoints,
    ).toBe(6);
    // The no-show player is revealed without a score, never a fake one.
    expect(
      view.players.find((player) => player.seatIndex === 1)?.roundPoints ?? 0,
    ).toBe(0);
  });

  it("refuses anonymous solo judge calls and refunds solo outage passes", async () => {
    vi.stubEnv("PRODUCT_ENVIRONMENT", "test");
    installJudge({ a: 3, b: 3, coherence: 3, specificity: 2 });
    const t = convexTest(schema, modules);
    const sessionId = "123e4567-e89b-42d3-a456-426614174000";
    const anonymous = await t.action(api.solo.judge, {
      sentence: "A line that works in both worlds",
      pairKey: "vow-villain",
      sessionId,
      roundIndex: 1,
    });
    expect(anonymous).toMatchObject({ ok: false, code: "NOT_AUTHORIZED" });
    const seated = t.withIdentity({
      subject: "solo-player",
      issuer: "double-take-test",
    });
    const judged = await seated.action(api.solo.judge, {
      sentence: "A line that works in both worlds",
      pairKey: "vow-villain",
      sessionId,
      roundIndex: 1,
    });
    expect(judged.ok).toBe(true);
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => new Response("overloaded", { status: 529 })),
    );
    const failed = await seated.action(api.solo.judge, {
      sentence: "Another line for two contexts",
      pairKey: "vow-villain",
      sessionId,
      roundIndex: 2,
    });
    expect(failed.ok).toBe(false);
    const rows = await t.run(async (ctx) =>
      ctx.db.query("rateLimits").collect(),
    );
    expect(rows[0]?.count ?? 0).toBe(1);
  });

  it("keeps the final standings reachable after the match completes", async () => {
    const { clients, host, room, gameId } = await fixture();
    await playOutMatch({ clients, host, gameId });
    // The platform completes the match in the same mutation that finishes the
    // game; activeMatch is gone, but the room must not drop to the lobby.
    const state = await host.query(api.rooms.getRoomState, {
      roomId: room.roomId,
    });
    expect(state.activeMatch).toBeNull();
    const brief = await host.query(api.game.forRoom, { roomId: room.roomId });
    expect(brief).toMatchObject({ gameId, phase: "finished" });
    const view = await host.query(api.game.view, { gameId });
    expect(view.phase).toBe("finished");
    expect(view.players).toHaveLength(2);
    expect(view.players.every((player) => player.score >= 0)).toBe(true);
    expect(view.reveal?.submissions).toHaveLength(2);
  });

  it("lets a member who missed the match read the finished standings", async () => {
    const { t, clients, host, room, gameId } = await fixture();
    await playOutMatch({ clients, host, gameId });
    const late = t.withIdentity({
      subject: "late-joiner",
      issuer: "double-take-test",
    });
    const joined = await late.mutation(api.rooms.joinRoom, {
      code: room.code,
      displayName: "Late",
    });
    expect(joined.ok).toBe(true);
    const view = await late.query(api.game.view, { gameId });
    expect(view.phase).toBe("finished");
    expect(view.players).toHaveLength(2);
    expect(view.me.submission).toBeNull();
    const outsider = t.withIdentity({
      subject: "standings-outsider",
      issuer: "double-take-test",
    });
    await expect(outsider.query(api.game.view, { gameId })).rejects.toThrow();
  });

  it("seats a mid-match joiner as a spectator without exposing hidden text", async () => {
    const { t, clients, host, room, gameId } = await fixture();
    await clients[0]!.mutation(api.game.submit, {
      gameId,
      text: "A line that works in both worlds",
    });
    const late = t.withIdentity({
      subject: "mid-joiner",
      issuer: "double-take-test",
    });
    const joined = await late.mutation(api.rooms.joinRoom, {
      code: room.code,
      displayName: "Mid",
    });
    expect(joined.ok).toBe(true);
    const view = await late.query(api.game.view, { gameId });
    expect(view.phase).toBe("writing");
    expect(view.me.seated).toBe(false);
    expect(view.me.submission).toBeNull();
    expect(view.reveal).toBeNull();
    expect(JSON.stringify(view)).not.toContain("both worlds");
    // A spectator cannot spend or advance in a match they are not dealt into.
    await expect(
      late.mutation(api.game.submit, {
        gameId,
        text: "Spectator line for the round",
      }),
    ).rejects.toThrow();
    await expect(late.mutation(api.game.advance, { gameId })).rejects.toThrow();
    // Outsiders without a seat at the table still learn nothing.
    const outsider = t.withIdentity({
      subject: "mid-outsider",
      issuer: "double-take-test",
    });
    await expect(outsider.query(api.game.view, { gameId })).rejects.toThrow();
    // The round still flows for the seated players.
    await clients[1]!.mutation(api.game.submit, {
      gameId,
      text: "Another line for two contexts",
    });
    await host.action(api.game.judge, { gameId });
    const reveal = await host.mutation(api.game.beginReveal, { gameId });
    expect(reveal.ok).toBe(true);
    const spectate = await late.query(api.game.view, { gameId });
    expect(spectate.phase).toBe("reveal");
    expect(spectate.reveal?.submissions).toHaveLength(2);
  });
});

/** Play all three rounds so the match finishes and the platform completes it. */
async function playOutMatch({
  clients,
  host,
  gameId,
}: {
  clients: Awaited<ReturnType<typeof fixture>>["clients"];
  host: Awaited<ReturnType<typeof fixture>>["host"];
  gameId: Awaited<ReturnType<typeof fixture>>["gameId"];
}) {
  for (let round = 1; round <= 3; round += 1) {
    await clients[0]!.mutation(api.game.submit, {
      gameId,
      text: `Round ${round} words that hold twice`,
    });
    await clients[1]!.mutation(api.game.submit, {
      gameId,
      text: `Round ${round} another line for both`,
    });
    await host.action(api.game.judge, { gameId });
    await host.mutation(api.game.beginReveal, { gameId });
    const advanced = await host.mutation(api.game.advance, { gameId });
    expect(advanced).toMatchObject({ ok: true, finished: round === 3 });
  }
}
