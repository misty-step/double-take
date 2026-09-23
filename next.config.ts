import type { NextConfig } from "next";
import { networkInterfaces } from "node:os";
import { withSentryConfig } from "@sentry/nextjs";
import { resolveRuntimeAttribution } from "./lib/runtime-config";

const localMode = process.env.DOUBLETAKE_LOCAL === "true";
let attribution: ReturnType<typeof resolveRuntimeAttribution> | undefined;
try {
  attribution = resolveRuntimeAttribution(process.env);
} catch {
  attribution = undefined;
}

const clientEnv: Record<string, string> = {
  NEXT_PUBLIC_DOUBLETAKE_LOCAL: localMode ? "true" : "false",
};
if (attribution) {
  clientEnv.NEXT_PUBLIC_APP_ENVIRONMENT = attribution.environment;
  clientEnv.NEXT_PUBLIC_APP_RELEASE = attribution.release;
}

/**
 * Local play on phones: phones load the game from this computer's LAN address,
 * and Next.js blocks dev assets from any host not listed here, which leaves
 * phones on "Finding your seat" forever. Allow every address this machine
 * answers on, read from its interfaces, so the list never depends on which
 * environment value happened to be loaded when this file ran.
 */
function localDevOrigins(): string[] {
  const origins = new Set(["127.0.0.1", "[::1]"]);
  for (const addresses of Object.values(networkInterfaces()))
    for (const address of addresses ?? [])
      if (address.family === "IPv4") origins.add(address.address);
  return [...origins];
}

const nextConfig: NextConfig = {
  allowedDevOrigins: localMode ? localDevOrigins() : undefined,
  env: clientEnv,
};

const hasUploadCredentials = Boolean(
  process.env.SENTRY_AUTH_TOKEN &&
  process.env.SENTRY_ORG &&
  process.env.SENTRY_PROJECT &&
  attribution?.release,
);

export default localMode
  ? nextConfig
  : withSentryConfig(nextConfig, {
      authToken: process.env.SENTRY_AUTH_TOKEN,
      org: process.env.SENTRY_ORG,
      project: process.env.SENTRY_PROJECT,
      silent: true,
      telemetry: false,
      disableLogger: true,
      widenClientFileUpload: false,
      sourcemaps: {
        disable: !hasUploadCredentials,
        deleteSourcemapsAfterUpload: true,
      },
      release: attribution
        ? {
            name: attribution.release,
            create: hasUploadCredentials,
            finalize: hasUploadCredentials,
          }
        : { create: false, finalize: false },
    });
