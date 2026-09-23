/**
 * Double Take game server: rooms come from Parlor; rounds, judging, scores,
 * and reveals are owned here.
 *
 * Everyone at the table gets the same pair each round and locks in one line.
 * Each line is judged by Jev as soon as it is accepted and stays hidden. The
 * round reveals when every seated player's line is judged, or when the last
 * player's clock runs out. The reveal is a stored clock (`revealStartedAt`)
 * and order, so every phone shows the same line at the same moment. Other
 * players' text never leaves the server before the reveal.
 */

import {
  abandonMatch,
  beginMatch,
  completeMatch,
  requireActiveMatch,
  resolvePlayer,
} from "@parlor/convex";
import { ConvexError, v } from "convex/values";
import { internal } from "./_generated/api";
import type { Doc, Id } from "./_generated/dataModel";
import {
  internalAction,
  internalMutation,
  internalQuery,
  mutation,
  query,
} from "./_generated/server";
import type { MutationCtx, QueryCtx } from "./_generated/server";
import { PAIRS, pairByKey } from "./deck";
import { gamePhase } from "./schema";
import {
  JudgeUnavailableError,
  readJudgeConfig,
  runAdjudication,
} from "./judge";
import { chargeRateLimit, refundRateLimit } from "./limits";
import {
  configuredProductEnvironment,
  recordProductEvent,
} from "./productEvents";
import { RUBRIC_VERSION, type Pair } from "./rubrics";
import {
  ADVANCE_GRACE_MS,
  checkSentence,
  compareLines,
  composeResult,
  LAST_PLAYER_MS,
  MAX_PLAYERS,
  MIN_PLAYERS,
  ROUNDS_PER_MATCH,
  type JudgedLevels,
  type ZeroReason,
} from "./rules";
import { revealEndsAt } from "../lib/reveal";

type ReadCtx = QueryCtx | MutationCtx;
type Game = Doc<"games">;
type Round = Doc<"rounds">;

function fail(code: string, message?: string): never {
  throw new ConvexError(message === undefined ? { code } : { code, message });
}

function stableHash(text: string): number {
  let hash = 5381;
  for (let index = 0; index < text.length; index += 1) {
    hash = ((hash << 5) + hash + text.charCodeAt(index)) >>> 0;
  }
  return hash;
}

function pickPair(
  roomId: Id<"rooms">,
  cycle: number,
  round: number,
  usedKeys: readonly string[],
): Pair {
  const start = stableHash(`${roomId}:${cycle}:${round}`) % PAIRS.length;
  for (let step = 0; step < PAIRS.length; step += 1) {
    const pair = PAIRS[(start + step) % PAIRS.length]!;
    if (!usedKeys.includes(pair.key)) return pair;
  }
  return PAIRS[start]!;
}

async function seatOf(ctx: ReadCtx, game: Game, playerId: Id<"players">) {
  return ctx.db
    .query("matchParticipants")
    .withIndex("by_match_player", (q) =>
      q.eq("matchId", game.matchId).eq("playerId", playerId),
    )
    .unique();
}

async function gameAccess(
  ctx: ReadCtx,
  gameId: Id<"games">,
  guestToken?: string,
) {
  const game = await ctx.db.get(gameId);
  if (!game) fail("GAME_NOT_FOUND", "That game is gone.");
  const actor = await resolvePlayer(ctx, guestToken);
  if (!(await seatOf(ctx, game, actor.playerId)))
    fail("MATCH_PARTICIPANT_REQUIRED", "You are not seated in this game.");
  return { game, actor };
}

async function roundRow(ctx: ReadCtx, game: Game): Promise<Round> {
  const round = await ctx.db
    .query("rounds")
    .withIndex("by_game_round", (q) =>
      q.eq("gameId", game._id).eq("round", game.round),
    )
    .unique();
  if (!round) fail("GAME_DATA_INVALID", "Round state is missing.");
  return round;
}

