import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { readFileSync, writeFileSync } from "node:fs";
import { basename, dirname, join } from "node:path";
import { setTimeout } from "node:timers/promises";
import { probe } from "./smoke-worker.mjs";
import { restoreWorkerVersion } from "./rollback-worker.mjs";

const config = JSON.parse(readFileSync("wrangler.artifact.json", "utf8"));
assert.match(process.env.GITHUB_RUN_ID, /^\d+$/);
const name = `double-take-cd-${process.env.GITHUB_RUN_ID}`;
const base = `https://api.cloudflare.com/client/v4/accounts/${config.account_id}/workers`;
async function get(path) {
  const response = await fetch(`${base}/${path}`, {
    headers: { Authorization: `Bearer ${process.env.CLOUDFLARE_API_TOKEN}` },
    signal: AbortSignal.timeout(20_000),
  });
  assert.equal(response.status, 200);
  const payload = await response.json();
  assert.equal(payload.success, true);
  return payload.result;
}
const origin = `https://${name}.${(await get("subdomain")).subdomain}.workers.dev`;
const existing = await fetch(`${base}/scripts/${name}`, {
  headers: { Authorization: `Bearer ${process.env.CLOUDFLARE_API_TOKEN}` },
  signal: AbortSignal.timeout(20_000),
});
assert.equal(existing.status, 404, "Refuse to take over an existing Worker");
// A run-owned Worker with no custom domain or production signing secrets.
Object.assign(config, {
  name,
  routes: [],
  observability: { enabled: false },
  vars: {
    ...config.vars,
    APP_ENVIRONMENT: "production",
    APP_RELEASE: process.env.APP_RELEASE,
    // Synthetic server probes must not create production error telemetry.
    SENTRY_DSN: "",
    NEXT_PUBLIC_SENTRY_DSN: "",
    PARLOR_GUEST_TOKEN_KEYS: JSON.stringify({
      preview: Buffer.alloc(32, 1).toString("base64url"),
    }),
    DOUBLETAKE_CONTINUITY_SECRET: Buffer.alloc(32, 2).toString("base64url"),
  },
});
writeFileSync("wrangler.preview.json", JSON.stringify(config));
function wrangler(...args) {
  execFileSync(
    "pnpm",
    ["exec", "wrangler", ...args, "--config", "wrangler.preview.json"],
    { stdio: "inherit" },
  );
}
async function version() {
  const { deployments } = await get(`scripts/${name}/deployments`);
  assert.equal(deployments[0].versions.length, 1);
  assert.equal(deployments[0].versions[0].percentage, 100);
  return deployments[0].versions[0].version_id;
}
async function verify(expected) {
  assert.equal(await version(), expected);
  for (let attempt = 0; ; attempt++) {
    try {
      await probe(origin, process.env.APP_RELEASE);
      break;
    } catch (error) {
      if (attempt === 11) throw error;
      await setTimeout(5000);
    }
  }
  const response = await fetch(`${base}/scripts/${name}/content/v2`, {
    headers: { Authorization: `Bearer ${process.env.CLOUDFLARE_API_TOKEN}` },
    signal: AbortSignal.timeout(20_000),
  });
  assert.equal(response.status, 200);
  const hashes = {};
  for (const [moduleName, contents] of await response.formData()) {
    assert.equal(typeof contents, "object");
    const filename = basename(moduleName);
    const local = createHash("sha256")
      .update(readFileSync(join(dirname(config.main), filename)))
      .digest("hex");
    const remote = createHash("sha256")
      .update(Buffer.from(await contents.arrayBuffer()))
      .digest("hex");
    assert.equal(remote, local, `Uploaded module bytes: ${filename}`);
    hashes[filename] = remote;
  }
  assert.ok(hashes[basename(config.main)], "Provider returned the main module");
  return hashes;
}
let proofError;
try {
  wrangler("deploy");
  const first = await version();
  const moduleHashes = await verify(first);
  // Same tested code, distinct provider version/configuration; no second build.
  wrangler("deploy", "--var", "ROLLBACK_PROOF_GENERATION:second");
  const second = await version();
  assert.notEqual(second, first);
  await verify(second);
  await restoreWorkerVersion({
    api: `${base}/scripts/${name}`,
    token: process.env.CLOUDFLARE_API_TOKEN,
    version: first,
  });
  await verify(first);
  writeFileSync(
    "preview-rollback.json",
    JSON.stringify(
      {
        name,
        origin,
        first,
        second,
        restored: first,
        moduleHashes,
        release: process.env.APP_RELEASE,
      },
      null,
      2,
    ) + "\n",
  );
} catch (error) {
  proofError = error;
} finally {
  // Wrangler delete probes unrelated KV namespaces. Delete only our Worker via
  // the provider API instead of broadening the shared credential for cleanup.
  const removed = await fetch(`${base}/scripts/${name}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${process.env.CLOUDFLARE_API_TOKEN}` },
    signal: AbortSignal.timeout(20_000),
  });
  const absent = await fetch(`${base}/scripts/${name}`, {
    headers: { Authorization: `Bearer ${process.env.CLOUDFLARE_API_TOKEN}` },
    signal: AbortSignal.timeout(20_000),
  });
  if (proofError)
    console.error("Rollback rehearsal failed before cleanup:", proofError);
  assert.ok(
    removed.status === 200 || removed.status === 404,
    "Delete the run-owned preview only",
  );
  assert.equal(absent.status, 404, "Preview cleanup readback");
}
if (proofError) throw proofError;
