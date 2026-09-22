import { describe, expect, it } from "vitest";
import {
  buildProductEvent,
  KNOWN_PRODUCTION_FIXTURE_SESSION_IDS,
  parseProductEnvironment,
  partitionProductEventsForAnalytics,
  type ProductEventInput,
} from "../lib/product-events";

const base = {
  eventId: "double-take:v1:submission:game-1:round-1:player-1:revision-1",
  environment: "test" as const,
  occurredAt: Date.parse("2026-09-21T12:00:00.000Z"),
  sessionId: "game-1",
  actorId: "guest-rotating-1",
};

describe("product event contract", () => {
  it("builds a strict privacy-safe submission envelope", () => {
    const input: ProductEventInput = {
      ...base,
      eventName: "submission",
      props: { roundIndex: 1, wordCount: 9 },
    };
    expect(buildProductEvent(input)).toEqual({
      eventId: base.eventId,
      eventName: "submission",
      game: "double-take",
      environment: "test",
      occurredAt: "2026-09-21T12:00:00.000Z",
      sessionId: "game-1",
      actorId: "guest-rotating-1",
      schemaVersion: 1,
      props: { roundIndex: 1, wordCount: 9 },
    });
  });

  it("accepts every canonical Double Take event shape", () => {
    const events: ProductEventInput[] = [
      {
        ...base,
        eventName: "session_start",
        props: { mode: "match", newVisitor: true },
      },
      {
        ...base,
        eventName: "round_start",
        props: { roundIndex: 1, contextPairId: "vow-villain" },
      },
      {
        ...base,
        eventName: "submission",
        props: { roundIndex: 1, wordCount: 8 },
      },
      {
        ...base,
        eventName: "judgment",
        props: {
          roundIndex: 1,
          coherence: "pass",
          specificity: "pass",
          refused: false,
        },
      },
      {
        ...base,
        eventName: "round_complete",
        props: { roundIndex: 1, score: 3 },
      },
      { ...base, eventName: "replay", props: { fromRound: 3 } },
    ];

    expect(
      events.map(buildProductEvent).map((event) => event.eventName),
    ).toEqual([
      "session_start",
      "round_start",
      "submission",
      "judgment",
      "round_complete",
      "replay",
    ]);
  });

  it("rejects unknown environments, missing props, and player content", () => {
    expect(() => parseProductEnvironment(undefined)).toThrow(
      /PRODUCT_ENVIRONMENT/,
    );
    expect(() => parseProductEnvironment("preview")).toThrow(
      /PRODUCT_ENVIRONMENT/,
    );
    expect(() =>
      buildProductEvent({
        ...base,
        eventName: "submission",
        props: { roundIndex: 1 } as never,
      }),
    ).toThrow(/wordCount/);
    expect(() =>
      buildProductEvent({
        ...base,
        eventName: "submission",
        props: {
          roundIndex: 1,
          wordCount: 3,
          sentence: "secret player copy",
        } as never,
      }),
    ).toThrow(/sentence/);
  });

  it("requires a refusal reason exactly when a judgment is refused", () => {
    expect(() =>
      buildProductEvent({
        ...base,
        eventName: "judgment",
        props: {
          roundIndex: 1,
          coherence: "fail",
          specificity: "fail",
          refused: true,
        },
      } as ProductEventInput),
    ).toThrow(/refuseReason/);
    expect(() =>
      buildProductEvent({
        ...base,
        eventName: "judgment",
        props: {
          roundIndex: 1,
          coherence: "pass",
          specificity: "pass",
          refused: false,
          refuseReason: "outage",
        },
      } as ProductEventInput),
    ).toThrow(/refuseReason/);
  });

  it("excludes only receipt-bound production fixtures and retains uncertain sessions", () => {
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
    expect([...KNOWN_PRODUCTION_FIXTURE_SESSION_IDS]).toEqual(
      receiptBoundSessionIds,
    );

    const buildSubmission = (
      eventId: string,
      sessionId: string,
      environment: "production" | "staging" = "production",
    ) =>
      buildProductEvent({
        ...base,
        eventId,
        environment,
        sessionId,
        eventName: "submission",
        props: { roundIndex: 1, wordCount: 8 },
      });
    const fixtureEvents = receiptBoundSessionIds.map((sessionId, index) =>
      buildSubmission(`double-take:v1:submission:fixture:${index}`, sessionId),
    );
    const uncertainEvents = uncertainSessionIds.map((sessionId, index) =>
      buildSubmission(
        `double-take:v1:submission:uncertain:${index}`,
        sessionId,
      ),
    );
    const nearMatchEvent = buildSubmission(
      "double-take:v1:submission:near-match",
      `${receiptBoundSessionIds.at(-1)}-near-match`,
    );
    const unrelatedEvent = buildSubmission(
      "double-take:v1:submission:unclassified",
      "unclassified-session",
    );
    const stagingEvent = buildSubmission(
      "double-take:v1:submission:staging",
      receiptBoundSessionIds[0],
      "staging",
    );
    const rows = [
      ...fixtureEvents,
      ...uncertainEvents,
      nearMatchEvent,
      unrelatedEvent,
      stagingEvent,
    ];

    const partition = partitionProductEventsForAnalytics(rows, "production");
    const retainedEventIds = [
      ...uncertainEvents.map((event) => event.eventId),
      nearMatchEvent.eventId,
      unrelatedEvent.eventId,
    ];

    expect(partition.fixtureEvents.map((event) => event.eventId)).toEqual(
      fixtureEvents.map((event) => event.eventId),
    );
    expect(partition.unclassifiedEvents.map((event) => event.eventId)).toEqual(
      retainedEventIds,
    );
    expect(partition.genuineEvents.map((event) => event.eventId)).toEqual(
      retainedEventIds,
    );
    expect(rows).toHaveLength(
      fixtureEvents.length + retainedEventIds.length + 1,
    );
  });
});