async function roundSubmissions(
  ctx: ReadCtx,
  gameId: Id<"games">,
  round: number,
) {
  return ctx.db
    .query("submissions")
    .withIndex("by_game_round", (q) =>
      q.eq("gameId", gameId).eq("round", round),
    )
    .take(MAX_PLAYERS * 2);
}

async function isHostOf(
  ctx: ReadCtx,
  roomId: Id<"rooms">,
  playerId: Id<"players">,
) {
  const room = await ctx.db.get(roomId);
  return room !== null && room.hostPlayerId === playerId;
}

/**
 * Levels behind a judged submission; the reveal recomposes points from these.
 * Rows from an earlier rubric measured something else and never score now.
 */
async function judgedLevels(
  ctx: ReadCtx,
  submission: Doc<"submissions">,
): Promise<JudgedLevels | null> {
  if (submission.status !== "judged" || !submission.adjudicationId) return null;
  const row = await ctx.db.get(submission.adjudicationId);
  if (!row || row.normalized !== submission.normalized) return null;
  if (row.rubricVersion !== RUBRIC_VERSION || !("a" in row.levels)) return null;
  return row.levels;
}

async function insertRound(
  ctx: MutationCtx,
  gameId: Id<"games">,
  round: number,
  pair: Pair,
  startedAt: number,
) {
  await ctx.db.insert("rounds", { gameId, round, pairKey: pair.key });
  await recordProductEvent(ctx, {
    eventId: `double-take:v1:round-start:${gameId}:${round}`,
    eventName: "round_start",
    environment: configuredProductEnvironment(),
    occurredAt: startedAt,
    sessionId: gameId,
    actorId: null,
    props: { roundIndex: round, contextPairId: pair.key },
  });
}

/**
 * Close the round into its reveal if it is ready: nothing is still being
 * judged, and either every seated player has a judged line or the last
 * player's clock has run out. Applies points exactly once.
 */
async function revealIfReady(ctx: MutationCtx, gameId: Id<"games">) {
  const game = await ctx.db.get(gameId);
  if (!game || game.phase !== "writing") return;
  // The host ended this game; late judgments must not reopen it.
  const match = await ctx.db.get(game.matchId);
  if (!match || match.status !== "active") return;
  const round = await roundRow(ctx, game);
  const now = Date.now();
  const submissions = await roundSubmissions(ctx, gameId, game.round);
  if (submissions.some((submission) => submission.status === "pending")) return;
  const judged = new Set(
    submissions
      .filter((submission) => submission.status === "judged")
      .map((submission) => submission.playerId as string),
  );
  const everyoneIn = game.players.every((player) =>
    judged.has(player.playerId as string),
  );
  const clockDone =
    round.lastDeadline !== undefined && now >= round.lastDeadline;
  if (!everyoneIn && !clockDone) return;
  const lines = [];
  for (const submission of submissions) {
    const levels = await judgedLevels(ctx, submission);
    if (levels) lines.push({ submission, ...composeResult(levels) });
  }
  // Lowest first, so the best line lands last; earlier lines break exact ties.
  lines.sort(
    (x, y) =>
      compareLines(y, x) || x.submission.createdAt - y.submission.createdAt,
  );
  const pointsBy = new Map(
    lines.map((line) => [line.submission.playerId as string, line.points]),
  );
  const players = game.players.map((player) => {
    const roundPoints = pointsBy.get(player.playerId as string) ?? 0;
    return { ...player, roundPoints, score: player.score + roundPoints };
  });
  await ctx.db.patch(gameId, { phase: "reveal", players });
  await ctx.db.patch(round._id, {
    revealStartedAt: now,
    revealOrder: lines.map((line) => line.submission._id),
  });
  await recordProductEvent(ctx, {
    eventId: `double-take:v1:round-complete:${gameId}:${game.round}`,
    eventName: "round_complete",
    environment: configuredProductEnvironment(),
    occurredAt: now,
    sessionId: gameId,
    actorId: null,
    props: {
      roundIndex: game.round,
      score: lines.reduce((total, line) => total + line.points, 0),
    },
  });
}

