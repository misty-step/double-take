import { buildHealthPayload, parseBackendHealth } from "../../../lib/health";
import { resolveRuntimeAttribution } from "../../../lib/runtime-config";

const BACKEND_TIMEOUT_MS = 3_000;

type HealthDependencies = {
  fetch: typeof fetch;
  now: () => Date;
  env: Record<string, string | undefined>;
};

function backendHealthUrl(env: Record<string, string | undefined>): URL {
  const raw = env.NEXT_PUBLIC_CONVEX_SITE_URL;
  if (!raw) throw new Error("NEXT_PUBLIC_CONVEX_SITE_URL is required");
  const url = new URL(raw);
  if (
    url.username ||
    url.password ||
    url.pathname !== "/" ||
    url.search ||
    url.hash
  ) {
    throw new Error(
      "NEXT_PUBLIC_CONVEX_SITE_URL must be an origin without credentials",
    );
  }
  const localHttp =
    env.DOUBLETAKE_LOCAL === "true" &&
    url.protocol === "http:" &&
    (url.hostname === "127.0.0.1" ||
      url.hostname === "localhost" ||
      url.hostname === "[::1]");
  if (url.protocol !== "https:" && !localHttp) {
    throw new Error("Backend health requires HTTPS outside local development");
  }
  return new URL("/health", url);
}

export function createHealthHandler(
  dependencies: HealthDependencies = {
    fetch,
    now: () => new Date(),
    env: process.env,
  },
) {
  return async function healthHandler(): Promise<Response> {
    const checkedAt = dependencies.now().toISOString();
    try {
      const attribution = resolveRuntimeAttribution(dependencies.env);
      const response = await dependencies.fetch(
        backendHealthUrl(dependencies.env),
        {
          cache: "no-store",
          signal: AbortSignal.timeout(BACKEND_TIMEOUT_MS),
        },
      );
      if (!response.ok) throw new Error("Backend health request failed");
      const backend = parseBackendHealth(await response.json());
      return Response.json(
        buildHealthPayload({ backend, ...attribution, checkedAt }),
        { status: 200, headers: { "Cache-Control": "no-store" } },
      );
    } catch {
      return Response.json(
        { status: "unhealthy", service: "double-take", checkedAt },
        { status: 503, headers: { "Cache-Control": "no-store" } },
      );
    }
  };
}

export const GET = createHealthHandler();
