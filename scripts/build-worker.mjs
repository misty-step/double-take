import { execFileSync } from "node:child_process";
import { readFileSync, rmSync, writeFileSync } from "node:fs";

const config = JSON.parse(readFileSync("wrangler.jsonc", "utf8"));
execFileSync("pnpm", ["exec", "opennextjs-cloudflare", "build"], {
  stdio: "inherit",
  env: { ...process.env, ...config.vars },
});
rmSync(".worker", { recursive: true, force: true });
execFileSync(
  "pnpm",
  ["exec", "wrangler", "deploy", "--dry-run", "--outdir", ".worker"],
  { stdio: "inherit" },
);
writeFileSync(
  "wrangler.artifact.json",
  JSON.stringify({
    ...config,
    main: ".worker/worker.js",
    no_bundle: true,
    rules: [
      { type: "CompiledWasm", globs: ["**/*.wasm"], fallthrough: true },
      { type: "Data", globs: ["**/*.bin"], fallthrough: true },
    ],
  }),
);
