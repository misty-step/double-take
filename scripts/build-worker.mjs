import { execFileSync } from "node:child_process";
import { readFileSync, rmSync, writeFileSync } from "node:fs";

const configPath = process.env.DOUBLETAKE_BUILD_CONFIG ?? "wrangler.jsonc";
const config = JSON.parse(readFileSync(configPath, "utf8"));
execFileSync("pnpm", ["exec", "opennextjs-cloudflare", "build"], {
  stdio: "inherit",
  env: { ...process.env, ...config.vars },
});
rmSync(".worker", { recursive: true, force: true });
execFileSync(
  "pnpm",
  [
    "exec",
    "wrangler",
    "deploy",
    "--config",
    configPath,
    "--dry-run",
    "--outdir",
    ".worker",
  ],
  { stdio: "inherit" },
);
writeFileSync(
  "wrangler.artifact.json",
  JSON.stringify({
    ...config,
    main: ".worker/worker.js",
    // The final bundle already resolved OpenNext. Do not retain a source alias
    // whose target is deliberately absent from the immutable artifact.
    alias: {},
    no_bundle: true,
    rules: [
      { type: "CompiledWasm", globs: ["**/*.wasm"], fallthrough: true },
      { type: "Data", globs: ["**/*.bin"], fallthrough: true },
    ],
  }),
);
