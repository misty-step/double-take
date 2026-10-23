import { sweepAbandonedMatches } from "@parlor/convex";
import { v } from "convex/values";
import { internal } from "./_generated/api";
import { internalAction, internalMutation } from "./_generated/server";
import { backendSignal } from "../lib/backend-telemetry";

/** Continue bounded pages, rather than repeatedly starving later active rooms. */
export const sweepAbandoned = internalMutation({
  args: {
    cursor: v.optional(v.string()),
    actionPages: v.optional(v.boolean()),
  },
  returns: v.object({
    scanned: v.number(),
    abandoned: v.number(),
    hasMore: v.boolean(),
    continueCursor: v.union(v.string(), v.null()),
  }),
  handler: async (
    ctx,
    args,
  ): Promise<{
    scanned: number;
    abandoned: number;
    hasMore: boolean;
    continueCursor: string | null;
  }> => {
    const result = await sweepAbandonedMatches(ctx, {
      limit: 50,
      cursor: args.cursor,
    });
    if (!args.actionPages && result.hasMore && result.continueCursor !== null) {
      await ctx.scheduler.runAfter(0, internal.maintenance.sweepAbandoned, {
        cursor: result.continueCursor,
      });
    }
    return result;
  },
});

/** The cron's action can deliver health without network I/O in a mutation. */
export const sweepWithHealth = internalAction({
  args: {},
  handler: async (ctx) => {
    try {
      let cursor: string | undefined;
      for (;;) {
        const result = await ctx.runMutation(
          internal.maintenance.sweepAbandoned,
          {
            cursor,
            actionPages: true,
          },
        );
        if (!result.hasMore || result.continueCursor === null) break;
        cursor = result.continueCursor;
      }
      await backendSignal("maintenance", "ok");
    } catch (error) {
      await backendSignal("maintenance", "error");
      throw error;
    }
  },
});
