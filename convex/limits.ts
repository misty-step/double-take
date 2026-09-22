/**
 * Player-level rate limiting for judge-touching actions.
 *
 * A judge outage never charges here: charges happen when an action is about
 * to spend, and a failed pass is refunded, so a retry after an outage stays
 * free. Every judge-touching entry point must charge before spending.
 */

import { ConvexError, v } from "convex/values";
import type { Id } from "./_generated/dataModel";
import { internalMutation } from "./_generated/server";
import type { MutationCtx } from "./_generated/server";
import { JUDGE_RATE_LIMIT } from "./rules";

export async function chargeRateLimit(
  ctx: MutationCtx,
  playerId: Id<"players">,
  now: number,
): Promise<void> {
  const existing = await ctx.db
    .query("rateLimits")
    .withIndex("by_player", (q) => q.eq("playerId", playerId))
    .unique();
  if (!existing) {
    await ctx.db.insert("rateLimits", { playerId, windowStart: now, count: 1 });
    return;
  }
  if (now - existing.windowStart >= JUDGE_RATE_LIMIT.windowMs) {
    await ctx.db.patch(existing._id, { windowStart: now, count: 1 });
    return;
  }
  if (existing.count >= JUDGE_RATE_LIMIT.max) {
    throw new ConvexError({
      code: "SLOW_DOWN",
      message:
        "That is a lot of judging in a short window. Wait a few minutes and try again.",
    });
  }
  await ctx.db.patch(existing._id, { count: existing.count + 1 });
}

/** Give back one charge in the current window. Never goes below zero. */
export async function refundRateLimit(
  ctx: MutationCtx,
  playerId: Id<"players">,
): Promise<void> {
  const existing = await ctx.db
    .query("rateLimits")
    .withIndex("by_player", (q) => q.eq("playerId", playerId))
    .unique();
  if (!existing || existing.count <= 0) return;
  await ctx.db.patch(existing._id, { count: existing.count - 1 });
}

/** Charge a player for one judge-touching pass, before it spends. */
export const charge = internalMutation({
  args: { playerId: v.id("players") },
  handler: async (ctx, args) => {
    await chargeRateLimit(ctx, args.playerId, Date.now());
  },
});

/** Refund one charge after a pass that spent nothing (outage, empty, stale). */
export const refund = internalMutation({
  args: { playerId: v.id("players") },
  handler: async (ctx, args) => {
    await refundRateLimit(ctx, args.playerId);
  },
});
