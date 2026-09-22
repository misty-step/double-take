export type ProductEnvironment = "production" | "staging" | "test";

type SessionStart = {
  eventName: "session_start";
  props: { mode: "match" | "solo"; newVisitor: boolean };
};
type RoundStart = {
  eventName: "round_start";
  props: { roundIndex: number; contextPairId: string };
};
type Submission = {
  eventName: "submission";
  props: { roundIndex: number; wordCount: number };
};
type Judgment = {
  eventName: "judgment";
  props: {
    roundIndex: number;
    coherence: "pass" | "fail";
    specificity: "pass" | "fail";
    refused: boolean;
    refuseReason?: string;
  };
};
type RoundComplete = {
  eventName: "round_complete";
  props: { roundIndex: number; score: number };
};
type Replay = { eventName: "replay"; props: { fromRound: number } };

export type ProductEventInput = {
  eventId: string;
  environment: ProductEnvironment;
  occurredAt: number;
  sessionId: string;
  actorId: string | null;
} & (
  SessionStart | RoundStart | Submission | Judgment | RoundComplete | Replay
);

export type ProductEventEnvelope = Omit<ProductEventInput, "occurredAt"> & {
  game: "double-take";
  occurredAt: string;
  schemaVersion: 1;
};

/**
 * Exact session ids bound to both a named supervised-production run and
 * overlapping telemetry. See docs/production-analytics-fixture-exclusions.md.
 */
export const KNOWN_PRODUCTION_FIXTURE_SESSION_IDS = [
  "55fae3b9-5265-43e4-a2d4-67324f628efb",
  "2e990248-2d03-4784-9e16-384853487f51",
  "j97bdehgb8bd47hdb77zw3ny2x8ewn1f",
] as const;

const productionFixtureSessionIds = new Set<string>(
  KNOWN_PRODUCTION_FIXTURE_SESSION_IDS,
);

export function partitionProductEventsForAnalytics(
  rows: readonly ProductEventEnvelope[],
  environment: ProductEnvironment,
): Readonly<{
  fixtureEvents: readonly ProductEventEnvelope[];
  unclassifiedEvents: readonly ProductEventEnvelope[];
  /** @deprecated This is an alias for unclassifiedEvents, not verified-human traffic. */
  genuineEvents: readonly ProductEventEnvelope[];
}> {
  const fixtureEvents: ProductEventEnvelope[] = [];
  const unclassifiedEvents: ProductEventEnvelope[] = [];
  for (const row of rows) {
    if (row.environment !== environment) continue;
    if (
      environment === "production" &&
      productionFixtureSessionIds.has(row.sessionId)
    ) {
      fixtureEvents.push(row);
    } else {
      unclassifiedEvents.push(row);
    }
  }
  return {
    fixtureEvents,
    unclassifiedEvents,
    genuineEvents: unclassifiedEvents,
  };
}

const PRIVATE_KEYS = new Set([
  "answer",
  "code",
  "confidence",
  "dsn",
  "email",
  "ip",
  "model",
  "name",
  "rubric",
  "sentence",
  "text",
  "token",
]);

function fail(message: string): never {
  throw new Error(`Invalid product event: ${message}`);
}

function objectProps(value: unknown): Record<string, unknown> {
  if (value === null || typeof value !== "object" || Array.isArray(value))
    fail("props must be an object");
  return value as Record<string, unknown>;
}

function exactKeys(
  props: Record<string, unknown>,
  expected: readonly string[],
) {
  const allowed = new Set(expected);
  for (const key of Object.keys(props)) {
    if (PRIVATE_KEYS.has(key.toLowerCase()))
      fail(`${key} is not permitted in analytics`);
    if (!allowed.has(key)) fail(`${key} is not defined by contract v1`);
  }
  for (const key of expected) {
    if (!(key in props)) fail(`${key} is required`);
  }
}

function positiveInteger(value: unknown, field: string) {
  if (!Number.isInteger(value) || Number(value) < 1)
    fail(`${field} must be a positive integer`);
}

function nonempty(value: unknown, field: string, max = 160) {
  if (
    typeof value !== "string" ||
    value.trim().length === 0 ||
    value.length > max
  ) {
    fail(`${field} must be a non-empty string at most ${max} characters long`);
  }
}

function validateProps(
  eventName: ProductEventInput["eventName"],
  value: unknown,
) {
  const props = objectProps(value);
  switch (eventName) {
    case "session_start":
      exactKeys(props, ["mode", "newVisitor"]);
      if (props.mode !== "match" && props.mode !== "solo")
        fail("mode must be match or solo");
      if (typeof props.newVisitor !== "boolean")
        fail("newVisitor must be boolean");
      return;
    case "round_start":
      exactKeys(props, ["roundIndex", "contextPairId"]);
      positiveInteger(props.roundIndex, "roundIndex");
      nonempty(props.contextPairId, "contextPairId", 80);
      return;
    case "submission":
      exactKeys(props, ["roundIndex", "wordCount"]);
      positiveInteger(props.roundIndex, "roundIndex");
      positiveInteger(props.wordCount, "wordCount");
      return;
    case "judgment": {
      const hasReason = "refuseReason" in props;
      exactKeys(
        props,
        hasReason
          ? [
              "roundIndex",
              "coherence",
              "specificity",
              "refused",
              "refuseReason",
            ]
          : ["roundIndex", "coherence", "specificity", "refused"],
      );
      positiveInteger(props.roundIndex, "roundIndex");
      if (props.coherence !== "pass" && props.coherence !== "fail")
        fail("coherence must be pass or fail");
      if (props.specificity !== "pass" && props.specificity !== "fail")
        fail("specificity must be pass or fail");
      if (typeof props.refused !== "boolean") fail("refused must be boolean");
      if (props.refused && !hasReason)
        fail("refuseReason is required when refused is true");
      if (!props.refused && hasReason)
        fail("refuseReason is only allowed when refused is true");
      if (hasReason) nonempty(props.refuseReason, "refuseReason", 80);
      return;
    }
    case "round_complete":
      exactKeys(props, ["roundIndex", "score"]);
      positiveInteger(props.roundIndex, "roundIndex");
      if (
        typeof props.score !== "number" ||
        !Number.isFinite(props.score) ||
        props.score < 0
      ) {
        fail("score must be a finite non-negative number");
      }
      return;
    case "replay":
      exactKeys(props, ["fromRound"]);
      positiveInteger(props.fromRound, "fromRound");
      return;
    default:
      fail("event name is not defined by contract v1");
  }
}

export function parseProductEnvironment(value: unknown): ProductEnvironment {
  if (value === "production" || value === "staging" || value === "test")
    return value;
  throw new Error("PRODUCT_ENVIRONMENT must be production, staging, or test");
}

export function buildProductEvent(
  input: ProductEventInput,
): ProductEventEnvelope {
  nonempty(input.eventId, "eventId", 200);
  nonempty(input.sessionId, "sessionId", 160);
  if (input.actorId !== null) {
    nonempty(input.actorId, "actorId", 160);
    if (/@|\s/.test(input.actorId))
      fail("actorId must be opaque and non-joinable");
  }
  if (!Number.isFinite(input.occurredAt) || input.occurredAt <= 0)
    fail("occurredAt must be an epoch timestamp");
  validateProps(input.eventName, input.props);

  return {
    ...input,
    game: "double-take",
    environment: parseProductEnvironment(input.environment),
    occurredAt: new Date(input.occurredAt).toISOString(),
    schemaVersion: 1,
  };
}
