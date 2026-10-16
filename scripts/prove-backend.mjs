// Loopback-only proof of the finalized Worker, with synthetic identities/data
// and an explicit HTTP judge fixture. No production or paid judge calls.
import assert from "node:assert/strict";
import { spawn, spawnSync, execFileSync } from "node:child_process";
import { createHash, generateKeyPairSync, sign } from "node:crypto";
import { createServer } from "node:http";
import {
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { resolve } from "node:path";
import { setTimeout as delay } from "node:timers/promises";
import { ConvexClient } from "convex/browser";
import { makeFunctionReference } from "convex/server";
import { BackendOperator } from "@parlor/cloudflare/operator";
import {
  readConvexSnapshot,
  snapshotStats,
} from "@parlor/cloudflare/convex-zip";

const checks = [];
function passed(name) {
  checks.push(name);
  console.info(`PASS ${name}`);
}
async function until(work, accept, timeout = 15_000) {
  const deadline = Date.now() + timeout;
  let value;
  do {
    value = await work();
    if (accept(value)) return value;
    await delay(50);
  } while (Date.now() < deadline);
  throw new Error("Loopback proof condition timed out");
}
let judgeCalls = 0;
let refuseJudge = false;
const operatorKey = generateKeyPairSync("rsa", { modulusLength: 2048 });
const operatorJwk = {
  ...operatorKey.publicKey.export({ format: "jwk" }),
  kid: "loopback-operator",
  alg: "RS256",
  use: "sig",
};
const judge = createServer(async (request, response) => {
  if (request.url === "/cdn-cgi/access/certs") {
    response.setHeader("Content-Type", "application/json");
    response.end(JSON.stringify({ keys: [operatorJwk] }));
    return;
  }
  for await (const chunk of request) void chunk;
  judgeCalls++;
  response.setHeader("Content-Type", "application/json");
  if (refuseJudge) {
    response.writeHead(400).end("{}");
    return;
  }
  const answer = { type: "score", score: 3, confidence: 0.9 };
  response.end(
    JSON.stringify({
      model: "synthetic-http-fixture",
      answers: {
        appropriate_a: answer,
        appropriate_b: answer,
        coherence: answer,
      },
    }),
  );
});
await new Promise((done) => judge.listen(0, "127.0.0.1", done));
const reserve = createServer();
await new Promise((done) => reserve.listen(0, "127.0.0.1", done));
const port = reserve.address().port;
await new Promise((done) => reserve.close(done));
const origin = `http://127.0.0.1:${port}`;
const proveBrowser = process.env.DOUBLETAKE_PROVE_BROWSER === "true";
if (proveBrowser) {
  assert.ok(
    !process.env.DOUBLETAKE_CUSTODY_MANIFEST,
    "Never browse restored private data",
  );
  const config = JSON.parse(readFileSync("wrangler.jsonc", "utf8"));
  config.routes = [];
  config.vars = {
    ...config.vars,
    NEXT_PUBLIC_CONVEX_URL: `${origin}/backend`,
    NEXT_PUBLIC_CONVEX_SITE_URL: `${origin}/backend/http`,
    SENTRY_DSN: "",
    NEXT_PUBLIC_SENTRY_DSN: "",
  };
  writeFileSync("wrangler.loopback.json", JSON.stringify(config));
  execFileSync(process.execPath, ["scripts/build-worker.mjs"], {
    stdio: "inherit",
    env: {
      ...process.env,
      DOUBLETAKE_BUILD_CONFIG: "wrangler.loopback.json",
      APP_RELEASE: "8085f06e29cf8bfb9a1ce9f4e4ec0f89cb6718c5",
      APP_ENVIRONMENT: "staging",
    },
  });
}
const operatorIssuer = `http://127.0.0.1:${judge.address().port}`;
const jwtPart = (value) =>
  Buffer.from(JSON.stringify(value)).toString("base64url");
const jwtInput = `${jwtPart({ alg: "RS256", kid: operatorJwk.kid })}.${jwtPart({ iss: operatorIssuer, sub: "loopback-operator", aud: ["loopback-preview"], exp: Date.now() / 1000 + 600 })}`;
const operatorJwt = `${jwtInput}.${sign("RSA-SHA256", Buffer.from(jwtInput), operatorKey.privateKey).toString("base64url")}`;
const artifact = JSON.parse(readFileSync("wrangler.artifact.json", "utf8"));
const fixture = {
  ...artifact,
  name: "double-take-loopback-proof",
  routes: [],
  main: resolve(artifact.main),
  assets: { ...artifact.assets, directory: resolve(artifact.assets.directory) },
  observability: { enabled: false },
  vars: {
    ...artifact.vars,
    APP_RELEASE: "8085f06e29cf8bfb9a1ce9f4e4ec0f89cb6718c5",
    APP_ENVIRONMENT: "production",
    PRODUCT_ENVIRONMENT: "test",
    DOUBLETAKE_ACCESS_ISSUER: operatorIssuer,
    DOUBLETAKE_ACCESS_AUD: "loopback-preview",
    DOUBLETAKE_OPERATOR_SUBJECTS: "loopback-operator",
    NEXT_PUBLIC_CONVEX_SITE_URL: `${origin}/backend/http`,
    SENTRY_DSN: "",
    NEXT_PUBLIC_SENTRY_DSN: "",
    PARLOR_GUEST_TOKEN_KEYS: JSON.stringify({
      fixture: Buffer.alloc(32, 1).toString("base64url"),
    }),
    DOUBLETAKE_CONTINUITY_SECRET: Buffer.alloc(32, 2).toString("base64url"),
    DOUBLETAKE_BACKEND_ADMIN_KEY:
      "synthetic-loopback-admin-key-not-a-real-credential",
    JEV_MODEL: "synthetic-http-fixture",
    JEV_OPENROUTER_API_KEY: "synthetic-loopback-judge-key",
    JEV_DECISIONS_URL: `http://127.0.0.1:${judge.address().port}/decisions`,
  },
};
mkdirSync(".wrangler", { recursive: true });
// Separate runs must never reuse a prior game's database. The same run keeps
// this exact directory across its deliberate process restart.
const stateDirectory = mkdtempSync(".wrangler/backend-proof-state-");
writeFileSync(".wrangler/backend-proof-config.json", JSON.stringify(fixture));
const adminHeaders = {
  "Cf-Access-Jwt-Assertion": operatorJwt,
  Authorization: `Bearer ${fixture.vars.DOUBLETAKE_BACKEND_ADMIN_KEY}`,
  "Content-Type": "application/json",
};
let worker;
let logs = "";
const clients = [];
async function start() {
  worker = spawn(
    "pnpm",
    [
      "exec",
      "wrangler",
      "dev",
      "--local",
      "--config",
      ".wrangler/backend-proof-config.json",
      "--ip",
      "127.0.0.1",
      "--port",
      String(port),
      "--inspector-port",
      "0",
      "--persist-to",
      stateDirectory,
    ],
    { detached: true, stdio: ["ignore", "pipe", "pipe"] },
  );
  worker.stdout.on("data", (chunk) => (logs += chunk));
  worker.stderr.on("data", (chunk) => (logs += chunk));
  await until(
    () => admin("status").catch(() => null),
    (value) => value !== null,
    30_000,
  );
}
async function stop() {
  if (!worker || worker.exitCode !== null) return;
  const exited = new Promise((done) => worker.once("exit", done));
  process.kill(-worker.pid, "SIGTERM");
  await exited;
}
async function admin(path, body) {
  const response = await fetch(`${origin}/backend/admin/${path}`, {
    method: body === undefined ? "GET" : "POST",
    headers: adminHeaders,
    body: body === undefined ? undefined : JSON.stringify(body),
    signal: AbortSignal.timeout(10_000),
  });
  assert.equal(response.status, 200);
  return response.json();
}
async function guest(mode = "acquire", cookie) {
  const response = await fetch(`${origin}/api/guest`, {
    method: "POST",
    headers: {
      Origin: origin,
      "Content-Type": "application/json",
      ...(cookie ? { Cookie: cookie } : {}),
    },
    body: JSON.stringify({ mode }),
  });
  assert.equal(response.status, 200);
  return {
    ...(await response.json()),
    cookie: response.headers.get("set-cookie").split(";")[0],
  };
}
async function call(kind, path, args = {}) {
  const response = await fetch(`${origin}/backend/api/${kind}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ path, args: [args], format: "json" }),
  });
  const payload = await response.json();
  return { code: response.status, ...payload };
}
async function ok(kind, path, args) {
  const payload = await call(kind, path, args);
  assert.equal(
    payload.code,
    200,
    `${kind} ${path}: ${JSON.stringify(payload)}`,
  );
  assert.equal(payload.status, "success");
  return payload.value;
}
try {
  await start();
  assert.equal((await admin("status")).writesFrozen, true);
  assert.equal((await fetch(`${origin}/backend/admin/status`)).status, 403);
  assert.equal(
    (
      await fetch(`${origin}/backend/admin/status`, {
        headers: { Authorization: adminHeaders.Authorization },
      })
    ).status,
    403,
  );
  assert.equal(
    (
      await fetch(`${origin}/backend/admin/status`, {
        headers: { "Cf-Access-Jwt-Assertion": operatorJwt },
      })
    ).status,
    401,
  );
  assert.equal((await fetch(`${origin}/backend/http/health`)).status, 503);
  if (process.env.DOUBLETAKE_CUSTODY_MANIFEST) {
    const manifestPath = resolve(process.env.DOUBLETAKE_CUSTODY_MANIFEST);
    const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
    assert.match(manifest.ciphertext, /^doubletake-rehearsal-\d+\.zip\.age$/);
    const identity = execFileSync(
      "pass",
      ["show", "workstation/DOUBLETAKE_BACKUP_AGE_IDENTITY"],
      { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] },
    );
    const plaintext = spawnSync(
      "age",
      ["-d", "-i", "-", resolve(manifestPath, "..", manifest.ciphertext)],
      {
        input: identity,
        stdio: ["pipe", "pipe", "pipe"],
        maxBuffer: 300 * 1024 * 1024,
      },
    );
    assert.equal(plaintext.status, 0, "Decrypt custody for isolated restore");
    assert.equal(
      createHash("sha256").update(plaintext.stdout).digest("hex"),
      manifest.plaintextSha256,
    );
    const snapshot = readConvexSnapshot(new Uint8Array(plaintext.stdout));
    const expected = await snapshotStats(snapshot);
    const operator = new BackendOperator({
      url: `${origin}/backend`,
      adminKey: fixture.vars.DOUBLETAKE_BACKEND_ADMIN_KEY,
      fetch: (input, init) =>
        fetch(input, {
          ...init,
          headers: { ...init.headers, "Cf-Access-Jwt-Assertion": operatorJwt },
        }),
    });
    await operator.importSnapshot(snapshot);
    assert.deepEqual((await admin("stats")).tables, expected);
    const exported = await operator.exportSnapshot();
    assert.deepEqual(exported.stats, expected);
    const before = await admin("stats");
    await stop();
    await start();
    assert.deepEqual(await admin("stats"), before);
    assert.equal((await admin("status")).writesFrozen, true);
    const proof = {
      mode: "private-custody-isolated-loopback-restore",
      artifactSha256: createHash("sha256")
        .update(readFileSync(artifact.main))
        .digest("hex"),
      snapshotTimestamp: manifest.snapshotTimestamp,
      ciphertextSha256: manifest.ciphertextSha256,
      sourcePlaintextHashEqual: true,
      canonicalUserTablesEqual: true,
      roundtripExportEqual: true,
      processRestartEqual: true,
      writesStayedFrozen: true,
      rowsPrinted: false,
      tables: expected,
    };
    writeFileSync(
      ".wrangler/custody-restore-proof.json",
      JSON.stringify(proof, null, 2),
    );
    passed(
      "private encrypted source snapshot restores, re-exports and restarts with exact canonical records; writer remains frozen",
    );
  } else {
    const host = await guest();
    const friend = await guest();
    const outsider = await guest();
    const create = (token) => ({
      displayName: "Synthetic Host",
      guestToken: token,
    });
    assert.notEqual(
      (await call("mutation", "rooms:createRoom", create(host.token))).code,
      200,
    );
    passed("new object frozen; anonymous admin and public writes refused");
    await admin("freeze", { frozen: false });
    assert.equal((await fetch(`${origin}/backend/http/health`)).status, 200);
    const health = await fetch(`${origin}/api/health`);
    assert.equal(health.status, 200);
    assert.equal((await health.json()).dependencies.backend, "ok");
    passed(
      "same-Worker health uses backend binding; signed Access and admin bearer are independently required",
    );
    assert.notEqual(
      (await call("mutation", "rooms:createRoom", create("invalid"))).code,
      200,
    );
    assert.notEqual(
      (await call("mutation", "rooms:createRoom", create(undefined))).code,
      200,
    );
    const room = await ok("mutation", "rooms:createRoom", create(host.token));
    const join = await ok("mutation", "rooms:joinRoom", {
      code: room.code,
      displayName: "Synthetic Guest",
      guestToken: friend.token,
    });
    assert.equal(join.ok, true);
    const refreshed = await guest("refresh", host.cookie);
    const state = await ok("query", "rooms:getRoomState", {
      roomId: room.roomId,
      guestToken: refreshed.token,
    });
    assert.equal(state.viewerPlayerId, room.playerId);
    assert.equal(state.members.length, 2);
    passed(
      "guest issuance, two real seats, invalid identity denial, continuity refresh",
    );
    let updates = 0;
    const socket = new ConvexClient(`${origin}/backend`, {
      webSocketConstructor: WebSocket,
    });
    clients.push(socket);
    const unsubscribe = socket.onUpdate(
      makeFunctionReference("rooms:getRoomState"),
      { roomId: room.roomId, guestToken: host.token },
      () => updates++,
    );
    await until(
      async () => updates,
      (count) => count > 0,
    );
    const startArgs = {
      roomId: room.roomId,
      requestId: "loopback-game",
      guestToken: host.token,
    };
    const starts = await Promise.all([
      ok("mutation", "game:start", startArgs),
      ok("mutation", "game:start", startArgs),
    ]);
    assert.equal(starts[0], starts[1]);
    const gameId = starts[0];
    const view = (token = host.token) =>
      ok("query", "game:view", { gameId, guestToken: token });
    assert.notEqual(
      (await call("query", "game:view", { gameId, guestToken: outsider.token }))
        .code,
      200,
    );
    assert.notEqual(
      (await call("mutation", "game:closeWriting", { gameId, round: 1 })).code,
      200,
    );
    passed(
      "real WebSocket subscription, concurrent idempotent start, cross-room/internal denial",
    );
    const pairs = new Set();
    for (let round = 1; round <= 3; round++) {
      const current = await view();
      pairs.add(current.pair.key);
      const submit = (token, text) =>
        ok("mutation", "game:submit", { gameId, guestToken: token, text });
      assert.equal((await submit(host.token, "")).ok, false);
      if (round === 1) {
        refuseJudge = true;
        assert.equal(
          (
            await submit(
              host.token,
              "This synthetic judge must refuse this line",
            )
          ).ok,
          true,
        );
        await until(
          () => view(),
          (v) => v.me.line?.status === "failed",
        );
        assert.equal((await view()).phase, "writing");
        refuseJudge = false;
        passed(
          "HTTP judge refusal unlocks accepted line without inventing points",
        );
      }
      assert.equal(
        (
          await submit(
            host.token,
            `This synthetic host line fits round ${round}`,
          )
        ).ok,
        true,
      );
      await until(
        () => view(),
        (v) => v.me.line?.status === "judged",
      );
      const hidden = await view(friend.token);
      assert.equal(hidden.reveal, null);
      assert.ok(
        !JSON.stringify(hidden).includes(
          `This synthetic host line fits round ${round}`,
        ),
      );
      assert.equal(
        (
          await submit(
            host.token,
            "Duplicate must not replace the accepted line",
          )
        ).code,
        "ALREADY_LOCKED",
      );
      assert.equal(
        (
          await submit(
            friend.token,
            `This synthetic guest line fits round ${round}`,
          )
        ).ok,
        true,
      );
      const revealed = await until(
        () => view(),
        (v) => v.phase === "reveal",
      );
      assert.deepEqual(
        revealed.players.map((player) => player.score),
        [round * 6, round * 6],
      );
      assert.equal(revealed.reveal.lines.length, 2);
      await until(
        () =>
          ok("mutation", "game:advance", { gameId, guestToken: host.token }),
        (value) => value.ok,
        25_000,
      );
    }
    assert.equal(pairs.size, 3);
    assert.equal((await view()).phase, "finished");
    assert.ok(judgeCalls >= 7);
    passed(
      "three-round real Worker lifecycle; private writing, score-once, distinct pairs and final",
    );
    await until(
      async () => updates,
      (count) => count > 1,
    );
    unsubscribe();
    await socket.close();
    await admin("freeze", { frozen: true });
    await until(
      () => admin("status"),
      (value) => value.runningActions === 0,
    );
    const before = await admin("stats");
    const refused = await call(
      "mutation",
      "rooms:createRoom",
      create(host.token),
    );
    assert.notEqual(refused.code, 200);
    assert.equal((await admin("stats")).ts, before.ts);
    await stop();
    await start();
    const after = await admin("stats");
    assert.deepEqual(after, before);
    assert.equal((await view()).phase, "finished");
    passed(
      "freeze barrier and process restart retain exact table checksums and finished game",
    );
    await admin("freeze", { frozen: false });
    await ok("mutation", "rooms:closeRoom", {
      roomId: room.roomId,
      guestToken: host.token,
    });
    passed("write recovery and host room closure");
    // Synthetic snapshot with omitted scheduler rows, through the actual private
    // HTTP operator interface. Never modify or unfreeze the custody restore.
    const recoveryRoom = await ok(
      "mutation",
      "rooms:createRoom",
      create(host.token),
    );
    assert.equal(
      (
        await ok("mutation", "rooms:joinRoom", {
          code: recoveryRoom.code,
          displayName: "Recovery Guest",
          guestToken: friend.token,
        })
      ).ok,
      true,
    );
    const recoveryGame = await ok("mutation", "game:start", {
      roomId: recoveryRoom.roomId,
      requestId: "recovery-proof",
      guestToken: host.token,
    });
    const recoveryView = () =>
      ok("query", "game:view", {
        gameId: recoveryGame,
        guestToken: host.token,
      });
    assert.equal(
      (
        await ok("mutation", "game:submit", {
          gameId: recoveryGame,
          guestToken: host.token,
          text: "Recover this accepted synthetic line",
        })
      ).ok,
      true,
    );
    await until(recoveryView, (value) => value.me.line?.status === "judged");
    await admin("freeze", { frozen: true });
    await until(
      () => admin("status"),
      (value) => value.runningActions === 0,
    );
    const operator = new BackendOperator({
      url: `${origin}/backend`,
      adminKey: fixture.vars.DOUBLETAKE_BACKEND_ADMIN_KEY,
      fetch: (input, init) =>
        fetch(input, {
          ...init,
          headers: { ...init.headers, "Cf-Access-Jwt-Assertion": operatorJwt },
        }),
    });
    const base = (await operator.exportSnapshot()).snapshot;
    const rearmPath = `${origin}/backend/http/migration/rearm`;
    assert.equal(
      (
        await fetch(rearmPath, {
          method: "POST",
          headers: { Authorization: adminHeaders.Authorization },
          body: "{}",
        })
      ).status,
      403,
    );
    for (const table of ["rounds", "submissions"]) {
      const snapshot = structuredClone(base);
      const round = snapshot.documents.rounds.find(
        (row) => row.gameId === recoveryGame,
      );
      round.lastDeadline = Date.now() - 1;
      if (table === "submissions") {
        const row = snapshot.documents.submissions.find(
          (row) => row.gameId === recoveryGame,
        );
        row.status = "pending";
        delete row.adjudicationId;
      }
      await operator.importSnapshot(snapshot);
      assert.equal(
        (
          await fetch(rearmPath, {
            method: "POST",
            headers: adminHeaders,
            body: JSON.stringify({ table, cursor: null }),
          })
        ).status,
        503,
      );
      await operator.freeze(false);
      const rearm = async () => {
        const response = await fetch(rearmPath, {
          method: "POST",
          headers: adminHeaders,
          body: JSON.stringify({ table, cursor: null }),
        });
        assert.equal(response.status, 200);
        return response.json();
      };
      assert.equal((await rearm()).scheduled, 1);
      assert.equal((await rearm()).scheduled, 0);
      const recovered = await until(
        recoveryView,
        (value) => value.phase === "reveal",
      );
      assert.deepEqual(
        recovered.players.map((player) => player.score),
        [6, 0],
      );
      await operator.freeze(true);
      await until(
        () => admin("status"),
        (value) => value.runningActions === 0,
      );
    }
    await operator.freeze(false);
    await ok("mutation", "rooms:closeRoom", {
      roomId: recoveryRoom.roomId,
      guestToken: host.token,
    });
    passed(
      "actual HTTP snapshot re-arm recovers omitted deadline and pending judgment once; frozen/anonymous requests denied",
    );
    if (proveBrowser) {
      const { proveBrowser: browserJourney } =
        await import("./prove-browser.mjs");
      await browserJourney(origin, ".wrangler/browser-screens");
      passed(
        "two real desktop/mobile browser guests complete three rounds, private writing, reload continuity and final; no Convex traffic",
      );
    }
    const result = {
      mode: "loopback-synthetic-only",
      artifactSha256: createHash("sha256")
        .update(readFileSync(artifact.main))
        .digest("hex"),
      checks,
      judgeCalls,
      runtime: process.version,
      limitations: [
        "Judge is an HTTP fixture, not paid Jev",
        "No hosted preview, exact-head CI, independent review or live cutover proof",
        "Browser screenshots are local synthetic evidence only when the browser option ran",
      ],
    };
    writeFileSync(
      ".wrangler/backend-proof.json",
      JSON.stringify(result, null, 2),
    );
  }
} finally {
  for (const client of clients) await client.close();
  await stop();
  await new Promise((done) => judge.close(done));
  writeFileSync(".wrangler/backend-proof-runtime.log", logs);
  rmSync(stateDirectory, { recursive: true, force: true });
  if (proveBrowser) rmSync("wrangler.loopback.json", { force: true });
}
