// The existing CI deploy credential, physically separate preview Worker/DO only.
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { readFileSync, writeFileSync } from "node:fs";
import { basename, dirname, join } from "node:path";

const config = JSON.parse(readFileSync("wrangler.artifact.json", "utf8"));
assert.equal(process.env.GITHUB_EVENT_NAME, "pull_request");
assert.equal(config.name, "double-take-backend-preview");
assert.equal(config.vars.DOUBLETAKE_PRIVATE_PREVIEW, "true");
assert.equal(config.workers_dev, false);
assert.equal(config.preview_urls, false);
assert.deepEqual(config.routes, [
  { pattern: "doubletake-preview.mistystep.io", custom_domain: true },
]);
assert.match(config.vars.APP_RELEASE, /^[a-f0-9]{40}$/);
const bindings = {
  DOUBLETAKE_BACKEND_ADMIN_KEY:
    process.env.DOUBLETAKE_PREVIEW_BACKEND_ADMIN_KEY,
  PARLOR_GUEST_TOKEN_KEYS: process.env.DOUBLETAKE_PREVIEW_GUEST_TOKEN_KEYS,
  DOUBLETAKE_CONTINUITY_SECRET:
    process.env.DOUBLETAKE_PREVIEW_CONTINUITY_SECRET,
  JEV_OPENROUTER_API_KEY: process.env.DOUBLETAKE_PREVIEW_JEV_API_KEY,
};
for (const value of Object.values(bindings)) assert.ok(value?.length >= 32);
const wrangler = (...args) =>
  execFileSync(
    "pnpm",
    ["exec", "wrangler", ...args, "--config", "wrangler.artifact.json"],
    { stdio: "inherit" },
  );
// New objects start frozen. No mutable production binding is referenced here.
wrangler("deploy");
execFileSync(
  "pnpm",
  ["exec", "wrangler", "secret", "bulk", "--config", "wrangler.artifact.json"],
  { input: JSON.stringify(bindings), stdio: ["pipe", "inherit", "inherit"] },
);
const api = `https://api.cloudflare.com/client/v4/accounts/${config.account_id}/workers/scripts/${config.name}`;
async function get(path) {
  const response = await fetch(`${api}/${path}`, {
    headers: { Authorization: `Bearer ${process.env.CLOUDFLARE_API_TOKEN}` },
    signal: AbortSignal.timeout(20_000),
  });
  assert.equal(response.status, 200);
  return response;
}
const { result } = await (await get("deployments")).json();
const versions = result.deployments[0].versions;
assert.equal(versions.length, 1);
assert.equal(versions[0].percentage, 100);
const version = versions[0].version_id;
const metadata = (await (await get(`versions/${version}`)).json()).result;
const remoteBindings = metadata.resources.bindings;
assert.equal(
  remoteBindings.find((b) => b.name === "APP_RELEASE").text,
  config.vars.APP_RELEASE,
);
const moduleHashes = {};
for (const [name, contents] of await (await get("content/v2")).formData()) {
  const hash = (bytes) => createHash("sha256").update(bytes).digest("hex");
  const remote = hash(Buffer.from(await contents.arrayBuffer()));
  assert.equal(
    remote,
    hash(readFileSync(join(dirname(config.main), basename(name)))),
  );
  moduleHashes[basename(name)] = remote;
}
assert.ok(moduleHashes[basename(config.main)]);
writeFileSync(
  "backend-preview-deployment.json",
  JSON.stringify(
    {
      observedAt: new Date().toISOString(),
      name: config.name,
      origin: "https://doubletake-preview.mistystep.io",
      release: config.vars.APP_RELEASE,
      version,
      moduleHashes,
      durableObjects: remoteBindings.filter(
        (b) => b.type === "durable_object_namespace",
      ),
      role: "preview-only",
    },
    null,
    2,
  ),
);
