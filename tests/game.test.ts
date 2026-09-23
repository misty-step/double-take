/// <reference types="vite/client" />

import { convexTest, type TestConvex } from "convex-test";

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { api, internal } from "../convex/_generated/api";
import type { Id } from "../convex/_generated/dataModel";
import schema from "../convex/schema";
import { ADVANCE_GRACE_MS, LAST_PLAYER_MS } from "../convex/rules";
import { revealEndsAt } from "../lib/reveal";

const modules = import.meta.glob("../convex/**/*.ts");

type Levels = { a: number; b: number; coherence: number };
const FITS_BOTH: Levels = { a: 3, b: 3, coherence: 3 };

/** Documented TypeSafe response shape, level index per question. */
function judgeResponse(levels: Levels) {
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
      appropriate_a: scoreAnswer(levels.a),
      appropriate_b: scoreAnswer(levels.b),
      coherence: scoreAnswer(levels.coherence),
    },
  };
}

/** Jev stand-in: levels chosen per sentence, from the request body. */
function installJudge(levelsFor: (sentence: string) => Levels) {
  vi.stubEnv("JEV_DECISIONS_URL", "https://judge.test/decisions");
  vi.stubEnv("JEV_MODEL", "typesafe/jev-1.13");
  vi.stubEnv("OPENROUTER_API_KEY", "test-key-not-real");
  const fetchMock = vi.fn(async (_url: unknown, init?: RequestInit) => {
    const body = JSON.parse(String(init?.body)) as {
      state: { sentence: string };
    };
    return new Response(
      JSON.stringify(judgeResponse(levelsFor(body.state.sentence))),
      { status: 200, headers: { "Content-Type": "application/json" } },
    );
  });
  vi.stubGlobal("fetch", fetchMock);
  return fetchMock;
}

async function fixture(
  count = 2,
  levelsFor: (sentence: string) => Levels = () => FITS_BOTH,
) {
  vi.stubEnv("PRODUCT_ENVIRONMENT", "test");
  installJudge(levelsFor);
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
  /** Run the judgments `submit` scheduled; the 30 s last-player clock is not due yet. */
  const settle = async () => {
    vi.advanceTimersByTime(1);
    await t.finishInProgressScheduledFunctions();
  };
  const endReveal = async (extraMs = 0) => {
    await t.run(async (ctx) => {
      const game = (await ctx.db.get(gameId))!;
      const round = (await ctx.db
        .query("rounds")
        .withIndex("by_game_round", (q) =>
          q.eq("gameId", gameId).eq("round", game.round),
        )
        .unique())!;
      const ended = revealEndsAt(0, round.revealOrder?.length ?? 0) + extraMs;
      await ctx.db.patch(round._id, { revealStartedAt: Date.now() - ended });
    });
  };
  return { t, clients, host, room, playerIds, gameId, settle, endReveal };
}

async function rateLimitCount(t: TestConvex<typeof schema>) {
  return t.run(async (ctx) => {
    const rows = await ctx.db.query("rateLimits").collect();
    return rows[0]?.count ?? 0;
  });
}

