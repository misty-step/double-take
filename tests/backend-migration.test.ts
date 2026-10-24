/// <reference types="vite/client" />
import { convexTest } from "convex-test";
import { makeFunctionReference } from "convex/server";
import { describe, expect, it, vi, afterEach } from "vitest";
import schema from "../convex/schema";
import { api } from "../convex/_generated/api";
import { modules } from "../cloudflare/modules";

const appModules = import.meta.glob("../convex/**/*.ts");
const rearm = makeFunctionReference<"mutation">("recovery:rearm");

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllEnvs();
});

describe("snapshot work reconciliation", () => {
  it("re-arms omitted pending judgments/deadlines once, leaving user records unchanged", async () => {
    vi.useFakeTimers();
    vi.stubEnv("PRODUCT_ENVIRONMENT", "test");
    const t = convexTest(schema, appModules);
    const host = t.withIdentity({ subject: "migration-host", issuer: "test" });
    const friend = t.withIdentity({
      subject: "migration-friend",
      issuer: "test",
    });
    const room = await host.mutation(api.rooms.createRoom, {
      displayName: "Host",
    });
    const joined = await friend.mutation(api.rooms.joinRoom, {
      code: room.code,
      displayName: "Friend",
    });
    if (!joined.ok) throw new Error("Fixture join failed");
    const gameId = await host.mutation(api.game.start, {
      roomId: room.roomId,
      requestId: "migration",
    });
    const submissionId = await t.run(async (ctx) => {
      // As in the user-table snapshot: accepted row/deadline, no scheduler rows.
      const round = (await ctx.db.query("rounds").collect())[0]!;
      await ctx.db.patch(round._id, { lastDeadline: Date.now() + 30_000 });
      return ctx.db.insert("submissions", {
        gameId,
        round: 1,
        playerId: room.playerId,
        text: "A synthetic pending line",
        normalized: "a synthetic pending line",
        wordCount: 4,
        status: "pending",
        createdAt: Date.now(),
      });
    });
    const before = await t.run(async (ctx) => ({
      row: await ctx.db.get(submissionId),
      rounds: await ctx.db.query("rounds").collect(),
    }));
    expect(
      await t.mutation(rearm, { table: "submissions", cursor: null }),
    ).toMatchObject({ scheduled: 1, cursor: null });
    expect(
      await t.mutation(rearm, { table: "submissions", cursor: null }),
    ).toMatchObject({ scheduled: 0 });
    expect(
      await t.mutation(rearm, { table: "rounds", cursor: null }),
    ).toMatchObject({ scheduled: 1 });
    expect(
      await t.mutation(rearm, { table: "rounds", cursor: null }),
    ).toMatchObject({ scheduled: 0 });
    const after = await t.run(async (ctx) => ({
      row: await ctx.db.get(submissionId),
      rounds: await ctx.db.query("rounds").collect(),
    }));
    expect(after).toEqual(before);
    await t.run(async (ctx) => {
      for (const job of await ctx.db.system
        .query("_scheduled_functions")
        .collect()) {
        await ctx.scheduler.cancel(job._id);
      }
      await ctx.db.patch(gameId, { phase: "finished", finishedAt: Date.now() });
    });
    expect(
      await t.mutation(rearm, { table: "submissions", cursor: null }),
    ).toMatchObject({ scheduled: 0 });
    expect(
      await t.mutation(rearm, { table: "rounds", cursor: null }),
    ).toMatchObject({ scheduled: 0 });
  });

  it("maps every registered function module, without maintaining a helper-file list", async () => {
    const registered = [];
    for (const [path, load] of Object.entries(appModules)) {
      const exported = await load();
      if (typeof exported !== "object" || exported === null) continue;
      if (
        Object.values(exported).some(
          (value) =>
            typeof value === "function" &&
            (("isQuery" in value && value.isQuery === true) ||
              ("isMutation" in value && value.isMutation === true) ||
              ("isAction" in value && value.isAction === true)),
        )
      )
        registered.push(path.replace("../convex/", "").replace(/\.ts$/, ""));
    }
    expect(Object.keys(modules).sort()).toEqual(registered.sort());
  });
});
