import { resolveRuntimeAttribution } from "./runtime-config";

type SentryRuntime = "browser" | "edge" | "server";
type Environment = Record<string, string | undefined>;

function validDsn(value: string | undefined): string | undefined {
  if (!value) return undefined;
  try {
    const url = new URL(value);
    return url.protocol === "https:" && url.username.length > 0
      ? value
      : undefined;
  } catch {
    return undefined;
  }
}

export function resolveSentryOptions(env: Environment, runtime: SentryRuntime) {
  let attribution: ReturnType<typeof resolveRuntimeAttribution> | undefined;
  try {
    attribution = resolveRuntimeAttribution(env);
  } catch {
    attribution = undefined;
  }
  const dsn = validDsn(
    runtime === "browser"
      ? env.NEXT_PUBLIC_SENTRY_DSN
      : (env.SENTRY_DSN ?? env.NEXT_PUBLIC_SENTRY_DSN),
  );
  const enabled =
    dsn !== undefined &&
    attribution !== undefined &&
    env.DOUBLETAKE_LOCAL !== "true";
  return {
    dsn,
    enabled,
    environment: attribution?.environment,
    release: attribution?.release,
    sendDefaultPii: false as const,
    tracesSampleRate: enabled ? 0.05 : 0,
  };
}
