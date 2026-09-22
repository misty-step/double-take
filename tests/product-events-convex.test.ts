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

  it("excludes retained production fixtures from the operational summary", async () => {
    const t = convexTest(schema, modules);
    const fixtureSessionId = "j97bdehgb8bd47hdb77zw3ny2x8ewn1f";
    for (const [eventId, eventSessionId] of [
      ["double-take:v1:submission:summary-fixture", fixtureSessionId],
      [
        "double-take:v1:submission:summary-genuine",
        `${fixtureSessionId}-genuine-control`,
      ],
    ] as const) {
      await t.mutation(internal.productEvents.ingest, {
        eventId,
        eventName: "submission",
        environment: "production",
        occurredAt: Date.parse("2026-09-22T15:11:22.605Z"),
        sessionId: eventSessionId,
        actorId: null,
        props: { roundIndex: 1, wordCount: 8 },
      });
    }

    const summary = await t.query(internal.productEvents.summary, {
      environment: "production",
    });

    expect(summary).toEqual({
      environment: "production",
      sampledEvents: 2,
      fixtureEventsExcluded: 1,
      genuineEventsRetained: 1,
      truncated: false,
      eventCounts: { submission: 1 },
    });
  });
});
