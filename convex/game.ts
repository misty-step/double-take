/**
 * Double Take game server: rooms come from Parlor; rules, phases, judging,
 * scores, and reveals are owned here.
 *
 * Clients submit intentions (a sentence). The server validates, charges,
 * judges through Jev, retains versioned adjudications, applies the points
 * table, and only then reveals. Other players' text never leaves the server
 * before the reveal phase.
 */

import { beginMatch, completeMatch, requireActiveMatch, resolvePlayer } from "@parlor/convex";
import { ConvexError, v } from "convex/values";
import { internal } from "./_generated/api";
import type { Doc, Id } from "./_generated/dataModel";
import { action, internalMutation, internalQuery, mutation, query } from "./_generated/server";
import type { MutationCtx, QueryCtx } from "./_generated/server";
import { PAIRS, pairByKey } from "./content";
import { JudgeUnavailableError, readJudgeConfig, runAdjudication } from "./judge";
import { chargeRateLimit } from "./limits";
import {
  checkSentence,
  MAX_SUBMISSIONS_PER_ROUND,
  ROUNDS_PER_MATCH,
  WRITING_WINDOW_MS,
} from "./rules";

type ReadCtx = QueryCtx | MutationCtx;
type Game = Doc<"games">;

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

function pickPair(roomId: Id<"rooms">, cycle: number, round: number, previousKey?: string) {
  const start = stableHash(`${roomId}:${cycle}:${round}`) % PAIRS.length;
  let pair = PAIRS[start]!;
  if (previousKey !== undefined && pair.key === previousKey) {
    pair = PAIRS[(start + 1) % PAIRS.length]!;
  }
  return pair;
}

async function gameAccess(ctx: ReadCtx, gameId: Id<"games">, guestToken?: string) {
  const game = await ctx.db.get(gameId);
  if (!game) fail("GAME_NOT_FOUND", "That table is gone.");
  const actor = await resolvePlayer(ctx, guestToken);
  const participant = await ctx.db
    .query("matchParticipants")
    .withIndex("by_match_player", (q) =>
      q.eq("matchId", game.matchId).eq("playerId", actor.playerId),
    )
    .unique();
  if (!participant) fail("MATCH_PARTICIPANT_REQUIRED", "You are not seated at this table.");
  return { game, actor };
}

async function roundRow(ctx: ReadCtx, game: Game) {
  const round = await ctx.db
    .query("rounds")
    .withIndex("by_game_round", (q) => q.eq("gameId", game._id).eq("round", game.round))
    .unique();
  if (!round) fail("GAME_DATA_INVALID", "Round state is missing.");
  return round;
}

async function isHostOf(ctx: ReadCtx, roomId: Id<"rooms">, playerId: Id<"players">) {
  const room = await ctx.db.get(roomId);
  return room !== null && room.hostPlayerId === playerId;
}

/** Start the next match cycle and the first round. Host only; idempotent by requestId. */
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
      minPlayers: 2,
      maxPlayers: 12,
    });
    const members = await ctx.db
      .query("roomMembers")
      .withIndex("by_room", (q) => q.eq("roomId", args.roomId))
      .take(64);
    const nameByPlayer = new Map(members.map((member) => [member.playerId as string, member]));
    const participants = await ctx.db
      .query("matchParticipants")
      .withIndex("by_match", (q) => q.eq("matchId", match.id))
      .take(16);
    const players = participants
      .map((participant) => ({
        playerId: participant.playerId,
        name: nameByPlayer.get(participant.playerId as string)?.displayName ?? "Player",
        seatIndex: participant.seatIndex,
        score: 0,
        roundPoints: 0,
      }))
      .sort((a, b) => a.seatIndex - b.seatIndex);
    const pair = pickPair(args.roomId, match.cycle, 1);
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
    await ctx.db.insert("rounds", {
      gameId,
      round: 1,
      pairKey: pair.key,
      deadline: startedAt + WRITING_WINDOW_MS,
    });
    return gameId;
  },
});

