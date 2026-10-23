import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { rearm } from "./recoveryHttp";

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

http.route({ path: "/migration/rearm", method: "POST", handler: rearm });

export default http;
