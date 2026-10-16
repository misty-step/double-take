// Generate only environment differences; the production config owns the runtime.
import { readFileSync, writeFileSync } from "node:fs";

const config = JSON.parse(readFileSync("wrangler.jsonc", "utf8"));
const origin = "https://doubletake-preview.mistystep.io";
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
  DOUBLETAKE_PRIVATE_PREVIEW: "true",
  DOUBLETAKE_ACCESS_ISSUER: "https://misty-step-pantry.cloudflareaccess.com",
  DOUBLETAKE_ACCESS_AUD:
    "a538fbd9c06213a52e699ae9cdc8db27de44fd68304f276a2deb71aa096608e3",
  // No invented JWT subject: operator claim semantics await the owner ruling.
  DOUBLETAKE_OPERATOR_SUBJECTS: "",
  SENTRY_DSN: "",
  NEXT_PUBLIC_SENTRY_DSN: "",
};
writeFileSync("wrangler.backend-preview.json", JSON.stringify(config, null, 2));
