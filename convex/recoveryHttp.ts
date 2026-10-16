import { makeFunctionReference } from "convex/server";
import { httpAction } from "./_generated/server";

/** Origin Access is checked by the Worker; the backend additionally checks its key. */
export const rearm = httpAction(async (ctx, request) => {
  const expected = process.env.DOUBLETAKE_BACKEND_ADMIN_KEY;
  const header = request.headers.get("Authorization") ?? "";
  const provided = header.startsWith("Bearer ") ? header.slice(7) : "";
  if (!expected || expected.length < 32 || !provided)
    return new Response(null, { status: 401 });
  const digest = (text: string) =>
    crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  const [left, right] = await Promise.all([digest(expected), digest(provided)]);
  const a = new Uint8Array(left);
  const b = new Uint8Array(right);
  let difference = 0;
  for (let i = 0; i < a.length; i++) difference |= a[i]! ^ b[i]!;
  if (difference !== 0) return new Response(null, { status: 401 });
  const body: unknown = await request.json();
  if (
    typeof body !== "object" ||
    body === null ||
    !("table" in body) ||
    !("cursor" in body) ||
    (body.table !== "submissions" && body.table !== "rounds") ||
    (body.cursor !== null && typeof body.cursor !== "string")
  )
    return new Response(null, { status: 400 });
  const result = await ctx.runMutation(
    makeFunctionReference<"mutation">("recovery:rearm"),
    { table: body.table, cursor: body.cursor },
  );
  return Response.json(result, { headers: { "Cache-Control": "no-store" } });
});