/** Start the next match cycle and its first round. Host only; idempotent by requestId. */
export const start = mutation({
  args: {
    roomId: v.id("rooms"),
    requestId: v.string(),
    guestToken: v.optional(v.string()),
  },
  returns: v.id("games"),
  handler: async (ctx, args) => {
    if (args.requestId.length === 0 || args.requestId.length > 64)
      fail("REQUEST_ID_INVALID", "Start requests need a short identifier.");
    const actor = await resolvePlayer(ctx, args.guestToken);
    const existing = await ctx.db
      .query("games")
      .withIndex("by_room_request", (q) =>
        q.eq("roomId", args.roomId).eq("requestId", args.requestId),
      )
      .unique();
    if (existing) return existing._id;
    const match = await beginMatch(ctx, {
      roomId: args.roomId,
      actor,
      minPlayers: MIN_PLAYERS,
      maxPlayers: MAX_PLAYERS,
    });
    const members = await ctx.db
      .query("roomMembers")
      .withIndex("by_room", (q) => q.eq("roomId", args.roomId))
      .take(64);
    const nameByPlayer = new Map(
      members.map((member) => [member.playerId as string, member.displayName]),
    );
    const participants = await ctx.db
      .query("matchParticipants")
      .withIndex("by_match", (q) => q.eq("matchId", match.id))
      .take(MAX_PLAYERS + 1);
    const players = participants
      .map((participant) => ({
        playerId: participant.playerId,
        name: nameByPlayer.get(participant.playerId as string) ?? "Player",
        seatIndex: participant.seatIndex,
        score: 0,
        roundPoints: 0,
      }))
      .sort((a, b) => a.seatIndex - b.seatIndex);
    const pair = pickPair(args.roomId, match.cycle, 1, []);
    const startedAt = Date.now();
    const gameId = await ctx.db.insert("games", {
      roomId: args.roomId,
      matchId: match.id,
      cycle: match.cycle,
      requestId: args.requestId,
      startedBy: actor.playerId,
      startedAt,
      phase: "writing",
      round: 1,
      pairKey: pair.key,
      players,
    });
    await insertRound(ctx, gameId, 1, pair, startedAt);
    return gameId;
  },
});

/**
 * Lock in one line for the current round and schedule its judgment. A line
 * Jev could not score may be locked in again; anything else is final.
 */
