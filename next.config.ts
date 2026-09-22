import type { NextConfig } from "next";
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

const nextConfig: NextConfig = {
  allowedDevOrigins: localMode ? ["127.0.0.1", "[::1]"] : undefined,
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
