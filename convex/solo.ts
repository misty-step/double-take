/**
 * Solo practice: same judge, same rules, no room required.
 *
 * The client holds the practice session locally; the server judges and
 * retains versioned adjudications so duplicate sentences never reroll.
 */

import { resolvePlayer } from "@parlor/convex";
import { v } from "convex/values";
import { internal } from "./_generated/api";
import { action, internalMutation } from "./_generated/server";
import { pairByKey } from "./content";
import {
  JudgeUnavailableError,
  readJudgeConfig,
  runAdjudication,
} from "./judge";
import { configuredProductEnvironment } from "./productEvents";
import { checkSentence } from "./rules";
import {
  toPlayerAdjudication,
  type PlayerAdjudication,
} from "../lib/player-adjudication";

export const ensurePlayer = internalMutation({
  args: { guestToken: v.optional(v.string()) },
  handler: async (ctx, args) => {
    try {
      const actor = await resolvePlayer(ctx, args.guestToken, { create: true });
      return actor.playerId;
    } catch {
      return null;
    }
  },
});

export const record = internalMutation({
  args: {
    playerId: v.optional(v.id("players")),
    pairKey: v.string(),
    normalized: v.string(),
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
    const retained = await ctx.db
      .query("adjudications")
      .withIndex("by_pair_normalized", (q) =>
        q
          .eq("pairKey", args.pairKey)
          .eq("normalized", args.normalized)
          .eq("rubricVersion", args.rubricVersion),
      )
      .unique();
    if (retained) {
      return {
        adjudicationId: retained._id,
        reused: true,
        rubricVersion: retained.rubricVersion,
        model: retained.model,
        levels: retained.levels,
        weaker: retained.weaker,
        points: retained.points,
        gate: retained.gate,
        gateMessage: retained.gateMessage,
        confidenceMin: retained.confidenceMin,
      };
    }
    const adjudicationId = await ctx.db.insert("adjudications", {
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
    });
    return {
      adjudicationId,
      reused: false,
      rubricVersion: args.rubricVersion,
      model: args.model,
      levels: args.levels,
      weaker: args.weaker,
      points: args.points,
      gate: args.gate,
      gateMessage: args.gateMessage,
      confidenceMin: args.confidenceMin,
    };
  },
});

type SoloJudgeOutcome = {
  ok: boolean;
  code?: string;
  message?: string;
  result?: PlayerAdjudication & { text: string };
};

export const judge = action({
  args: {
    sentence: v.string(),
    pairKey: v.string(),
    sessionId: v.string(),
    roundIndex: v.number(),
    guestToken: v.optional(v.string()),
  },
  handler: async (ctx, args): Promise<SoloJudgeOutcome> => {
    const check = checkSentence(args.sentence);
    if (!check.ok)
      return { ok: false, code: check.code, message: check.message };
    const pair = pairByKey(args.pairKey);
    if (!pair)
      return {
        ok: false,
        code: "PAIR_UNKNOWN",
        message: "That context pair does not exist.",
      };
    if (
      !/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
        args.sessionId,
      ) ||
      !Number.isInteger(args.roundIndex) ||
      args.roundIndex < 1
    )
      return {
        ok: false,
        code: "SESSION_INVALID",
        message: "Start a fresh practice session and try again.",
      };
    const playerId = await ctx.runMutation(internal.solo.ensurePlayer, {
      guestToken: args.guestToken,
    });
    if (!playerId)
      return {
        ok: false,
        code: "NOT_AUTHORIZED",
        message: "A guest seat is required before the judge will answer.",
      };
    const environment = configuredProductEnvironment();
    const emit = (event: {
      eventId: string;
      eventName: string;
      props: Record<string, unknown>;
    }) =>
      ctx.runMutation(internal.productEvents.ingest, {
        ...event,
        environment,
        occurredAt: Date.now(),
        sessionId: args.sessionId,
        actorId: null,
      });
    if (args.roundIndex > 1) {
      await emit({
        eventId: `double-take:v1:solo-replay:${args.sessionId}:${args.roundIndex}`,
        eventName: "replay",
        props: { fromRound: args.roundIndex - 1 },
      });
    }
    await emit({
      eventId: `double-take:v1:solo-round-start:${args.sessionId}:${args.roundIndex}`,
      eventName: "round_start",
      props: { roundIndex: args.roundIndex, contextPairId: pair.key },
    });
    await emit({
      eventId: `double-take:v1:solo-submission:${args.sessionId}:${args.roundIndex}`,
      eventName: "submission",
      props: { roundIndex: args.roundIndex, wordCount: check.wordCount },
    });
    const config = readJudgeConfig(
      process.env as Record<string, string | undefined>,
    );
    if (!config) {
      await emit({
        eventId: `double-take:v1:solo-judgment-refused:${args.sessionId}:${args.roundIndex}:unconfigured`,
        eventName: "judgment",
        props: {
          roundIndex: args.roundIndex,
          coherence: "fail",
          specificity: "fail",
          refused: true,
          refuseReason: "unconfigured",
        },
      });
      return {
        ok: false,
        code: "JUDGE_UNCONFIGURED",
        message: "The judge is not configured on this server yet.",
      };
    }
    try {
      await ctx.runMutation(internal.limits.charge, { playerId });
    } catch (error) {
      const data = (error as { data?: { code?: string; message?: string } })
        .data;
      if (data?.code === "SLOW_DOWN")
        return {
          ok: false,
          code: "SLOW_DOWN",
          message: data.message ?? "Slow down for a minute.",
        };
      throw error;
    }
    try {
      const draft = await runAdjudication(config, pair, check.text);
      const retained = await ctx.runMutation(internal.solo.record, {
        playerId,
        pairKey: pair.key,
        normalized: check.normalized,
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
      await emit({
        eventId: `double-take:v1:solo-judgment:${args.sessionId}:${args.roundIndex}`,
        eventName: "judgment",
        props: {
          roundIndex: args.roundIndex,
          coherence: retained.levels.coherence >= 2 ? "pass" : "fail",
          specificity: retained.levels.specificity >= 2 ? "pass" : "fail",
          refused: false,
        },
      });
      await emit({
        eventId: `double-take:v1:solo-round-complete:${args.sessionId}:${args.roundIndex}`,
        eventName: "round_complete",
        props: { roundIndex: args.roundIndex, score: retained.points },
      });
      return {
        ok: true,
        result: { text: check.text, ...toPlayerAdjudication(retained) },
      };
    } catch (error) {
      if (error instanceof JudgeUnavailableError) {
        // A judge outage must not cost a charge; the retry stays free.
        await ctx.runMutation(internal.limits.refund, { playerId });
        await emit({
          eventId: `double-take:v1:solo-judgment-refused:${args.sessionId}:${args.roundIndex}:${error.code}`,
          eventName: "judgment",
          props: {
            roundIndex: args.roundIndex,
            coherence: "fail",
            specificity: "fail",
            refused: true,
            refuseReason: error.code,
          },
        });
        return { ok: false, code: error.code, message: error.message };
      }
      throw error;
    }
  },
});