/** Accept or revise one sentence for the current round. Never judges. */
export const submit = mutation({
  args: {
    gameId: v.id("games"),
    text: v.string(),
    guestToken: v.optional(v.string()),
  },
  returns: v.object({
    ok: v.boolean(),
    code: v.optional(v.string()),
    message: v.optional(v.string()),
    wordCount: v.optional(v.number()),
  }),
  handler: async (ctx, args) => {
    const { game, actor } = await gameAccess(ctx, args.gameId, args.guestToken);
    await requireActiveMatch(ctx, game.matchId, game.roomId);
    if (game.phase !== "writing")
      return { ok: false, code: "WRONG_PHASE", message: "This round is already closed." };
    const round = await roundRow(ctx, game);
    const now = Date.now();
    if (now > round.deadline)
      return {
        ok: false,
        code: "DEADLINE_PASSED",
        message: "The writing window closed. Wait for the reveal.",
      };
    const check = checkSentence(args.text);
    if (!check.ok) return { ok: false, code: check.code, message: check.message };
    const existing = await ctx.db
      .query("submissions")
      .withIndex("by_game_round_player", (q) =>
        q.eq("gameId", args.gameId).eq("round", game.round).eq("playerId", actor.playerId),
      )
      .unique();
    if (existing && existing.revision >= MAX_SUBMISSIONS_PER_ROUND)
      return {
        ok: false,
        code: "REVISION_LIMIT",
        message: "That was the last revision for this round. Live with it — or don't.",
      };
    // Charge only accepted lines; refused revisions never cost a token.
    await chargeRateLimit(ctx, actor.playerId, now);
    if (existing) {
      await ctx.db.patch(existing._id, {
        text: check.text,
        normalized: check.normalized,
        wordCount: check.wordCount,
        status: "pending",
        adjudicationId: undefined,
        failureCode: undefined,
        revision: existing.revision + 1,
        createdAt: now,
      });
    } else {
      await ctx.db.insert("submissions", {
        gameId: args.gameId,
        round: game.round,
        playerId: actor.playerId,
        text: check.text,
        normalized: check.normalized,
        wordCount: check.wordCount,
        status: "pending",
        revision: 1,
        createdAt: now,
      });
    }
    return { ok: true, wordCount: check.wordCount };
  },
});

/** Pending submissions of the current round, server-side only. */
export const pendingSubmissions = internalQuery({
  args: { gameId: v.id("games") },
  handler: async (ctx, args) => {
    const game = await ctx.db.get(args.gameId);
    if (!game) return null;
    const submissions = await ctx.db
      .query("submissions")
      .withIndex("by_game_round", (q) => q.eq("gameId", args.gameId).eq("round", game.round))
      .take(16);
    const pair = pairByKey(game.pairKey);
    if (!pair) return null;
    return {
      round: game.round,
      pairKey: game.pairKey,
      submissions: submissions
        .filter((submission) => submission.status === "pending")
        .map((submission) => ({
          submissionId: submission._id,
          text: submission.text,
          normalized: submission.normalized,
          revision: submission.revision,
        })),
    };
  },
});

/** Retain one versioned adjudication; duplicates reuse the first judgment. */
export const applyAdjudication = internalMutation({
  args: {
    submissionId: v.id("submissions"),
    pairKey: v.string(),
    normalized: v.string(),
    revision: v.number(),
    rubricVersion: v.string(),
    model: v.string(),
    levels: v.object({
      plausibilityA: v.number(),
      plausibilityB: v.number(),
      coherence: v.number(),
      specificity: v.number(),
    }),
    weaker: v.number(),
    points: v.number(),
    gate: v.string(),
    gateMessage: v.string(),
    confidenceMin: v.number(),
    rawJson: v.string(),
  },
  handler: async (ctx, args) => {
    const submission = await ctx.db.get(args.submissionId);
    if (!submission || submission.status !== "pending") return { applied: false, stale: false };
    if (submission.revision !== args.revision || submission.normalized !== args.normalized)
      // The writer revised while this judgment was in flight. Leave it pending
      // so the fresh text gets its own pass instead of a stale score.
      return { applied: false, stale: true };
    const retained = await ctx.db
      .query("adjudications")
      .withIndex("by_pair_normalized", (q) =>
        q
          .eq("pairKey", args.pairKey)
          .eq("normalized", args.normalized)
          .eq("rubricVersion", args.rubricVersion),
      )
      .unique();
    const adjudicationId =
      retained?._id ??
      (await ctx.db.insert("adjudications", {
        pairKey: args.pairKey,
        normalized: args.normalized,
        rubricVersion: args.rubricVersion,
        model: args.model,
        levels: args.levels,
        weaker: args.weaker,
        points: args.points,
        gate: args.gate,
        gateMessage: args.gateMessage,
        confidenceMin: args.confidenceMin,
        rawJson: args.rawJson,
        createdAt: Date.now(),
      }));
    await ctx.db.patch(submission._id, {
      status: "judged",
      adjudicationId,
      failureCode: undefined,
    });
    return { applied: true, reused: retained !== null && retained !== undefined };
  },
});

