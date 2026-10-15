import { randomUUID } from "node:crypto";
import { readFileSync } from "node:fs";

const { vars } = JSON.parse(readFileSync("wrangler.jsonc", "utf8"));
const dsn = new URL(vars.SENTRY_DSN);
const event = {
  event_id: randomUUID().replaceAll("-", ""),
  timestamp: Date.now() / 1000,
  platform: "javascript",
  level: "error",
  environment: "production",
  release: process.env.GITHUB_SHA,
  message: "Double Take CI/CD failed",
  tags: { operation: "release" },
  extra: {
    run: `https://github.com/${process.env.GITHUB_REPOSITORY}/actions/runs/${process.env.GITHUB_RUN_ID}`,
  },
};
const response = await fetch(
  `${dsn.origin}/api${dsn.pathname}/envelope/?sentry_key=${dsn.username}&sentry_version=7`,
  {
    method: "POST",
    headers: { "Content-Type": "application/x-sentry-envelope" },
    body: [
      JSON.stringify({ event_id: event.event_id, dsn: vars.SENTRY_DSN }),
      JSON.stringify({ type: "event" }),
      JSON.stringify(event),
    ].join("\n"),
    signal: AbortSignal.timeout(10_000),
  },
);
if (!response.ok)
  throw new Error(`Sentry incident delivery failed: ${response.status}`);
console.info(`Sentry accepted release failure ${event.event_id}`);
