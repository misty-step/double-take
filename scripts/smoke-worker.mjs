import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { createServer } from "node:net";
import { setTimeout } from "node:timers/promises";
import { pathToFileURL } from "node:url";

export async function probe(origin, release) {
  const home = await fetch(origin, { signal: AbortSignal.timeout(10_000) });
  assert.equal(home.status, 200);
  assert.match(await home.text(), /Double Take/i);
  const health = await fetch(`${origin}/api/health`, {
    signal: AbortSignal.timeout(10_000),
  });
  assert.equal(health.status, 200);
  const payload = await health.json();
  assert.equal(payload.release, release);
  assert.equal(payload.environment, "production");
  assert.equal(payload.dependencies.backend, "ok");
  const acquire = await fetch(`${origin}/api/guest`, {
    method: "POST",
    headers: { Origin: origin, "Content-Type": "application/json" },
    body: JSON.stringify({ mode: "acquire" }),
    signal: AbortSignal.timeout(10_000),
  });
  assert.equal(acquire.status, 200);
  assert.match(acquire.headers.get("set-cookie"), /HttpOnly/);
  assert.equal(typeof (await acquire.json()).token, "string");
  const denied = await fetch(`${origin}/api/guest`, {
    method: "POST",
    headers: { Origin: "https://unrelated.invalid" },
    signal: AbortSignal.timeout(10_000),
  });
  assert.equal(denied.status, 403);
  console.info(
    "Home, exact-release health, guest issuance and cross-origin refusal passed.",
  );
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const reservation = createServer();
  await new Promise((resolve) => reservation.listen(0, "127.0.0.1", resolve));
  const port = reservation.address().port;
  await new Promise((resolve) => reservation.close(resolve));
  const origin = `http://127.0.0.1:${port}`;
  const child = spawn(
    "pnpm",
    [
      "exec",
      "wrangler",
      "dev",
      "--local",
      "--ip",
      "127.0.0.1",
      "--port",
      String(port),
      "--inspector-port",
      "0",
      "--var",
      "APP_ENVIRONMENT:production",
      "--var",
      `APP_RELEASE:${process.env.APP_RELEASE}`,
      "--var",
      `PARLOR_GUEST_TOKEN_KEYS:${JSON.stringify({ preview: Buffer.alloc(32, 1).toString("base64url") })}`,
      "--var",
      `DOUBLETAKE_CONTINUITY_SECRET:${Buffer.alloc(32, 2).toString("base64url")}`,
    ],
    { stdio: "inherit", detached: true },
  );
  try {
    let ready = false;
    for (let attempt = 0; attempt < 60; attempt++) {
      if (child.exitCode !== null)
        throw new Error("Worker exited before readiness");
      try {
        const response = await fetch(origin, {
          signal: AbortSignal.timeout(1000),
        });
        assert.equal(response.status, 200);
        ready = true;
        break;
      } catch {
        await setTimeout(1000);
      }
    }
    assert.ok(ready, "Worker did not become ready");
    await probe(origin, process.env.APP_RELEASE);
  } finally {
    process.kill(-child.pid, "SIGTERM");
  }
}