describe("double take group game", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });
  afterEach(() => {
    vi.useRealTimers();
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

  it("judges each line when it is locked in and reveals once everyone is judged", async () => {
    const { clients, host, gameId, settle } = await fixture(3, (sentence) =>
      sentence.startsWith("Perfect")
        ? FITS_BOTH
        : sentence.startsWith("Lopsided")
          ? { a: 3, b: 1, coherence: 3 }
          : { a: 2, b: 2, coherence: 3 },
    );
    await clients[0]!.mutation(api.game.submit, {
      gameId,
      text: "Perfect in both of these worlds",
    });
    await clients[1]!.mutation(api.game.submit, {
      gameId,
      text: "Lopsided but still standing here",
    });
    await settle();
    let view = await host.query(api.game.view, { gameId });
    expect(view.phase).toBe("writing");
    expect(vi.mocked(fetch)).toHaveBeenCalledTimes(2);
    await clients[2]!.mutation(api.game.submit, {
      gameId,
      text: "Balanced and fair for everyone",
    });
    await settle();
    view = await host.query(api.game.view, { gameId });
    expect(view.phase).toBe("reveal");
    // Lowest first; 3 + 1 and 2 + 2 tie on points, the balanced line ranks higher.
    expect(
      view.reveal!.lines.map((line) => [line.name, line.points, line.weaker]),
    ).toEqual([
      ["Player 1", 4, 1],
      ["Player 2", 4, 2],
      ["Host", 6, 3],
    ]);
    expect(view.players.map((player) => player.score)).toEqual([6, 4, 4]);
    expect(JSON.stringify(view)).not.toMatch(/confidence|rubric|jev-test/i);
  });

  it("scores nothing for stitched or one-world lines, and little for filler", async () => {
    const { clients, host, gameId, settle } = await fixture(3, (sentence) =>
      sentence.startsWith("Stitched")
        ? { a: 3, b: 3, coherence: 0 }
        : sentence.startsWith("Filler")
          ? { a: 1, b: 1, coherence: 3 }
          : { a: 3, b: 0, coherence: 3 },
    );
    await clients[0]!.mutation(api.game.submit, {
      gameId,
      text: "Stitched halves, and another half",
    });
    await clients[1]!.mutation(api.game.submit, {
      gameId,
      text: "Filler words for any place",
    });
    await clients[2]!.mutation(api.game.submit, {
      gameId,
      text: "Only the first world believes this",
    });
    await settle();
    const view = await host.query(api.game.view, { gameId });
    const scoreBy = Object.fromEntries(
      view.reveal!.lines.map((line) => [line.name, [line.points, line.zero]]),
    );
    expect(scoreBy).toEqual({
      Host: [0, "stitched"],
      "Player 1": [2, null],
      "Player 2": [0, "rejected"],
    });
    expect(view.players.map((player) => player.score)).toEqual([0, 2, 0]);
  });

  it("keeps other players' lines secret while the table writes", async () => {
    const { clients, gameId, settle } = await fixture();
    await clients[0]!.mutation(api.game.submit, {
      gameId,
      text: "I will love you until death takes me",
    });
    await settle();
    const view = await clients[1]!.query(api.game.view, { gameId });
    expect(view.phase).toBe("writing");
    expect(view.reveal).toBeNull();
    expect(JSON.stringify(view)).not.toContain("death takes me");
    expect(view.players.map((player) => player.locked)).toEqual([true, false]);
    expect(view.me.line).toBeNull();
    const mine = await clients[0]!.query(api.game.view, { gameId });
    // Your own line reads as locked in, never as its judgment, before the reveal.
    expect(mine.me.line).toEqual({
      text: "I will love you until death takes me",
      status: "judged",
    });
  });

  it("accepts one line per round and refuses a second without charging", async () => {
    const { t, clients, gameId } = await fixture();
    const first = await clients[0]!.mutation(api.game.submit, {
      gameId,
      text: "The only line I get to write",
    });
    expect(first).toEqual({ ok: true });
    const charged = await rateLimitCount(t);
    const second = await clients[0]!.mutation(api.game.submit, {
      gameId,
      text: "A second thought about it",
    });
    expect(second).toEqual({ ok: false, code: "ALREADY_LOCKED" });
    expect(await rateLimitCount(t)).toBe(charged);
  });

  it("rejects invalid lines at validation, before any judging", async () => {
    const { clients, gameId, settle } = await fixture();
    const long = await clients[0]!.mutation(api.game.submit, {
      gameId,
      text: "one two three four five six seven eight nine ten eleven twelve thirteen",
    });
    expect(long).toEqual({ ok: false, code: "TOO_MANY_WORDS" });
    const empty = await clients[0]!.mutation(api.game.submit, {
      gameId,
      text: "   ",
    });
    expect(empty).toEqual({ ok: false, code: "SENTENCE_EMPTY" });
    await settle();
    expect(vi.mocked(fetch)).not.toHaveBeenCalled();
  });

  it("reuses the retained judgment for a repeated sentence and refunds its charge", async () => {
    const { t, clients, gameId, settle } = await fixture();
    const sentence = "I will love you until death takes me";
    await clients[0]!.mutation(api.game.submit, { gameId, text: sentence });
    await settle();
    await clients[1]!.mutation(api.game.submit, {
      gameId,
      text: sentence.toUpperCase(),
    });
    await settle();
    expect(vi.mocked(fetch)).toHaveBeenCalledTimes(1);
    const adjudications = await t.run(async (ctx) =>
      ctx.db.query("adjudications").collect(),
    );
    expect(adjudications).toHaveLength(1);
    const charges = await t.run(async (ctx) =>
      ctx.db.query("rateLimits").collect(),
    );
    expect(charges.map((row) => row.count).sort()).toEqual([0, 1]);
  });

  it("unlocks a line Jev could not score, refunds it, and judges the retry", async () => {
    const { t, clients, gameId, settle } = await fixture();
    vi.stubGlobal(
      "fetch",
      // A refusal fails on the first attempt; overloads retry with backoff in judge.test.ts.
      vi.fn(async () => new Response("refused", { status: 401 })),
    );
    await clients[0]!.mutation(api.game.submit, {
      gameId,
      text: "A line that works in both worlds",
    });
    await settle();
    let view = await clients[0]!.query(api.game.view, { gameId });
    expect(view.me.line).toEqual({
      text: "A line that works in both worlds",
      status: "failed",
    });
    expect(view.players[0]!.locked).toBe(false);
    expect(await rateLimitCount(t)).toBe(0);
    expect(
      await t.run(async (ctx) => ctx.db.query("adjudications").collect()),
    ).toHaveLength(0);
    installJudge(() => FITS_BOTH);
    const retry = await clients[0]!.mutation(api.game.submit, {
      gameId,
      text: "A line that works in both worlds",
    });
    expect(retry).toEqual({ ok: true });
    await settle();
    view = await clients[0]!.query(api.game.view, { gameId });
    expect(view.me.line?.status).toBe("judged");
  });

  it("gives the last player a clock, then reveals without them", async () => {
    const { t, clients, host, gameId, settle } = await fixture(3);
    const before = Date.now();
    await clients[0]!.mutation(api.game.submit, {
      gameId,
      text: "First line in for the round",
    });
    let view = await host.query(api.game.view, { gameId });
    expect(view.lastDeadline).toBeNull();
    await clients[1]!.mutation(api.game.submit, {
      gameId,
      text: "Second line in for the round",
    });
    await settle();
    view = await host.query(api.game.view, { gameId });
    expect(view.phase).toBe("writing");
    expect(view.lastDeadline).toBeGreaterThanOrEqual(before + LAST_PLAYER_MS);
    expect(view.lastDeadline).toBeLessThanOrEqual(Date.now() + LAST_PLAYER_MS);
    await t.run(async (ctx) => {
      const round = (await ctx.db.query("rounds").collect())[0]!;
      await ctx.db.patch(round._id, { lastDeadline: Date.now() - 1 });
    });
    const late = await clients[2]!.mutation(api.game.submit, {
      gameId,
      text: "Too late for this round",
    });
    expect(late).toEqual({ ok: false, code: "WRONG_PHASE" });
    await t.mutation(internal.game.closeWriting, { gameId, round: 1 });
    view = await host.query(api.game.view, { gameId });
    expect(view.phase).toBe("reveal");
    expect(view.reveal!.lines.map((line) => line.name).sort()).toEqual([
      "Host",
      "Player 1",
    ]);
    expect(view.players[2]!.roundPoints).toBe(0);
  });

  it("starts the clock in a two player game once one line is in", async () => {
    const { clients, host, gameId } = await fixture(2);
    await clients[1]!.mutation(api.game.submit, {
      gameId,
      text: "One of two lines is in",
    });
    const view = await host.query(api.game.view, { gameId });
    expect(view.lastDeadline).not.toBeNull();
  });

  it("holds advance until the reveal ends, then lets the host move on", async () => {
    const { clients, host, gameId, settle, endReveal } = await fixture();
    await clients[0]!.mutation(api.game.submit, {
      gameId,
      text: "A line that works in both worlds",
    });
    await clients[1]!.mutation(api.game.submit, {
      gameId,
      text: "Another line for two contexts",
    });
    await settle();
    expect(await host.mutation(api.game.advance, { gameId })).toEqual({
      ok: false,
      code: "REVEAL_RUNNING",
    });
    await endReveal();
    expect(await clients[1]!.mutation(api.game.advance, { gameId })).toEqual({
      ok: false,
      code: "HOST_REQUIRED",
    });
    const first = await host.query(api.game.view, { gameId });
    expect(await host.mutation(api.game.advance, { gameId })).toEqual({
      ok: true,
      finished: false,
    });
    const next = await host.query(api.game.view, { gameId });
    expect(next).toMatchObject({ phase: "writing", round: 2, reveal: null });
    expect(next.pair.key).not.toBe(first.pair.key);
    expect(next.players.every((player) => player.roundPoints === 0)).toBe(true);
    expect(next.players.every((player) => player.score === 6)).toBe(true);
  });

  it("lets any seated player advance once the host has been gone past the grace", async () => {
    const { clients, gameId, settle, endReveal } = await fixture();
    for (const [index, text] of [
      "Line from the host",
      "Line from a guest",
    ].entries())
      await clients[index]!.mutation(api.game.submit, { gameId, text });
    await settle();
    await endReveal(ADVANCE_GRACE_MS);
    expect(await clients[1]!.mutation(api.game.advance, { gameId })).toEqual({
      ok: true,
      finished: false,
    });
  });

  it("finishes after three rounds with the line of the game and a completed match", async () => {
    const { t, clients, host, room, gameId, settle, endReveal } = await fixture(
      2,
      (sentence) =>
        sentence.includes("best") ? FITS_BOTH : { a: 2, b: 1, coherence: 3 },
    );
    for (let round = 1; round <= 3; round += 1) {
      await clients[0]!.mutation(api.game.submit, {
        gameId,
        text:
          round === 2
            ? "The best line of the whole game"
            : `Host line ${round}`,
      });
      await clients[1]!.mutation(api.game.submit, {
        gameId,
        text: `Guest line number ${round}`,
      });
      await settle();
      await endReveal();
      const advanced = await host.mutation(api.game.advance, { gameId });
      expect(advanced).toEqual({ ok: true, finished: round === 3 });
    }
    const view = await host.query(api.game.view, { gameId });
    expect(view.phase).toBe("finished");
    expect(view.players.map((player) => player.score)).toEqual([12, 9]);
    expect(view.bestLine).toMatchObject({
      text: "The best line of the whole game",
      name: "Host",
      points: 6,
    });
    const status = await t.run(async (ctx) => {
      const matches = await ctx.db.query("matches").collect();
      return matches[0]?.status ?? null;
    });
    expect(status).toBe("completed");
    // The room keeps the final scores instead of dropping to the lobby.
    const brief = await host.query(api.game.forRoom, { roomId: room.roomId });
    expect(brief).toMatchObject({ gameId, phase: "finished" });
  });

  it("records the round funnel without retaining player lines in events", async () => {
    const { t, clients, gameId, settle } = await fixture();
    await clients[0]!.mutation(api.game.submit, {
      gameId,
      text: "I never said it was yours",
    });
    await clients[1]!.mutation(api.game.submit, {
      gameId,
      text: "That changes everything",
    });
    await settle();
    const events = await t.run(async (ctx) =>
      ctx.db.query("productEvents").collect(),
    );
    expect(events.map((event) => event.eventName).sort()).toEqual(
      [
        "round_start",
        "submission",
        "submission",
        "judgment",
        "judgment",
        "round_complete",
      ].sort(),
    );
    expect(new Set(events.map((event) => event.eventId)).size).toBe(
      events.length,
    );
    expect(JSON.stringify(events)).not.toMatch(
      /I never said|That changes everything/,
    );
  });

  it("lets only the host end a running game, returning the room to its lobby", async () => {
    const { clients, host, room, gameId, settle } = await fixture();
    await clients[0]!.mutation(api.game.submit, {
      gameId,
      text: "A line that works in both worlds",
    });
    expect(await clients[1]!.mutation(api.game.endGame, { gameId })).toEqual({
      ok: false,
      code: "HOST_REQUIRED",
    });
    expect(await host.mutation(api.game.endGame, { gameId })).toEqual({
      ok: true,
    });
    const state = await host.query(api.rooms.getRoomState, {
      roomId: room.roomId,
    });
    expect(state.activeMatch).toBeNull();
    // A judgment landing after the end must not reopen the round.
    await clients[1]!
      .mutation(api.game.submit, {
        gameId,
        text: "Too late for this game",
      })
      .catch(() => undefined);
    await settle();
    expect((await host.query(api.game.view, { gameId })).phase).toBe("writing");
    // The table can start a fresh game straight away.
    const next = await host.mutation(api.game.start, {
      roomId: room.roomId,
      requestId: "second-match",
    });
    expect(next).not.toBe(gameId);
  });

  it("tells members a closed room is gone instead of failing", async () => {
    const { clients, host, room } = await fixture();
    await host.mutation(api.rooms.closeRoom, { roomId: room.roomId });
    expect(
      await clients[1]!.query(api.game.forRoom, { roomId: room.roomId }),
    ).toEqual({ gameId: null, phase: null, closed: true });
  });

  it("lets a mid-game joiner watch without a seat or hidden text, and keeps outsiders out", async () => {
    const { t, clients, host, room, gameId, settle } = await fixture();
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
    const watching = await late.query(api.game.view, { gameId });
    expect(watching.me).toMatchObject({ seated: false, line: null });
    expect(JSON.stringify(watching)).not.toContain("both worlds");
    expect(
      await late.mutation(api.game.submit, {
        gameId,
        text: "Spectator line for the round",
      }),
    ).toEqual({ ok: false, code: "NOT_SEATED" });
    await expect(late.mutation(api.game.advance, { gameId })).rejects.toThrow();
    const outsider = t.withIdentity({
      subject: "outsider",
      issuer: "double-take-test",
    });
    await expect(outsider.query(api.game.view, { gameId })).rejects.toThrow();
    await clients[1]!.mutation(api.game.submit, {
      gameId,
      text: "Another line for two contexts",
    });
    await settle();
    const revealed = await late.query(api.game.view, { gameId });
    expect(revealed.phase).toBe("reveal");
    expect(revealed.reveal!.lines).toHaveLength(2);
    expect((await host.query(api.game.view, { gameId })).isHost).toBe(true);
  });
});
