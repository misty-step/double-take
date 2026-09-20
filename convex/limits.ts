/**
 * Player-level rate limiting for judge-touching actions.
 *
 * A judge outage never charges here: submissions are charged when accepted,
 * not when a judgment fails, so a retry after an outage stays free.
 */

import { ConvexError } from "convex/values";
import type { Id } from "./_generated/dataModel";
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
      message: "That is a lot of judging in a short window. Wait a few minutes and try again.",
    });
  }
  await ctx.db.patch(existing._id, { count: existing.count + 1 });
}
