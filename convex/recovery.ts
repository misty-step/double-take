import { v } from "convex/values";
import { internal } from "./_generated/api";
import { internalMutation } from "./_generated/server";

/** Re-derive snapshot-omitted work without changing accepted user documents. */
export const rearm = internalMutation({
  args: {
    table: v.union(v.literal("submissions"), v.literal("rounds")),
    cursor: v.union(v.string(), v.null()),
  },
  handler: async (ctx, args) => {
    const jobs = await ctx.db.system
      .query("_scheduled_functions")
      .filter((q) =>
        q.or(
          q.eq(q.field("state.kind"), "pending"),
          q.eq(q.field("state.kind"), "inProgress"),
        ),
      )
      .take(1001);
    // Atomic failure: an overflow must never silently hide a duplicate.
    if (jobs.length > 1000) throw new Error("Rearm active-job bound exceeded");
    let scheduled = 0;
    if (args.table === "submissions") {
      const page = await ctx.db
        .query("submissions")
        .paginate({ cursor: args.cursor, numItems: 50 });
      for (const row of page.page) {
        if (row.status !== "pending") continue;
        const game = await ctx.db.get(row.gameId);
        if (!game || game.phase !== "writing" || game.round !== row.round)
          continue;
        const match = await ctx.db.get(game.matchId);
        if (match?.status !== "active") continue;
        if (
          !jobs.some(
            (job) =>
              job.name.replace(/\.js:/, ":") === "game:judgeSubmission" &&
              job.args[0]?.submissionId === row._id,
          )
        ) {
          await ctx.scheduler.runAfter(0, internal.game.judgeSubmission, {
            submissionId: row._id,
          });
          scheduled++;
        }
      }
      return {
        scanned: page.page.length,
        scheduled,
        cursor: page.isDone ? null : page.continueCursor,
      };
    }
    const page = await ctx.db
      .query("rounds")
      .paginate({ cursor: args.cursor, numItems: 50 });
    for (const row of page.page) {
      if (row.lastDeadline === undefined || row.revealStartedAt !== undefined)
        continue;
      const game = await ctx.db.get(row.gameId);
      if (!game || game.phase !== "writing" || game.round !== row.round)
        continue;
      const match = await ctx.db.get(game.matchId);
      if (match?.status !== "active") continue;
      if (
        !jobs.some(
          (job) =>
            job.name.replace(/\.js:/, ":") === "game:closeWriting" &&
            job.args[0]?.gameId === row.gameId &&
            job.args[0]?.round === row.round,
        )
      ) {
        await ctx.scheduler.runAt(
          row.lastDeadline,
          internal.game.closeWriting,
          { gameId: row.gameId, round: row.round },
        );
        scheduled++;
      }
    }
    return {
      scanned: page.page.length,
      scheduled,
      cursor: page.isDone ? null : page.continueCursor,
    };
  },
});