export const submit = mutation({
  args: {
    gameId: v.id("games"),
    text: v.string(),
    guestToken: v.optional(v.string()),
  },
  returns: v.object({ ok: v.boolean(), code: v.optional(v.string()) }),
  handler: async (ctx, args) => {
    const game = await ctx.db.get(args.gameId);
    if (!game) fail("GAME_NOT_FOUND", "That game is gone.");
    const actor = await resolvePlayer(ctx, args.guestToken);
    if (!(await seatOf(ctx, game, actor.playerId)))
      return { ok: false, code: "NOT_SEATED" };
    await requireActiveMatch(ctx, game.matchId, game.roomId);
    if (game.phase !== "writing") return { ok: false, code: "WRONG_PHASE" };
    const round = await roundRow(ctx, game);
    const now = Date.now();
    if (round.lastDeadline !== undefined && now >= round.lastDeadline)
      return { ok: false, code: "WRONG_PHASE" };
    const check = checkSentence(args.text);
    if (!check.ok) return { ok: false, code: check.code };
    const existing = await ctx.db
      .query("submissions")
      .withIndex("by_game_round_player", (q) =>
        q
          .eq("gameId", args.gameId)
          .eq("round", game.round)
          .eq("playerId", actor.playerId),
      )
      .unique();
    if (existing && existing.status !== "failed")
      return { ok: false, code: "ALREADY_LOCKED" };
    try {
      await chargeRateLimit(ctx, actor.playerId, now);
    } catch (error) {
      if (
        error instanceof ConvexError &&
        (error.data as { code?: string }).code === "SLOW_DOWN"
      )
        return { ok: false, code: "SLOW_DOWN" };
      throw error;
    }
    const line = {
      text: check.text,
      normalized: check.normalized,
      wordCount: check.wordCount,
      status: "pending" as const,
      createdAt: now,
    };
    let submissionId: Id<"submissions">;
    if (existing) {
      submissionId = existing._id;
      await ctx.db.patch(existing._id, {
        ...line,
        adjudicationId: undefined,
        failureCode: undefined,
      });
    } else {
      submissionId = await ctx.db.insert("submissions", {
        gameId: args.gameId,
        round: game.round,
        playerId: actor.playerId,
        ...line,
      });
    }
    await recordProductEvent(ctx, {
      eventId: `double-take:v1:submission:${submissionId}:${now}`,
      eventName: "submission",
      environment: configuredProductEnvironment(),
      occurredAt: now,
      sessionId: args.gameId,
      actorId: null,
      props: { roundIndex: game.round, wordCount: check.wordCount },
    });
    if (round.lastDeadline === undefined) {
      const submissions = await roundSubmissions(ctx, args.gameId, game.round);
      const locked = submissions.filter(
        (submission) => submission.status !== "failed",
      ).length;
      if (locked === game.players.length - 1) {
        const lastDeadline = now + LAST_PLAYER_MS;
        await ctx.db.patch(round._id, { lastDeadline });
        await ctx.scheduler.runAt(lastDeadline, internal.game.closeWriting, {
          gameId: args.gameId,
          round: game.round,
        });
      }
    }
    await ctx.scheduler.runAfter(0, internal.game.judgeSubmission, {
      submissionId,
    });
    return { ok: true };
  },
});

/** The last player's clock ran out: reveal whatever is judged. */
export const closeWriting = internalMutation({
  args: { gameId: v.id("games"), round: v.number() },
  handler: async (ctx, args) => {
    const game = await ctx.db.get(args.gameId);
    if (!game || game.round !== args.round) return;
    await revealIfReady(ctx, args.gameId);
  },
});

/** What the judge needs for one pending line, or null when it is no longer pending. */
export const pendingLine = internalQuery({
  args: { submissionId: v.id("submissions") },
  handler: async (ctx, args) => {
    const submission = await ctx.db.get(args.submissionId);
    if (!submission || submission.status !== "pending") return null;
    const round = await ctx.db
      .query("rounds")
      .withIndex("by_game_round", (q) =>
        q.eq("gameId", submission.gameId).eq("round", submission.round),
      )
      .unique();
    if (!round) return null;
    return {
      gameId: submission.gameId,
      round: submission.round,
      pairKey: round.pairKey,
      text: submission.text,
      normalized: submission.normalized,
      createdAt: submission.createdAt,
    };
  },
});

/**
 * Link a pending line to a judgment, reusing a retained one for the same
 * sentence and pair when it exists (a repeat line never calls Jev twice).
 * Returns false when there is nothing to reuse and no fresh judgment.
 */
