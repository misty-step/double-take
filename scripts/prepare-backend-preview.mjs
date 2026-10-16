// Generate only environment differences; the production config owns the runtime.
import { readFileSync, writeFileSync } from "node:fs";
import assert from "node:assert/strict";

const config = JSON.parse(readFileSync("wrangler.jsonc", "utf8"));
const origin = "https://doubletake-preview.mistystep.io";
const machine = process.env.DOUBLETAKE_PREVIEW_ACCESS_CLIENT_ID;
assert.match(machine, /^[a-zA-Z0-9]+\.access$/);
config.name = "double-take-backend-preview";
config.routes = [
  { pattern: "doubletake-preview.mistystep.io", custom_domain: true },
];
config.workers_dev = false;
config.preview_urls = false;
config.vars = {
  ...config.vars,
  NEXT_PUBLIC_CONVEX_URL: `${origin}/backend`,
  NEXT_PUBLIC_CONVEX_SITE_URL: `${origin}/backend/http`,
  APP_ENVIRONMENT: "staging",
  PRODUCT_ENVIRONMENT: "test",
  APP_RELEASE: process.env.APP_RELEASE,
  DOUBLETAKE_PRIVATE_PREVIEW: "true",
  DOUBLETAKE_ACCESS_ISSUER: "https://misty-step-pantry.cloudflareaccess.com",
  DOUBLETAKE_ACCESS_AUD:
    "a538fbd9c06213a52e699ae9cdc8db27de44fd68304f276a2deb71aa096608e3",
  DOUBLETAKE_OPERATOR_SUBJECTS: "",
  DOUBLETAKE_OPERATOR_MACHINES: machine,
  JEV_MODEL: "typesafe/jev-1.13",
  JEV_DECISIONS_URL: "https://openrouter.ai/api/alpha/decisions",
  SENTRY_DSN: "",
  NEXT_PUBLIC_SENTRY_DSN: "",
};
writeFileSync("wrangler.backend-preview.json", JSON.stringify(config, null, 2));
