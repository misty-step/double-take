import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import { setTimeout } from "node:timers/promises";
import { probe } from "./smoke-worker.mjs";
import { restoreWorkerVersion } from "./rollback-worker.mjs";

const config = JSON.parse(readFileSync("wrangler.jsonc", "utf8"));
const api = `https://api.cloudflare.com/client/v4/accounts/${config.account_id}/workers/scripts/${config.name}`;
async function cloudflare(path) {
  const response = await fetch(`${api}/${path}`, {
    headers: { Authorization: `Bearer ${process.env.CLOUDFLARE_API_TOKEN}` },
    signal: AbortSignal.timeout(20_000),
  });
  assert.equal(response.status, 200, "Cloudflare metadata read failed");
  const value = await response.json();
  assert.equal(value.success, true);
  return value.result;
}
async function currentVersion() {
  const { deployments } = await cloudflare("deployments");
  const versions = deployments[0].versions;
  assert.equal(versions.length, 1, "Refuse a split deployment");
  assert.equal(versions[0].percentage, 100);
  return versions[0].version_id;
}
async function versionRelease(version) {
  const metadata = await cloudflare(`versions/${version}`);
  const release = metadata.resources.bindings.find(
    (b) => b.name === "APP_RELEASE",
  )?.text;
  assert.match(release, /^[0-9a-f]{40}$/);
  return release;
}
async function readback(version, release) {
  assert.equal(await currentVersion(), version);
  for (let attempt = 0; ; attempt++) {
    try {
      await probe("https://doubletake.mistystep.io", release);
      return;
    } catch (error) {
      if (attempt === 5) throw error;
      await setTimeout(5000);
    }
  }
}
async function rollback(version) {
  await restoreWorkerVersion({
    api,
    token: process.env.CLOUDFLARE_API_TOKEN,
    version,
  });
}
const previous = await currentVersion();
const previousRelease = await versionRelease(previous);
const receipt = { previous, previousRelease };
try {
  if (process.env.ROLLBACK_VERSION) {
    const target = process.env.ROLLBACK_VERSION;
    assert.match(target, /^[0-9a-f-]{36}$/);
    const release = await versionRelease(target);
    await rollback(target);
    await readback(target, release);
    Object.assign(receipt, { restored: target, release });
  } else {
    assert.equal(process.env.GITHUB_EVENT_NAME, "push");
    assert.equal(process.env.GITHUB_REF, "refs/heads/master");
    const release = process.env.APP_RELEASE;
    assert.match(release, /^[0-9a-f]{40}$/);
    const response = await fetch(
      `https://api.github.com/repos/${process.env.GITHUB_REPOSITORY}/commits/master`,
      {
        headers: { Authorization: `Bearer ${process.env.GH_TOKEN}` },
        signal: AbortSignal.timeout(20_000),
      },
    );
    assert.equal(response.status, 200);
    assert.equal(
      (await response.json()).sha,
      release,
      "Refuse superseded source",
    );
    try {
      execFileSync(
        "pnpm",
        [
          "exec",
          "wrangler",
          "deploy",
          "--config",
          "wrangler.artifact.json",
          "--keep-vars",
          "--var",
          "APP_ENVIRONMENT:production",
          "--var",
          `APP_RELEASE:${release}`,
        ],
        { stdio: "inherit" },
      );
      const deployed = await currentVersion();
      assert.notEqual(deployed, previous);
      assert.equal(await versionRelease(deployed), release);
      await readback(deployed, release);
      Object.assign(receipt, { deployed, release });
    } catch (error) {
      await rollback(previous);
      await readback(previous, previousRelease);
      receipt.restored = previous;
      throw error;
    }
  }
} finally {
  writeFileSync("deployment.json", JSON.stringify(receipt, null, 2) + "\n");
}
