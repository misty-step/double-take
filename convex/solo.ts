/**
 * Solo practice: same judge, same rules, no room required.
 *
 * The client holds the practice session locally; the server judges and
 * retains versioned adjudications so duplicate sentences never reroll.
 */

import { resolvePlayer } from "@parlor/convex";
import { ConvexError, v } from "convex/values";
import { internal } from "./_generated/api";
import type { Id } from "./_generated/dataModel";
import { action, internalMutation } from "./_generated/server";
import { pairByKey } from "./content";
import { JudgeUnavailableError, readJudgeConfig, runAdjudication } from "./judge";
import { chargeRateLimit } from "./limits";
import { checkSentence } from "./rules";

export const ensurePlayer = internalMutation({
  args: { guestToken: v.optional(v.string()) },
  handler: async (ctx, args) => {
    if (args.guestToken === undefined) return null;
    try {
      const actor = await resolvePlayer(ctx, args.guestToken, { create: true });
      return actor.playerId;
    } catch {
      return null;
    }
  },
});

export const charge = internalMutation({
  args: { playerId: v.id("players") },
  handler: async (ctx, args) => {
    await chargeRateLimit(ctx, args.playerId, Date.now());
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

type SoloLevels = {
  plausibilityA: number;
  plausibilityB: number;
  coherence: number;
  specificity: number;
};

type SoloJudgment = {
  adjudicationId: Id<"adjudications">;
  reused: boolean;
  rubricVersion: string;
  model: string;
  levels: SoloLevels;
  weaker: number;
  points: number;
  gate: string;
  gateMessage: string;
  confidenceMin: number;
};

type SoloJudgeOutcome = {
  ok: boolean;
  code?: string;
  message?: string;
  result?: SoloJudgment & { text: string };
};

export const judge = action({
  args: {
    sentence: v.string(),
    pairKey: v.string(),
    guestToken: v.optional(v.string()),
  },
  handler: async (ctx, args): Promise<SoloJudgeOutcome> => {
    const check = checkSentence(args.sentence);
    if (!check.ok) return { ok: false, code: check.code, message: check.message };
    const pair = pairByKey(args.pairKey);
    if (!pair)
      return { ok: false, code: "PAIR_UNKNOWN", message: "That context pair does not exist." };
    const config = readJudgeConfig(process.env as Record<string, string | undefined>);
    if (!config)
      return {
        ok: false,
        code: "JUDGE_UNCONFIGURED",
        message: "The judge is not configured on this server yet.",
      };
    const playerId = await ctx.runMutation(internal.solo.ensurePlayer, {
      guestToken: args.guestToken,
    });
    if (playerId) {
      try {
        await ctx.runMutation(internal.solo.charge, { playerId });
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
    }
    try {
      const draft = await runAdjudication(config, pair, check.text);
      const retained = await ctx.runMutation(internal.solo.record, {
        playerId: playerId ?? undefined,
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
      return { ok: true, result: { text: check.text, ...retained } };
    } catch (error) {
      if (error instanceof JudgeUnavailableError)
        return { ok: false, code: error.code, message: error.message };
      throw error;
    }
  },
});
