import { resolvePlayer } from "@parlor/convex";
import { v } from "convex/values";
import type { MutationCtx } from "./_generated/server";
import { internalMutation, internalQuery, mutation } from "./_generated/server";
import {
  buildProductEvent,
  parseProductEnvironment,
  type ProductEnvironment,
  type ProductEventEnvelope,
  type ProductEventInput,
} from "../lib/product-events";

const eventArgs = {
  eventId: v.string(),
  eventName: v.string(),
  environment: v.union(
    v.literal("production"),
    v.literal("staging"),
    v.literal("test"),
  ),
  occurredAt: v.number(),
  sessionId: v.string(),
  actorId: v.union(v.string(), v.null()),
  props: v.any(),
};

export function configuredProductEnvironment(
  value: unknown = process.env.PRODUCT_ENVIRONMENT,
): ProductEnvironment {
  return parseProductEnvironment(value);
}

export async function recordProductEvent(
  ctx: MutationCtx,
  input: ProductEventInput,
): Promise<{ inserted: boolean; reason?: "duplicate-event-id" }> {
  const event = buildProductEvent(input);
  const duplicate = await ctx.db
    .query("productEvents")
    .withIndex("by_event_id", (query) => query.eq("eventId", event.eventId))
    .unique();
  if (duplicate) return { inserted: false, reason: "duplicate-event-id" };
  await ctx.db.insert("productEvents", event);
  return { inserted: true };
}

export const ingest = internalMutation({
  args: eventArgs,
  handler: async (ctx, args) =>
    recordProductEvent(ctx, args as unknown as ProductEventInput),
});

/**
 * Records the one browser-owned fact the server cannot infer: whether this
 * browser has visited before. Actor identity stays explicitly anonymous.
 */
export const startSession = mutation({
  args: {
    sessionId: v.string(),
    mode: v.union(v.literal("match"), v.literal("solo")),
    newVisitor: v.boolean(),
    guestToken: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    if (
      !/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
        args.sessionId,
      )
    ) {
      throw new Error("Product sessions require a random UUID");
    }
    await resolvePlayer(ctx, args.guestToken, { create: true });
    return recordProductEvent(ctx, {
      eventId: `double-take:v1:session-start:${args.sessionId}`,
      eventName: "session_start",
      environment: configuredProductEnvironment(),
      occurredAt: Date.now(),
      sessionId: args.sessionId,
      actorId: null,
      props: { mode: args.mode, newVisitor: args.newVisitor },
    });
  },
});

/** Internal readback for tests and first-party operations; never a player API. */
export const forSession = internalQuery({
  args: { sessionId: v.string() },
  handler: async (ctx, args): Promise<ProductEventEnvelope[]> => {
    const rows = await ctx.db
      .query("productEvents")
      .withIndex("by_session_time", (query) =>
        query.eq("sessionId", args.sessionId),
      )
      .collect();
    return rows.map(
      ({ _id: _ignoredId, _creationTime: _ignoredTime, ...event }) =>
        event as ProductEventEnvelope,
    );
  },
});