export const applyJudgment = internalMutation({
  args: {
    submissionId: v.id("submissions"),
    normalized: v.string(),
    createdAt: v.number(),
    fresh: v.optional(
      v.object({
        model: v.string(),
        levels: v.object({
          a: v.number(),
          b: v.number(),
          coherence: v.number(),
        }),
        confidenceMin: v.number(),
        rawJson: v.string(),
      }),
    ),
  },
  returns: v.boolean(),
  handler: async (ctx, args) => {
    const submission = await ctx.db.get(args.submissionId);
    // The player locked in a new line after a failure while this was in flight.
    if (
      !submission ||
      submission.status !== "pending" ||
      submission.normalized !== args.normalized ||
      submission.createdAt !== args.createdAt
    )
      return true;
    const round = await ctx.db
      .query("rounds")
      .withIndex("by_game_round", (q) =>
        q.eq("gameId", submission.gameId).eq("round", submission.round),
      )
      .unique();
    if (!round) return true;
    const retained = await ctx.db
      .query("adjudications")
      .withIndex("by_pair_normalized", (q) =>
        q
          .eq("pairKey", round.pairKey)
          .eq("normalized", args.normalized)
          .eq("rubricVersion", RUBRIC_VERSION),
      )
      .unique();
    let adjudicationId = retained?._id;
    const coherence = retained
      ? retained.levels.coherence
      : args.fresh?.levels.coherence;
    if (!adjudicationId) {
      if (!args.fresh) return false;
      const composed = composeResult(args.fresh.levels);
      adjudicationId = await ctx.db.insert("adjudications", {
        pairKey: round.pairKey,
        normalized: args.normalized,
        rubricVersion: RUBRIC_VERSION,
        model: args.fresh.model,
        levels: args.fresh.levels,
        weaker: composed.weaker,
        points: composed.points,
        gate: composed.zero ?? "ok",
        confidenceMin: args.fresh.confidenceMin,
        rawJson: args.fresh.rawJson,
        createdAt: Date.now(),
      });
    }
    await ctx.db.patch(submission._id, {
      status: "judged",
      adjudicationId,
      failureCode: undefined,
    });
    if (retained) await refundRateLimit(ctx, submission.playerId);
    await recordProductEvent(ctx, {
      eventId: `double-take:v1:judgment:${submission._id}:${submission.createdAt}`,
      eventName: "judgment",
      environment: configuredProductEnvironment(),
      occurredAt: Date.now(),
      sessionId: submission.gameId,
      actorId: null,
      props: {
        roundIndex: submission.round,
        coherence: coherence! >= 2 ? "pass" : "fail",
        refused: false,
      },
    });
    await revealIfReady(ctx, submission.gameId);
    return true;
  },
});

/** Jev could not score the line: unlock it for the player and refund the charge. */
export const failJudgment = internalMutation({
  args: {
    submissionId: v.id("submissions"),
    createdAt: v.number(),
    code: v.string(),
  },
  handler: async (ctx, args) => {
    const submission = await ctx.db.get(args.submissionId);
    if (
      !submission ||
      submission.status !== "pending" ||
      submission.createdAt !== args.createdAt
    )
      return;
    await ctx.db.patch(submission._id, {
      status: "failed",
      failureCode: args.code,
    });
    await refundRateLimit(ctx, submission.playerId);
    await recordProductEvent(ctx, {
      eventId: `double-take:v1:judgment-refused:${submission._id}:${submission.createdAt}`,
      eventName: "judgment",
      environment: configuredProductEnvironment(),
      occurredAt: Date.now(),
      sessionId: submission.gameId,
      actorId: null,
      props: {
        roundIndex: submission.round,
        coherence: "fail",
        refused: true,
        refuseReason: args.code,
      },
    });
    await revealIfReady(ctx, submission.gameId);
  },
});

