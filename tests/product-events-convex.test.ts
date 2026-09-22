/// <reference types="vite/client" />

import { convexTest } from "convex-test";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { api, internal } from "../convex/_generated/api";
import schema from "../convex/schema";

const modules = import.meta.glob("../convex/**/*.ts");
const sessionId = "123e4567-e89b-42d3-a456-426614174000";

describe("Convex product-event storage", () => {
  beforeEach(() => vi.stubEnv("PRODUCT_ENVIRONMENT", "test"));
  afterEach(() => vi.unstubAllEnvs());

  it("records session start once and keeps actor identity anonymous", async () => {
    const t = convexTest(schema, modules);
    const player = t.withIdentity({
      subject: "product-event-player",
      issuer: "double-take-test",
    });
    const first = await player.mutation(api.productEvents.startSession, {
      sessionId,
      mode: "solo",
      newVisitor: true,
    });
    const duplicate = await player.mutation(api.productEvents.startSession, {
      sessionId,
      mode: "solo",
      newVisitor: true,
    });
    expect(first).toEqual({ inserted: true });
    expect(duplicate).toEqual({
      inserted: false,
      reason: "duplicate-event-id",
    });

    const events = await t.query(internal.productEvents.forSession, {
      sessionId,
    });
    expect(events).toHaveLength(1);
    expect(events[0]).toMatchObject({
      eventName: "session_start",
      environment: "test",
      actorId: null,
      schemaVersion: 1,
      props: { mode: "solo", newVisitor: true },
    });
  });

  it("rejects unknown event names and player text at the ingestion boundary", async () => {
    const t = convexTest(schema, modules);
    const base = {
      environment: "test" as const,
      occurredAt: Date.parse("2026-09-21T12:00:00.000Z"),
      sessionId,
      actorId: null,
    };
    await expect(
      t.mutation(internal.productEvents.ingest, {
        ...base,
        eventId: "unknown-event",
        eventName: "unknown",
        props: {},
      }),
    ).rejects.toThrow(/event name/i);
    await expect(
      t.mutation(internal.productEvents.ingest, {
        ...base,
        eventId: "text-event",
        eventName: "submission",
        props: { roundIndex: 1, wordCount: 4, text: "private line" },
      }),
    ).rejects.toThrow(/text/);
  });

  it("summarizes only receipt-bound production fixtures without writing rows", async () => {
    const t = convexTest(schema, modules);
    const receiptBoundSessionIds = [
      "55fae3b9-5265-43e4-a2d4-67324f628efb",
      "2e990248-2d03-4784-9e16-384853487f51",
      "j97bdehgb8bd47hdb77zw3ny2x8ewn1f",
    ] as const;
    const uncertainSessionIds = [
      "003f32a7-a9eb-40e9-84d1-fa86dfc2e388",
      "6ebee9fd-ff9c-4863-af2e-ac265bf241f8",
      "j973mwd4yh635j5nwpmmfbe5a98exxat",
      "d627b25a-ff94-472a-9655-45bcbfcf65b7",
      "662f83c6-08b3-44fc-8690-9c27c460f584",
      "j9758vn03aw0bbtjk2ttyy2tgd8exab9",
    ] as const;
    const productionSessionIds = [
      ...receiptBoundSessionIds,
      ...uncertainSessionIds,
      `${receiptBoundSessionIds.at(-1)}-near-match`,
      "summary-unclassified-session",
    ];

    for (const [index, eventSessionId] of productionSessionIds.entries()) {
      await t.mutation(internal.productEvents.ingest, {
        eventId: `double-take:v1:submission:summary:${index}`,
        eventName: "submission",
        environment: "production",
        occurredAt: Date.parse("2026-09-22T15:11:22.605Z") + index,
        sessionId: eventSessionId,
        actorId: null,
        props: { roundIndex: 1, wordCount: 8 },
      });
    }
    await t.mutation(internal.productEvents.ingest, {
      eventId: "double-take:v1:submission:summary:staging",
      eventName: "submission",
      environment: "staging",
      occurredAt: Date.parse("2026-09-22T15:11:22.700Z"),
      sessionId: receiptBoundSessionIds[0],
      actorId: null,
      props: { roundIndex: 1, wordCount: 8 },
    });
    const rowsBefore = await t.run((ctx) =>
      ctx.db.query("productEvents").collect(),
    );

    const summary = await t.query(internal.productEvents.summary, {
      environment: "production",
    });
    const rowsAfter = await t.run((ctx) =>
      ctx.db.query("productEvents").collect(),
    );

    expect(summary).toEqual({
      environment: "production",
      sampledEvents: 11,
      fixtureEventsExcluded: 3,
      unclassifiedEventsRetained: 8,
      genuineEventsRetained: 8,
      truncated: false,
      eventCounts: { submission: 8 },
    });
    expect(rowsBefore).toHaveLength(12);
    expect(rowsAfter).toEqual(rowsBefore);
  });
});
