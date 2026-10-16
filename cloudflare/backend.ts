import {
  createConvexBackend,
  type BackendEnv,
  type DurableObjectStateLike,
} from "@parlor/cloudflare";
import crons from "../convex/crons";
import schema from "../convex/schema";
import { modules } from "./modules";
import { readJudgeConfig } from "../convex/judge";

export const BACKEND_BASE_PATH = "/backend";

/** The existing game functions, on the shared Parlor v1 runtime. */
const Backend = createConvexBackend({
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

/** Application identity belongs to this boundary, not to a second runtime. */
export class DoubleTakeBackend extends Backend {
  constructor(
    state: DurableObjectStateLike,
    private readonly deploymentEnv: BackendEnv,
  ) {
    super(state, deploymentEnv);
  }

  override async fetch(request: Request): Promise<Response> {
    const response = await super.fetch(request);
    if (new URL(request.url).pathname !== "/backend/http/health")
      return response;
    const version = this.deploymentEnv.CF_VERSION_METADATA as
      { id?: string } | undefined;
    return Response.json(
      {
        ...((await response.json()) as Record<string, unknown>),
        release: this.deploymentEnv.APP_RELEASE,
        workerVersion: version?.id,
        judgeConfigured: readJudgeConfig(process.env) !== null,
      },
      { status: response.status, headers: { "Cache-Control": "no-store" } },
    );
  }
}