/** Judge one accepted line with Jev. Scheduled by `submit`; never called by clients. */
export const judgeSubmission = internalAction({
  args: { submissionId: v.id("submissions") },
  handler: async (ctx, args) => {
    const line = await ctx.runQuery(internal.game.pendingLine, args);
    if (!line) return;
    const target = {
      submissionId: args.submissionId,
      normalized: line.normalized,
      createdAt: line.createdAt,
    };
    if (await ctx.runMutation(internal.game.applyJudgment, target)) return;
    const config = readJudgeConfig(
      process.env as Record<string, string | undefined>,
    );
    const pair = pairByKey(line.pairKey);
    if (!config || !pair) {
      await ctx.runMutation(internal.game.failJudgment, {
        submissionId: args.submissionId,
        createdAt: line.createdAt,
        code: config ? "PAIR_UNKNOWN" : "JUDGE_UNCONFIGURED",
      });
      return;
    }
    try {
      const draft = await runAdjudication(config, pair, line.text);
      await ctx.runMutation(internal.game.applyJudgment, {
        ...target,
        fresh: {
          model: draft.model,
          levels: draft.levels,
          confidenceMin: draft.confidenceMin,
          rawJson: draft.rawJson,
        },
      });
    } catch (error) {
      if (!(error instanceof JudgeUnavailableError)) throw error;
      await ctx.runMutation(internal.game.failJudgment, {
        submissionId: args.submissionId,
        createdAt: line.createdAt,
        code: error.code,
      });
    }
  },
});

/** After a reveal: the next round, or the final scores. Host first; anyone after the grace. */
export const advance = mutation({
  args: { gameId: v.id("games"), guestToken: v.optional(v.string()) },
  returns: v.object({
    ok: v.boolean(),
    code: v.optional(v.string()),
    finished: v.optional(v.boolean()),
  }),
  handler: async (ctx, args) => {
    const { game, actor } = await gameAccess(ctx, args.gameId, args.guestToken);
    await requireActiveMatch(ctx, game.matchId, game.roomId);
    if (game.phase !== "reveal") return { ok: false, code: "WRONG_PHASE" };
    const round = await roundRow(ctx, game);
    const now = Date.now();
    const endsAt = revealEndsAt(
      round.revealStartedAt ?? now,
      round.revealOrder?.length ?? 0,
    );
    if (now < endsAt) return { ok: false, code: "REVEAL_RUNNING" };
    const host = await isHostOf(ctx, game.roomId, actor.playerId);
    if (!host && now < endsAt + ADVANCE_GRACE_MS)
      return { ok: false, code: "HOST_REQUIRED" };
    if (game.round >= ROUNDS_PER_MATCH) {
      await ctx.db.patch(args.gameId, { phase: "finished", finishedAt: now });
      await completeMatch(ctx, { matchId: game.matchId, actor });
      return { ok: true, finished: true };
    }
    const played = await ctx.db
      .query("rounds")
      .withIndex("by_game_round", (q) => q.eq("gameId", args.gameId))
      .take(ROUNDS_PER_MATCH);
    const nextRound = game.round + 1;
    const pair = pickPair(
      game.roomId,
      game.cycle,
      nextRound,
      played.map((row) => row.pairKey),
    );
    await ctx.db.patch(args.gameId, {
      round: nextRound,
      pairKey: pair.key,
      phase: "writing",
      players: game.players.map((player) => ({ ...player, roundPoints: 0 })),
    });
    await recordProductEvent(ctx, {
      eventId: `double-take:v1:replay:${args.gameId}:${game.round}`,
      eventName: "replay",
      environment: configuredProductEnvironment(),
      occurredAt: now,
      sessionId: args.gameId,
      actorId: null,
      props: { fromRound: game.round },
    });
    await insertRound(ctx, args.gameId, nextRound, pair, now);
    return { ok: true, finished: false };
  },
});

/**
 * Host ends a running game early; everyone returns to the lobby. Game rows
 * stay; the room shows the lobby because the match is no longer active.
 */
export const endGame = mutation({
  args: { gameId: v.id("games"), guestToken: v.optional(v.string()) },
  returns: v.object({ ok: v.boolean(), code: v.optional(v.string()) }),
  handler: async (ctx, args) => {
    const { game, actor } = await gameAccess(ctx, args.gameId, args.guestToken);
    if (!(await isHostOf(ctx, game.roomId, actor.playerId)))
      return { ok: false, code: "HOST_REQUIRED" };
    const match = await ctx.db.get(game.matchId);
    if (!match || match.status !== "active") return { ok: true };
    await abandonMatch(ctx, {
      matchId: game.matchId,
      reason: "host-ended",
      actor,
    });
    return { ok: true };
  },
});