/**
 * Gate for the paid judge action: the caller must be a seated participant.
 * Charges one rate-limit token before any evaluator spend; the pass is
 * refunded when nothing was judged.
 */
export const judgeGate = internalMutation({
  args: { gameId: v.id("games"), guestToken: v.optional(v.string()) },
  returns: v.object({
    ok: v.boolean(),
    code: v.optional(v.string()),
    message: v.optional(v.string()),
    playerId: v.optional(v.id("players")),
  }),
  handler: async (ctx, args) => {
    const game = await ctx.db.get(args.gameId);
    if (!game) return { ok: false, code: "GAME_NOT_FOUND", message: "No such game." };
    let playerId: Id<"players">;
    try {
      const actor = await resolvePlayer(ctx, args.guestToken);
      playerId = actor.playerId;
    } catch {
      return {
        ok: false,
        code: "NOT_AUTHORIZED",
        message: "A seat at the table is required before the judge will answer.",
      };
    }
    const participant = await ctx.db
      .query("matchParticipants")
      .withIndex("by_match_player", (q) =>
        q.eq("matchId", game.matchId).eq("playerId", playerId),
      )
      .unique();
    if (!participant)
      return {
        ok: false,
        code: "MATCH_PARTICIPANT_REQUIRED",
        message: "You are not seated at this table.",
      };
    try {
      await chargeRateLimit(ctx, playerId, Date.now());
    } catch (error) {
      const data = (error as { data?: { code?: string; message?: string } }).data;
      if (data?.code === "SLOW_DOWN")
        return {
          ok: false,
          code: "SLOW_DOWN",
          message: data.message ?? "Slow down for a minute.",
        };
      throw error;
    }
    return { ok: true, playerId };
  },
});

type JudgeOutcome = {
  ok: boolean;
  judged: number;
  failed: number;
  code?: string;
  message?: string;
};

/**
 * Judge every pending submission of the current round. Seated participants
 * only; charges before spending and refunds a pass that judged nothing, so a
 * judge outage or a stale in-flight line never costs anything.
 */
export const judge = action({
  args: { gameId: v.id("games"), guestToken: v.optional(v.string()) },
  returns: v.object({
    ok: v.boolean(),
    judged: v.number(),
    failed: v.number(),
    code: v.optional(v.string()),
    message: v.optional(v.string()),
  }),
  handler: async (ctx, args): Promise<JudgeOutcome> => {
    const config = readJudgeConfig(process.env as Record<string, string | undefined>);
    if (!config)
      return {
        ok: false,
        judged: 0,
        failed: 0,
        code: "JUDGE_UNCONFIGURED",
        message: "The judge is not configured on this server yet.",
      };
    const gate = await ctx.runMutation(internal.game.judgeGate, {
      gameId: args.gameId,
      guestToken: args.guestToken,
    });
    const playerId = gate.playerId;
    if (!gate.ok || playerId === undefined)
      return {
        ok: false,
        judged: 0,
        failed: 0,
        code: gate.code ?? "NOT_AUTHORIZED",
        message: gate.message ?? "A seat at the table is required.",
      };
    const pending = await ctx.runQuery(internal.game.pendingSubmissions, {
      gameId: args.gameId,
    });
    if (!pending)
      return { ok: false, judged: 0, failed: 0, code: "GAME_NOT_FOUND", message: "No such game." };
    const pair = pairByKey(pending.pairKey);
    if (!pair)
      return {
        ok: false,
        judged: 0,
        failed: 0,
        code: "PAIR_UNKNOWN",
        message: "This round references an unknown pair.",
      };
    let judged = 0;
    let failed = 0;
    let lastCode: string | undefined;
    let lastMessage: string | undefined;
    for (const item of pending.submissions) {
      try {
        const draft = await runAdjudication(config, pair, item.text);
        const applied = await ctx.runMutation(internal.game.applyAdjudication, {
          submissionId: item.submissionId,
          pairKey: pending.pairKey,
          normalized: item.normalized,
          revision: item.revision,
          rubricVersion: draft.rubricVersion,
          model: draft.model,
          levels: draft.levels,
          weaker: draft.composed.weaker,
          points: draft.composed.points,
          gate: draft.composed.gate,
          gateMessage: draft.composed.gateMessage,
          confidenceMin: draft.confidenceMin,
          rawJson: draft.rawJson,
        });
        if (applied.applied) judged += 1;
      } catch (error) {
        if (error instanceof JudgeUnavailableError) {
          failed += 1;
          lastCode = error.code;
          lastMessage = error.message;
        } else {
          throw error;
        }
      }
    }
    if (judged === 0)
      // The pass spent nothing (empty round, stale lines, or an outage).
      await ctx.runMutation(internal.limits.refund, { playerId });
    if (failed > 0)
      return {
        ok: false,
        judged,
        failed,
        code: lastCode ?? "JUDGE_UNAVAILABLE",
        message: lastMessage ?? "The judge did not answer. Nothing was scored; retry is free.",
      };
    return { ok: true, judged, failed: 0 };
  },
});

