import * as Sentry from "@sentry/nextjs";
import { redactSentryEvent } from "./lib/sentry-privacy";
import { resolveSentryOptions } from "./lib/sentry-runtime";

const options = resolveSentryOptions(
  {
    APP_ENVIRONMENT: process.env.NEXT_PUBLIC_APP_ENVIRONMENT,
    APP_RELEASE: process.env.NEXT_PUBLIC_APP_RELEASE,
    DOUBLETAKE_LOCAL: process.env.NEXT_PUBLIC_DOUBLETAKE_LOCAL,
    NEXT_PUBLIC_SENTRY_DSN: process.env.NEXT_PUBLIC_SENTRY_DSN,
  },
  "browser",
);

Sentry.init({
  ...options,
  beforeBreadcrumb: () => null,
  beforeSend: (event) => redactSentryEvent(event),
  beforeSendTransaction: (event) => redactSentryEvent(event),
});

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