/**
 * Latest game for a room, for room-scoped clients.
 *
 * The platform completes the match in the same mutation that finishes the
 * game, so a finished game outlives `activeMatch`. Returning the phase lets
 * the room keep the final scores on screen instead of dropping straight to
 * the lobby when the game ends. `closed` is true when the viewer is no longer
 * in this room (the host closed it, or they left elsewhere), so the client can
 * leave instead of failing.
 */
export const forRoom = query({
  args: { roomId: v.id("rooms"), guestToken: v.optional(v.string()) },
  returns: v.object({
    gameId: v.union(v.id("games"), v.null()),
    phase: v.union(gamePhase, v.null()),
    closed: v.boolean(),
  }),
  handler: async (ctx, args) => {
    const actor = await resolvePlayer(ctx, args.guestToken);
    const member = await ctx.db
      .query("roomMembers")
      .withIndex("by_room_player", (q) =>
        q.eq("roomId", args.roomId).eq("playerId", actor.playerId),
      )
      .unique();
    if (!member || member.closedAt !== undefined)
      return { gameId: null, phase: null, closed: true };
    const games = await ctx.db
      .query("games")
      .withIndex("by_room_cycle", (q) => q.eq("roomId", args.roomId))
      .order("desc")
      .take(1);
    const latest = games[0] ?? null;
    return {
      gameId: latest ? latest._id : null,
      phase: latest ? latest.phase : null,
      closed: false,
    };
  },
});

/** What players see of one world: never the judge-only label or setting. */
export type World = { name: string; bg: string; ink: string };
export type PairView = { key: string; a: World; b: World };

/** One judged line in the reveal. Ratings are 0 to 3 per world; points 0 to 6. */
export type RevealLine = {
  playerId: Id<"players">;
  name: string;
  text: string;
  first: number;
  second: number;
  points: number;
  weaker: number;
  zero: ZeroReason | null;
};

export type GameView = {
  gameId: Id<"games">;
  phase: Game["phase"];
  round: number;
  rounds: number;
  pair: PairView;
  hostPlayerId: Id<"players">;
  isHost: boolean;
  /** Epoch ms of the last player's clock; null until all but one are in. */
  lastDeadline: number | null;
  players: {
    playerId: Id<"players">;
    name: string;
    seatIndex: number;
    score: number;
    roundPoints: number;
    locked: boolean;
  }[];
  me: {
    playerId: Id<"players">;
    seated: boolean;
    line: null | { text: string; status: Doc<"submissions">["status"] };
  };
  /** Present from the reveal on; lines in reveal order, lowest first. */
  reveal: null | { startedAt: number; lines: RevealLine[] };
  /** The game's highest scoring line; only once the game is finished. */
  bestLine:
    null | (Omit<RevealLine, "playerId" | "weaker"> & { pair: PairView });
};

function worlds(pair: Pair): PairView {
  const world = (context: Pair["contextA"]): World => ({
    name: context.name,
    bg: context.bg,
    ink: context.ink,
  });
  return { key: pair.key, a: world(pair.contextA), b: world(pair.contextB) };
}

