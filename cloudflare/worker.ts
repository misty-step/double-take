import {
  forwardToBackend,
  type DurableObjectNamespaceLike,
} from "@parlor/cloudflare";
import nextWorker, {
  type OpenNextContext,
  type OpenNextEnv,
} from "open-next-worker";
import { BACKEND_BASE_PATH } from "./backend";
import { authorizeOperator, type OperatorEnv } from "./operator";
import { buildHealthPayload, parseBackendHealth } from "../lib/health";
import { resolveRuntimeAttribution } from "../lib/runtime-config";
import { backendSignal } from "../lib/backend-telemetry";

export { DoubleTakeBackend } from "./backend";

type Env = OpenNextEnv &
  OperatorEnv & {
    readonly DOUBLETAKE_BACKEND: DurableObjectNamespaceLike;
    readonly NEXT_PUBLIC_CONVEX_SITE_URL?: string;
    readonly APP_ENVIRONMENT?: string;
    readonly APP_RELEASE?: string;
    readonly DOUBLETAKE_PRIVATE_PREVIEW?: string;
    readonly CF_VERSION_METADATA?: { readonly id: string };
  };

export default {
  async fetch(
    request: Request,
    env: Env,
    ctx: OpenNextContext,
  ): Promise<Response> {
    const path = new URL(request.url).pathname;
    if (
      (env.DOUBLETAKE_PRIVATE_PREVIEW === "true" ||
        path.startsWith("/backend/admin/") ||
        path.startsWith("/backend/http/migration/")) &&
      !(await authorizeOperator(request, env))
    )
      return new Response(null, {
        status: 403,
        headers: { "Cache-Control": "no-store" },
      });
    if (
      path === "/api/health" &&
      request.method === "GET" &&
      env.NEXT_PUBLIC_CONVEX_SITE_URL?.endsWith("/backend/http")
    ) {
      const checkedAt = new Date().toISOString();
      try {
        // A service binding, not a same-zone network fetch back into this Worker.
        const url = new URL(request.url);
        url.pathname = "/backend/http/health";
        const response = await forwardToBackend(
          new Request(url),
          env.DOUBLETAKE_BACKEND,
          BACKEND_BASE_PATH,
        );
        if (!response?.ok) throw new Error("Backend unhealthy");
        const backend = (await response.json()) as Record<string, unknown>;
        if (
          backend.judgeConfigured === false ||
          (backend.release !== undefined && backend.release !== env.APP_RELEASE)
        )
          throw new Error("Backend identity/configuration mismatch");
        return Response.json(
          {
            ...buildHealthPayload({
              backend: parseBackendHealth(backend),
              ...resolveRuntimeAttribution({
                APP_ENVIRONMENT: env.APP_ENVIRONMENT,
                APP_RELEASE: env.APP_RELEASE,
              }),
              checkedAt,
            }),
            workerVersion: env.CF_VERSION_METADATA?.id,
            backendIdentity: {
              release: backend.release,
              workerVersion: backend.workerVersion,
            },
          },
          { headers: { "Cache-Control": "no-store" } },
        );
      } catch {
        return Response.json(
          { status: "unhealthy", service: "double-take", checkedAt },
          { status: 503, headers: { "Cache-Control": "no-store" } },
        );
      }
    }
    try {
      const response = await (forwardToBackend(
        request,
        env.DOUBLETAKE_BACKEND,
        BACKEND_BASE_PATH,
      ) ?? nextWorker.fetch(request, env, ctx));
      if (
        response.status >= 500 &&
        response.status !== 560 &&
        response.status !== 503
      )
        ctx.waitUntil(backendSignal("request_failed", "error"));
      return response;
    } catch {
      ctx.waitUntil(backendSignal("request_failed", "error"));
      return new Response(null, {
        status: 503,
        headers: { "Cache-Control": "no-store" },
      });
    }
  },
};
