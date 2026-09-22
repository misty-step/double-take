import * as Sentry from "@sentry/nextjs";
import { redactSentryEvent } from "./lib/sentry-privacy";
import { resolveSentryOptions } from "./lib/sentry-runtime";

Sentry.init({
  ...resolveSentryOptions(process.env, "server"),
  beforeBreadcrumb: () => null,
  beforeSend: (event) => redactSentryEvent(event),
  beforeSendTransaction: (event) => redactSentryEvent(event),
});
