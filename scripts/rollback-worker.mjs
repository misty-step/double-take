import assert from "node:assert/strict";

/** Code-only restoration: never force Cloudflare's changed-secret refusal. */
export async function restoreWorkerVersion({ api, token, version }) {
  const response = await fetch(`${api}/deployments`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      strategy: "percentage",
      versions: [{ version_id: version, percentage: 100 }],
      annotations: {
        "workers/message": "Restore verified code; backend state unchanged",
      },
    }),
    signal: AbortSignal.timeout(20_000),
  });
  assert.equal(
    response.status,
    200,
    "Code rollback refused; do not force incompatible secrets or bindings",
  );
  assert.equal((await response.json()).success, true);
}