/** Viewer-safe projection. Other players' lines stay hidden until the reveal. */
export const view = query({
  args: { gameId: v.id("games"), guestToken: v.optional(v.string()) },
  handler: async (ctx, args): Promise<GameView> => {
    const game = await ctx.db.get(args.gameId);
    if (!game) fail("GAME_NOT_FOUND", "That game is gone.");
    const actor = await resolvePlayer(ctx, args.guestToken);
    const seated = (await seatOf(ctx, game, actor.playerId)) !== null;
    if (!seated) {
      // Members who joined while a game runs watch it; they are dealt in when
      // the next game starts. Outsiders and leavers may not read anything.
      const member = await ctx.db
        .query("roomMembers")
        .withIndex("by_room_player", (q) =>
          q.eq("roomId", game.roomId).eq("playerId", actor.playerId),
        )
        .unique();
      if (!member || member.closedAt !== undefined)
        fail("NOT_A_ROOM_MEMBER", "Join the game first.");
    }
    const round = await roundRow(ctx, game);
    const pair = pairByKey(game.pairKey);
    if (!pair)
      fail("GAME_DATA_INVALID", "This round references an unknown pair.");
    const submissions = await roundSubmissions(ctx, args.gameId, game.round);
    const mine =
      submissions.find(
        (submission) => submission.playerId === actor.playerId,
      ) ?? null;
    const locked = new Set(
      submissions
        .filter((submission) => submission.status !== "failed")
        .map((submission) => submission.playerId as string),
    );
    const room = await ctx.db.get(game.roomId);
    if (!room) fail("GAME_DATA_INVALID", "The room is missing.");
    const nameOf = (playerId: Id<"players">) =>
      game.players.find((player) => player.playerId === playerId)?.name ??
      "Player";

    let reveal = null;
    if (game.phase !== "writing" && round.revealStartedAt !== undefined) {
      const lines = [];
      for (const submissionId of round.revealOrder ?? []) {
        const submission = submissions.find((row) => row._id === submissionId);
        if (!submission) continue;
        const levels = await judgedLevels(ctx, submission);
        if (!levels) continue;
        const composed = composeResult(levels);
        lines.push({
          playerId: submission.playerId,
          name: nameOf(submission.playerId),
          text: submission.text,
          first: composed.first,
          second: composed.second,
          points: composed.points,
          weaker: composed.weaker,
          zero: composed.zero,
        });
      }
      reveal = { startedAt: round.revealStartedAt, lines };
    }

    let bestLine = null;
    if (game.phase === "finished") {
      const everything = await ctx.db
        .query("submissions")
        .withIndex("by_game_round", (q) => q.eq("gameId", args.gameId))
        .take(MAX_PLAYERS * ROUNDS_PER_MATCH * 2);
      const rounds = await ctx.db
        .query("rounds")
        .withIndex("by_game_round", (q) => q.eq("gameId", args.gameId))
        .take(ROUNDS_PER_MATCH);
      let best = null;
      for (const submission of everything) {
        const levels = await judgedLevels(ctx, submission);
        const linePair = pairByKey(
          rounds.find((row) => row.round === submission.round)?.pairKey ?? "",
        );
        if (!levels || !linePair) continue;
        const candidate = {
          submission,
          levels,
          pair: linePair,
          ...composeResult(levels),
        };
        if (
          !best ||
          compareLines(candidate, best) < 0 ||
          (compareLines(candidate, best) === 0 &&
            submission.createdAt < best.submission.createdAt)
        )
          best = candidate;
      }
      if (best && best.points > 0)
        bestLine = {
          text: best.submission.text,
          name: nameOf(best.submission.playerId),
          points: best.points,
          first: best.first,
          second: best.second,
          zero: best.zero,
          pair: worlds(best.pair),
        };
    }

    return {
      gameId: game._id,
      phase: game.phase,
      round: game.round,
      rounds: ROUNDS_PER_MATCH,
      pair: worlds(pair),
      hostPlayerId: room.hostPlayerId,
      isHost: room.hostPlayerId === actor.playerId,
      lastDeadline: round.lastDeadline ?? null,
      players: game.players.map((player) => ({
        playerId: player.playerId,
        name: player.name,
        seatIndex: player.seatIndex,
        score: player.score,
        roundPoints: player.roundPoints,
        locked: locked.has(player.playerId as string),
      })),
      me: {
        playerId: actor.playerId,
        seated,
        line: mine ? { text: mine.text, status: mine.status } : null,
      },
      reveal,
      bestLine,
    };
  },
});
