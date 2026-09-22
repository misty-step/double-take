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

  it("excludes exact supervised production fixtures and retains genuine traffic", () => {
    const fixtureEvents = KNOWN_PRODUCTION_FIXTURE_SESSION_IDS.map(
      (sessionId, index) =>
        buildProductEvent({
          ...base,
          eventId: `double-take:v1:submission:fixture:${index}`,
          environment: "production",
          sessionId,
          eventName: "submission",
          props: { roundIndex: 1, wordCount: 8 },
        }),
    );
    const genuineEvent = buildProductEvent({
      ...base,
      eventId: "double-take:v1:submission:genuine:1",
      environment: "production",
      sessionId: `${KNOWN_PRODUCTION_FIXTURE_SESSION_IDS.at(-1)}-genuine-control`,
      eventName: "submission",
      props: { roundIndex: 1, wordCount: 8 },
    });
    const rows = [...fixtureEvents, genuineEvent];

    const partition = partitionProductEventsForAnalytics(rows, "production");

    expect(partition.fixtureEvents.map((event) => event.eventId)).toEqual(
      fixtureEvents.map((event) => event.eventId),
    );
    expect(partition.genuineEvents.map((event) => event.eventId)).toEqual([
      genuineEvent.eventId,
    ]);
    expect(rows).toHaveLength(KNOWN_PRODUCTION_FIXTURE_SESSION_IDS.length + 1);
  });
});
