/// <reference types="vite/client" />

import { convexTest } from "convex-test";
import type { TestConvex } from "convex-test";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { api } from "../convex/_generated/api";
import type { Id } from "../convex/_generated/dataModel";
import schema from "../convex/schema";

const modules = import.meta.glob("../convex/**/*.ts");
type TestContext = TestConvex<typeof schema>;

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

function installJudge(levels: { a: number; b: number; coherence: number; specificity: number }) {
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

async function fixture(count = 2, levels = { a: 3, b: 3, coherence: 3, specificity: 2 }) {
  installJudge(levels);
  const t = convexTest(schema, modules);
  const clients = Array.from({ length: count }, (_, index) =>
    t.withIdentity({ subject: `player-${index}`, issuer: "double-take-test" }),
  );
  const host = clients[0]!;
  const room = await host.mutation(api.rooms.createRoom, { displayName: "Host" });
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

  it("rejects long, empty, and stitched-style inputs at validation, before judging", async () => {
    const { clients, gameId } = await fixture();
    const long = await clients[0]!.mutation(api.game.submit, {
      gameId,
      text: "one two three four five six seven eight nine ten eleven twelve thirteen",
    });
    expect(long).toMatchObject({ ok: false, code: "TOO_MANY_WORDS" });
    const empty = await clients[0]!.mutation(api.game.submit, { gameId, text: "   " });
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
    const { clients, host, gameId } = await fixture(2, { a: 0, b: 3, coherence: 2, specificity: 2 });
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
      expect(item.adjudication?.gate).toBe("unreadable");
      expect(item.adjudication?.points).toBe(0);
    }
    const scored = view.players.find((p) => p.seatIndex === 0);
    expect(scored?.score).toBe(0);
  });

  it("retains the first adjudication for a duplicate sentence (no reroll)", async () => {
    const { clients, host, t, gameId } = await fixture(2, { a: 3, b: 3, coherence: 3, specificity: 2 });
    const sentence = "I will love you until death takes me";
    await clients[0]!.mutation(api.game.submit, { gameId, text: sentence });
    await clients[1]!.mutation(api.game.submit, { gameId, text: sentence.toUpperCase() });
    const first = await host.action(api.game.judge, { gameId });
    expect(first.judged).toBe(2);
    const adjudications = await t.run(async (ctx) => ctx.db.query("adjudications").collect());
    expect(adjudications).toHaveLength(1);
    // A second judge pass over the same retained sentence must not create a new row.
    const calls = vi.mocked(fetch).mock.calls.length;
    await host.mutation(api.game.beginReveal, { gameId });
    expect(vi.mocked(fetch).mock.calls.length).toBe(calls);
  });

  it("scores the good line 6 and lets the host advance through rounds to finish", async () => {
    const { clients, host, t, gameId } = await fixture();
    await clients[0]!.mutation(api.game.submit, { gameId, text: "Tonight we feast on what remains" });
    await clients[1]!.mutation(api.game.submit, { gameId, text: "I will love you until death takes me" });
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
        await clients[0]!.mutation(api.game.submit, { gameId, text: `Round ${round} words that hold twice` });
        await clients[1]!.mutation(api.game.submit, { gameId, text: `Round ${round} another line for both` });
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
    const outsider = t.withIdentity({ subject: "outsider", issuer: "double-take-test" });
    await expect(outsider.query(api.game.view, { gameId })).rejects.toThrow();
    await clients[0]!.mutation(api.game.submit, { gameId, text: "A line that works in both worlds" });
    await clients[1]!.mutation(api.game.submit, { gameId, text: "Another line for two contexts" });
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
    await clients[0]!.mutation(api.game.submit, { gameId, text: "A line that works in both worlds" });
    const failed = await host.action(api.game.judge, { gameId });
    expect(failed.ok).toBe(false);
    expect(failed.failed).toBe(1);
    expect(failed.code).toBe("JUDGE_HTTP_529");
    const submissions = await t.run(async (ctx) => ctx.db.query("submissions").collect());
    expect(submissions[0]?.status).toBe("pending");
    const adjudications = await t.run(async (ctx) => ctx.db.query("adjudications").collect());
    expect(adjudications).toHaveLength(0);
  });
});
