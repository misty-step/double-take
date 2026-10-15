import assert from "node:assert/strict";
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
  // Older rollback targets predate versioned notes. Every versioned build must
  // serve its own build-time changelog as part of the same consumer journey.
  if (payload.version !== undefined) {
    assert.match(payload.version, /^\d+\.\d+\.\d+(?:[-+][0-9A-Za-z.-]+)?$/);
    const notes = await fetch(`${origin}/changelog`, {
      signal: AbortSignal.timeout(10_000),
    });
    assert.equal(notes.status, 200);
    const text = (await notes.text()).replace(/<[^>]*>/g, "");
    assert.ok(text.includes(`This build · ${payload.version}`));
    assert.ok(text.includes("Changelog"));
  }
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
  await probe(process.argv[2], process.argv[3]);
}
