import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";

const { vars } = JSON.parse(readFileSync("wrangler.jsonc", "utf8"));
execFileSync("pnpm", ["exec", "opennextjs-cloudflare", "build"], {
  stdio: "inherit",
  env: { ...process.env, ...vars },
});
