import { parlorTables } from "@parlor/convex/schema";
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export const gamePhase = v.union(
  v.literal("writing"),
  v.literal("reveal"),
  v.literal("finished"),
);
const submissionStatus = v.union(
  v.literal("pending"),
  v.literal("judged"),
  v.literal("failed"),
);

export default defineSchema({
  ...parlorTables,
  games: defineTable({
    roomId: v.id("rooms"),
    matchId: v.id("matches"),
    cycle: v.number(),
    requestId: v.string(),
    startedBy: v.id("players"),
    startedAt: v.number(),
    phase: gamePhase,
    round: v.number(),
    pairKey: v.string(),
    players: v.array(
      v.object({
        playerId: v.id("players"),
        name: v.string(),
        seatIndex: v.number(),
        score: v.number(),
        roundPoints: v.number(),
      }),
    ),
    finishedAt: v.optional(v.number()),
  })
    .index("by_room_cycle", ["roomId", "cycle"])
    .index("by_room_request", ["roomId", "requestId"])
    .index("by_match", ["matchId"]),
  rounds: defineTable({
    gameId: v.id("games"),
    round: v.number(),
    pairKey: v.string(),
    deadline: v.number(),
  }).index("by_game_round", ["gameId", "round"]),
  submissions: defineTable({
    gameId: v.id("games"),
    round: v.number(),
    playerId: v.id("players"),
    text: v.string(),
    normalized: v.string(),
    wordCount: v.number(),
    status: submissionStatus,
    adjudicationId: v.optional(v.id("adjudications")),
    failureCode: v.optional(v.string()),
    revision: v.number(),
    createdAt: v.number(),
  })
    .index("by_game_round", ["gameId", "round"])
    .index("by_game_round_player", ["gameId", "round", "playerId"]),
  adjudications: defineTable({
    pairKey: v.string(),
    normalized: v.string(),
    rubricVersion: v.string(),
    model: v.string(),
    levels: v.object({
      plausibilityA: v.number(),
      plausibilityB: v.number(),
      coherence: v.number(),
      specificity: v.number(),
    }),
    weaker: v.number(),
    points: v.number(),
    gate: v.string(),
    gateMessage: v.string(),
    confidenceMin: v.number(),
    rawJson: v.string(),
    createdAt: v.number(),
  }).index("by_pair_normalized", ["pairKey", "normalized", "rubricVersion"]),
  productEvents: defineTable({
    eventId: v.string(),
    eventName: v.string(),
    game: v.literal("double-take"),
    environment: v.union(
      v.literal("production"),
      v.literal("staging"),
      v.literal("test"),
    ),
    occurredAt: v.string(),
    sessionId: v.string(),
    actorId: v.union(v.string(), v.null()),
    schemaVersion: v.literal(1),
    props: v.any(),
  })
    .index("by_event_id", ["eventId"])
    .index("by_game_name_time", ["game", "eventName", "occurredAt"])
    .index("by_session_time", ["sessionId", "occurredAt"]),
  rateLimits: defineTable({
    playerId: v.id("players"),
    windowStart: v.number(),
    count: v.number(),
  }).index("by_player", ["playerId"]),
});
