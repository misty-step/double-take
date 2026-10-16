import { createConvexBackend } from "@parlor/cloudflare";
import crons from "../convex/crons";
import schema from "../convex/schema";
import { modules } from "./modules";

export const BACKEND_BASE_PATH = "/backend";

/** The existing game functions, on the shared Parlor v1 runtime. */
export const DoubleTakeBackend = createConvexBackend({
  app: {
    schema,
    modules,
    crons,
    http: async () => (await import("../convex/http")).default,
  },
  basePath: BACKEND_BASE_PATH,
  adminKeyBinding: "DOUBLETAKE_BACKEND_ADMIN_KEY",
  redactErrors: () => true,
  deploymentName: "double-take",
});
