// Isolated preview only: native code rollback must preserve an accepted line.
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import {
  readFileSync,
  writeFileSync,
  rmSync,
  cpSync,
  existsSync,
} from "node:fs";
import { dirname, basename, join } from "node:path";
import { setTimeout as delay } from "node:timers/promises";
import { BackendOperator } from "@parlor/cloudflare/operator";
import { restoreWorkerVersion } from "./rollback-worker.mjs";

export async function proveHostedOutage({ api, version, origin }) {
  const headers = {
    "CF-Access-Client-Id": process.env.DOUBLETAKE_PREVIEW_ACCESS_CLIENT_ID,
    "CF-Access-Client-Secret":
      process.env.DOUBLETAKE_PREVIEW_ACCESS_CLIENT_SECRET,
  };
  assert.ok(Object.values(headers).every(Boolean));
  const transport = (input, init = {}) => {
    assert.equal(new URL(input).origin, origin);
    return fetch(input, {
      ...init,
      headers: { ...init.headers, ...headers },
      signal: AbortSignal.timeout(20_000),
    });
  };
  const operator = new BackendOperator({
    url: `${origin}/backend`,
    adminKey: process.env.DOUBLETAKE_PREVIEW_BACKEND_ADMIN_KEY,
    fetch: transport,
  });
  const call = async (kind, path, args) => {
    const response = await transport(`${origin}/backend/api/${kind}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ path, args: [args], format: "json" }),
    });
    assert.equal(response.status, 200, path);
    const result = await response.json();
    assert.equal(result.status, "success");
    return result.value;
  };
  const guest = async () => {
    const response = await transport(`${origin}/api/guest`, {
      method: "POST",
      headers: { Origin: origin, "Content-Type": "application/json" },
      body: JSON.stringify({ mode: "acquire" }),
    });
    assert.equal(response.status, 200);
    return (await response.json()).token;
  };
  const restore = () =>
    restoreWorkerVersion({
      api,
      token: process.env.CLOUDFLARE_API_TOKEN,
      version,
    });
  async function backendReady(configured) {
    let health;
    for (let i = 0; i < 600; i++) {
      const response = await transport(`${origin}/backend/http/health`);
      if (response.status === 200 || response.status === 503)
        health = await response.json();
      if (
        health?.judgeConfigured === configured &&
        (!configured || health.workerVersion === version)
      )
        return health;
      await delay(500);
    }
    throw new Error(`Backend code did not activate: ${JSON.stringify(health)}`);
  }
  await operator.freeze(true);
  const config = JSON.parse(readFileSync("wrangler.artifact.json", "utf8"));
  const executable = readFileSync(config.main, "utf8");
  const reader = /\bconst model = [A-Za-z_$][\w$]*\.JEV_MODEL;/g;
  assert.equal([...executable.matchAll(reader)].length, 1);
  const faultDirectory = ".outage-proof";
  assert.equal(existsSync(faultDirectory), false);
  cpSync(dirname(config.main), faultDirectory, { recursive: true });
  const faultMain = join(faultDirectory, basename(config.main));
  // Only this throwaway broken code version differs. The finalized candidate's
  // bytes stay untouched. Bindings-only updates may retain a live DO constructor
  // environment and therefore do not exercise a native CODE rollback.
  writeFileSync(faultMain, executable.replace(reader, 'const model = "";'));
  writeFileSync(
    "wrangler.outage-proof.json",
    JSON.stringify({ ...config, main: faultMain }),
  );
  let deployedFault = false;
  try {
    deployedFault = true;
    execFileSync(
      "pnpm",
      ["exec", "wrangler", "deploy", "--config", "wrangler.outage-proof.json"],
      { stdio: "inherit" },
    );
    const routed = await transport(`${origin}/api/health`);
    console.info("Fault-route health", await routed.json());
    const faultIdentity = await backendReady(false);
    await operator.freeze(false);
    const host = await guest(),
      friend = await guest();
    const room = await call("mutation", "rooms:createRoom", {
      guestToken: host,
      displayName: "Outage Host",
    });
    assert.equal(
      (
        await call("mutation", "rooms:joinRoom", {
          guestToken: friend,
          code: room.code,
          displayName: "Outage Friend",
        })
      ).ok,
      true,
    );
    const gameId = await call("mutation", "game:start", {
      roomId: room.roomId,
      requestId: `outage-${Date.now()}`,
      guestToken: host,
    });
    assert.equal(
      (
        await call("mutation", "game:submit", {
          gameId,
          guestToken: host,
          text: "We can face this together.",
        })
      ).ok,
      true,
    );
    let view;
    for (let i = 0; i < 60; i++) {
      view = await call("query", "game:view", { gameId, guestToken: host });
      if (view.me.line?.status === "failed") break;
      await delay(500);
    }
    assert.equal(view.me.line?.status, "failed");
    assert.equal(view.phase, "writing");
    assert.ok(view.players.every((p) => p.score === 0));
    await operator.freeze(true);
    for (let i = 0; (await operator.status()).runningActions > 0 && i < 60; i++)
      await delay(100);
    const accepted = await operator.exportSnapshot();
    assert.equal(
      accepted.snapshot.documents.rateLimits.find(
        (r) => r.playerId === room.playerId,
      )?.count,
      0,
    );
    await restore();
    deployedFault = false;
    const recoveredIdentity = await backendReady(true);
    assert.deepEqual((await operator.exportSnapshot()).stats, accepted.stats);
    await operator.freeze(false);
    // A rollout can outlast the game's last-player clock. Preserve the failed
    // accepted line exactly and prove recovered judging in a fresh match.
    await call("mutation", "rooms:closeRoom", {
      roomId: room.roomId,
      guestToken: host,
    });
    const recoveredRoom = await call("mutation", "rooms:createRoom", {
      guestToken: host,
      displayName: "Recovered Host",
    });
    assert.equal(
      (
        await call("mutation", "rooms:joinRoom", {
          guestToken: friend,
          code: recoveredRoom.code,
          displayName: "Recovered Friend",
        })
      ).ok,
      true,
    );
    const recoveredGame = await call("mutation", "game:start", {
      roomId: recoveredRoom.roomId,
      requestId: `recovered-${Date.now()}`,
      guestToken: host,
    });
    assert.equal(
      (
        await call("mutation", "game:submit", {
          gameId: recoveredGame,
          guestToken: host,
          text: "We can face this together.",
        })
      ).ok,
      true,
    );
    for (let i = 0; i < 120; i++) {
      view = await call("query", "game:view", {
        gameId: recoveredGame,
        guestToken: host,
      });
      if (view.me.line?.status === "judged") break;
      await delay(500);
    }
    assert.equal(view.me.line?.status, "judged");
    await call("mutation", "rooms:closeRoom", {
      roomId: recoveredRoom.roomId,
      guestToken: host,
    });
    return {
      unavailableJudgeInventedNoScore: true,
      acceptedLineRetainedAcrossNativeRollback: true,
      realJudgeRecoveredInFreshMatch: true,
      rateLimitRefunded: true,
      faultIdentity,
      recoveredIdentity,
      restored: version,
      canonicalStats: accepted.stats,
    };
  } finally {
    await operator.freeze(true).catch(() => {});
    if (deployedFault) await restore();
    rmSync(faultDirectory, { recursive: true, force: true });
    rmSync("wrangler.outage-proof.json", { force: true });
  }
}