/** Apply the points table once, then move to the reveal. */
export const beginReveal = mutation({
  args: {
    gameId: v.id("games"),
    force: v.optional(v.boolean()),
    guestToken: v.optional(v.string()),
  },
  returns: v.object({ ok: v.boolean(), code: v.optional(v.string()), message: v.optional(v.string()) }),
  handler: async (ctx, args) => {
    const { game, actor } = await gameAccess(ctx, args.gameId, args.guestToken);
    await requireActiveMatch(ctx, game.matchId, game.roomId);
    if (game.phase !== "writing")
      return { ok: false, code: "WRONG_PHASE", message: "Already revealing." };
    const round = await roundRow(ctx, game);
    const submissions = await ctx.db
      .query("submissions")
      .withIndex("by_game_round", (q) => q.eq("gameId", args.gameId).eq("round", game.round))
      .take(16);
    const judged = submissions.filter((submission) => submission.status === "judged");
    const allJudged = submissions.length === game.players.length && judged.length === submissions.length;
    const deadlinePassed = Date.now() > round.deadline;
    const host = await isHostOf(ctx, game.roomId, actor.playerId);
    if (!allJudged && !deadlinePassed && !(args.force === true && host))
      return {
        ok: false,
        code: "NOT_READY",
        message: "Waiting for every sentence (or the clock).",
      };
    const players = game.players.map((player) => ({ ...player }));
    for (const submission of judged) {
      if (!submission.adjudicationId) continue;
      const adjudication = await ctx.db.get(submission.adjudicationId);
      if (!adjudication) continue;
      if (adjudication.normalized !== submission.normalized) continue;
      const index = players.findIndex((player) => player.playerId === submission.playerId);
      if (index < 0) continue;
      players[index] = {
        ...players[index]!,
        roundPoints: adjudication.points,
        score: players[index]!.score + adjudication.points,
      };
    }
    await ctx.db.patch(args.gameId, { phase: "reveal", players });
    return { ok: true };
  },
});

/** Host advances: next round, or finish the match. */
export const advance = mutation({
  args: { gameId: v.id("games"), guestToken: v.optional(v.string()) },
  returns: v.object({
    ok: v.boolean(),
    code: v.optional(v.string()),
    message: v.optional(v.string()),
    finished: v.optional(v.boolean()),
  }),
  handler: async (ctx, args) => {
    const { game, actor } = await gameAccess(ctx, args.gameId, args.guestToken);
    await requireActiveMatch(ctx, game.matchId, game.roomId);
    if (game.phase !== "reveal")
      return { ok: false, code: "WRONG_PHASE", message: "Not revealing yet." };
    const host = await isHostOf(ctx, game.roomId, actor.playerId);
    const round = await roundRow(ctx, game);
    const gracePassed = Date.now() > round.deadline + 45_000;
    if (!host && !gracePassed)
      return { ok: false, code: "HOST_REQUIRED", message: "The host advances the table." };
    if (game.round >= ROUNDS_PER_MATCH) {
      await ctx.db.patch(args.gameId, { phase: "finished", finishedAt: Date.now() });
      await completeMatch(ctx, { matchId: game.matchId, actor });
      return { ok: true, finished: true };
    }
    const previous = pairByKey(game.pairKey);
    const pair = pickPair(game.roomId, game.cycle, game.round + 1, previous?.key);
    const startedAt = Date.now();
    const players = game.players.map((player) => ({ ...player, roundPoints: 0 }));
    await ctx.db.insert("rounds", {
      gameId: args.gameId,
      round: game.round + 1,
      pairKey: pair.key,
      deadline: startedAt + WRITING_WINDOW_MS,
    });
    await ctx.db.patch(args.gameId, {
      round: game.round + 1,
      pairKey: pair.key,
      phase: "writing",
      players,
    });
    return { ok: true, finished: false };
  },
});

