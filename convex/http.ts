import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";

const http = httpRouter();

http.route({
  path: "/health",
  method: "GET",
  handler: httpAction(async () =>
    Response.json(
      { status: "ok", service: "double-take-backend" },
      { status: 200, headers: { "Cache-Control": "no-store" } },
    ),
  ),
});

export default http;