/** Latest game for a room, for room-scoped clients. Members only. */
export const forRoom = query({
  args: { roomId: v.id("rooms"), guestToken: v.optional(v.string()) },
  handler: async (ctx, args) => {
    const actor = await resolvePlayer(ctx, args.guestToken);
    const member = await ctx.db
      .query("roomMembers")
      .withIndex("by_room_player", (q) =>
        q.eq("roomId", args.roomId).eq("playerId", actor.playerId),
      )
      .unique();
    if (!member || member.closedAt !== undefined) fail("NOT_A_ROOM_MEMBER", "Join the table first.");
    const games = await ctx.db
      .query("games")
      .withIndex("by_room_cycle", (q) => q.eq("roomId", args.roomId))
      .order("desc")
      .take(1);
    return games[0]?._id ?? null;
  },
});

/** Viewer-safe projection. Hidden text stays hidden until the reveal. */
export const view = query({
  args: { gameId: v.id("games"), guestToken: v.optional(v.string()) },
  handler: async (ctx, args) => {
    const { game, actor } = await gameAccess(ctx, args.gameId, args.guestToken);
    const round = await roundRow(ctx, game);
    const pair = pairByKey(game.pairKey);
    if (!pair) fail("GAME_DATA_INVALID", "This round references an unknown pair.");
    const submissions = await ctx.db
      .query("submissions")
      .withIndex("by_game_round", (q) => q.eq("gameId", args.gameId).eq("round", game.round))
      .take(16);
    const mine = submissions.find((submission) => submission.playerId === actor.playerId) ?? null;
    const submittedBy = new Set(submissions.map((submission) => submission.playerId as string));
    const judgedBy = new Set(
      submissions
        .filter((submission) => submission.status === "judged")
        .map((submission) => submission.playerId as string),
    );
    const host = await isHostOf(ctx, game.roomId, actor.playerId);
    const players = game.players.map((player) => ({
      playerId: player.playerId,
      name: player.name,
      seatIndex: player.seatIndex,
      score: player.score,
      roundPoints: player.roundPoints,
      submitted: submittedBy.has(player.playerId as string),
      judged: judgedBy.has(player.playerId as string),
    }));
    let reveal = null;
    if (game.phase !== "writing") {
      const items = [];
      for (const submission of submissions) {
        let adjudication = null;
        if (submission.adjudicationId) {
          const row = await ctx.db.get(submission.adjudicationId);
          if (row)
            adjudication = {
              levels: row.levels,
              weaker: row.weaker,
              points: row.points,
              gate: row.gate,
              gateMessage: row.gateMessage,
              confidenceMin: row.confidenceMin,
              rubricVersion: row.rubricVersion,
            };
        }
        items.push({
          playerId: submission.playerId,
          name: game.players.find((player) => player.playerId === submission.playerId)?.name ?? "Player",
          text: submission.text,
          status: submission.status,
          adjudication,
        });
      }
      items.sort((a, b) => a.name.localeCompare(b.name));
      reveal = { submissions: items };
    }
    return {
      gameId: game._id,
      phase: game.phase,
      round: game.round,
      rounds: ROUNDS_PER_MATCH,
      pair: {
        key: pair.key,
        title: pair.title,
        contextA: pair.contextA,
        contextB: pair.contextB,
      },
      deadline: round.deadline,
      host,
      players,
      me: {
        playerId: actor.playerId,
        submission: mine
          ? {
              text: mine.text,
              wordCount: mine.wordCount,
              status: mine.status,
              revision: mine.revision,
            }
          : null,
      },
      reveal,
    };
  },
});
