#!/usr/bin/env node
import assert from "node:assert/strict";
import { createServer } from "node:http";
import { access, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { setTimeout as delay } from "node:timers/promises";
import {
  ROOT,
  LocalProcesses,
  buildParlor,
  prepareLocalEnvironment,
  startBackend,
  configureBackend,
  runInternal,
  startWeb,
} from "../../../../scripts/local.mjs";

const LOCAL = "http://localhost:3210";
const PRODUCTION = "https://doubletake.mistystep.io";
const [mode, output] = process.argv.slice(2);
assert(
  ["run", "production", "doctor"].includes(mode) &&
    output &&
    process.argv.length === 4,
  "Usage: verify.mjs run|production <new-evidence-directory> OR doctor local|production",
);

async function health(origin) {
  const response = await fetch(`${origin}/api/health`, {
    signal: AbortSignal.timeout(8000),
  });
  assert.equal(response.status, 200, "health must return 200");
  const data = await response.json();
  assert.equal(data.service, "double-take");
  assert.equal(data.status, "ok");
  assert.equal(data.dependencies.backend, "ok");
  assert.equal(data.environment, origin === LOCAL ? "test" : "production");
  if (origin === LOCAL) {
    assert.equal(data.release, "local");
    const config = JSON.parse(
      await readFile(
        resolve(ROOT, ".convex/local/default/config.json"),
        "utf8",
      ),
    );
    assert.match(config.deploymentName, /^anonymous-/);
    assert.equal(config.cloudProjectId, undefined);
    const instance = await fetch("http://127.0.0.1:3220/instance_name");
    assert.equal(await instance.text(), config.deploymentName);
  } else assert.match(data.release, /^[a-f0-9]{40}$/);
  return data;
}

if (mode === "doctor") {
  assert(["local", "production"].includes(output));
  console.log(
    JSON.stringify(await health(output === "local" ? LOCAL : PRODUCTION)),
  );
  process.exit(0);
}

const evidence = resolve(output);
// An exclusive output directory prevents overwriting another run's proof.
await mkdir(evidence);
const events = [];
let step = "setup";
async function note(action, result) {
  step = action;
  events.push({ at: new Date().toISOString(), action, result });
  await writeFile(
    resolve(evidence, "actions.json"),
    JSON.stringify(events, null, 2) + "\n",
  );
  console.log(`${action}: ${result}`);
}
async function shot(page, name) {
  await writeFile(
    resolve(evidence, `${name}.aria.txt`),
    await page.locator("body").ariaSnapshot(),
  );
  await page.screenshot({
    path: resolve(evidence, `${name}.png`),
    fullPage: true,
  });
}
async function click(page, name) {
  step = `click ${name}`;
  await page.getByRole("button", { name, exact: true }).click();
}
async function visible(locator) {
  await locator.waitFor({ state: "visible", timeout: 45000 });
}
async function home(page, origin = LOCAL) {
  await page.goto(origin);
  await visible(
    page.getByRole("button", { name: "Start a game", exact: true }),
  );
}
async function menu(page, entry = "Game menu") {
  await click(page, entry);
  await visible(page.getByRole("dialog", { name: "Game menu" }));
}

let browser;
let processes;
let createdLocal = false;
let fixture;
let fixtureCalls = 0;
let success = false;
try {
  const module = process.env.PLAYWRIGHT_MODULE;
  const { chromium } = await import(
    module ? pathToFileURL(resolve(module)).href : "playwright"
  );
  browser = await chromium.launch(
    process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE
      ? { executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE }
      : {},
  );
  if (mode === "production") {
    await note("production doctor", JSON.stringify(await health(PRODUCTION)));
    const context = await browser.newContext({
      viewport: { width: 390, height: 844 },
      reducedMotion: "reduce",
    });
    let guestIssued = false;
    let forbiddenWrites = 0;
    await context.route("**/*", async (route) => {
      const request = route.request();
      const url = new URL(request.url());
      if (!["GET", "HEAD", "OPTIONS"].includes(request.method())) {
        if (url.origin !== PRODUCTION || url.pathname !== "/api/guest") {
          // Telemetry is unnecessary for read-only verification.
          if (
            url.origin === PRODUCTION ||
            url.hostname.endsWith("convex.cloud")
          )
            forbiddenWrites++;
          return route.abort();
        }
      }
      await route.continue();
    });
    const page = await context.newPage();
    page.on("response", (response) => {
      if (
        response.url() === `${PRODUCTION}/api/guest` &&
        response.status() === 200
      )
        guestIssued = true;
    });
    await home(page, PRODUCTION);
    assert(guestIssued, "landing must acquire a guest session");
    await shot(page, "production-home-mobile");
    await click(page, "How to play");
    await visible(page.getByRole("dialog"));
    await shot(page, "production-help");
    await click(page, "Close");
    await page.getByRole("link", { name: "Changelog", exact: true }).click();
    await visible(page.getByRole("link", { name: "Back to the game" }));
    await shot(page, "production-changelog");
    assert.equal(
      forbiddenWrites,
      0,
      "no production game write may be attempted",
    );
    await note(
      "production landing, guest issuance, help, changelog",
      "PASS; no room created; no model request; owner login n/a (accountless)",
    );
    success = true;
  } else {
    // Only empty, disposable checkouts are eligible for this destructive cleanup.
    for (const path of [".convex", ".env", ".env.local"]) {
      let exists = true;
      try {
        await access(resolve(ROOT, path));
      } catch (error) {
        if (error.code !== "ENOENT") throw error;
        exists = false;
      }
      assert(
        !exists,
        `${path} already exists: use a fresh disposable checkout`,
      );
    }
    delete process.env.JEV_OPENROUTER_API_KEY;
    delete process.env.OPENROUTER_API_KEY;
    delete process.env.JEV_MODEL;
    delete process.env.JEV_DECISIONS_URL;
    processes = new LocalProcesses();
    createdLocal = true;
    const local = await prepareLocalEnvironment({ create: true });
    step = "build Parlor";
    await buildParlor(processes);
    step = "start anonymous local backend";
    const backend = await startBackend(processes, local);
    step = "configure local backend";
    await configureBackend(processes, local, backend);
    step = "seed local content";
    await runInternal(processes, local, "seed:run");
    const web = await startWeb(processes, local);
    const deadline = Date.now() + 180000;
    let ready;
    while (Date.now() < deadline) {
      assert(
        !web.finished && !backend.job.finished,
        "owned server exited during launch",
      );
      try {
        ready = await health(LOCAL);
        break;
      } catch {
        await delay(500);
      }
    }
    assert(
      ready,
      "usable frontend and backend must become ready within 180 seconds",
    );
    await note("local doctor", JSON.stringify(ready));
    const hostContext = await browser.newContext({
      viewport: { width: 390, height: 844 },
      reducedMotion: "reduce",
    });
    const guestContext = await browser.newContext({
      viewport: { width: 390, height: 844 },
      reducedMotion: "reduce",
    });
    const host = await hostContext.newPage();
    const guest = await guestContext.newPage();
    await home(host);
    await click(host, "How to play");
    await visible(host.getByRole("dialog"));
    await shot(host, "local-help");
    await click(host, "Close");
    await click(host, "Start a game");
    await click(host, "Start a game");
    await visible(host.getByRole("alert").filter({ hasText: "Add your name" }));
    await host.getByLabel("Your name", { exact: true }).fill("Verify Host");
    await click(host, "Start a game");
    await visible(host.getByRole("list", { name: "Players", exact: true }));
    const code = (await host.locator("p.code").textContent()).trim();
    assert.match(code, /^[A-Z0-9]{4}$/);
    assert.equal(
      await host
        .getByRole("button", { name: "Start the game", exact: true })
        .count(),
      0,
    );
    await shot(host, "solo-host");
    await home(guest);
    await click(guest, "Join a game");
    await guest.getByLabel("Your name", { exact: true }).fill("Verify Guest");
    await guest.getByLabel("Game code", { exact: true }).fill("A");
    await click(guest, "Join");
    await visible(
      guest.getByRole("alert").filter({ hasText: "four character" }),
    );
    await guest.getByLabel("Game code", { exact: true }).fill(code);
    await click(guest, "Join");
    await visible(
      host
        .getByRole("list", { name: "Players", exact: true })
        .getByText("Verify Guest"),
    );
    await visible(
      guest
        .getByRole("list", { name: "Players", exact: true })
        .getByText("Verify Host"),
    );
    assert.equal(
      await guest
        .getByRole("button", { name: "Start the game", exact: true })
        .count(),
      0,
    );
    await shot(host, "two-player-lobby");
    await guest.reload();
    await visible(guest.getByRole("list", { name: "Players", exact: true }));
    await note(
      "guest continuity and create/join",
      "PASS; two isolated browser sessions see the same roster; reload restores seat; lone host cannot start",
    );
    await click(host, "Start the game");
    await visible(
      host.getByLabel("Your line, one sentence, twelve words at most"),
    );
    await visible(
      guest.getByLabel("Your line, one sentence, twelve words at most"),
    );
    assert.equal(
      await host.locator("#write-h").textContent(),
      await guest.locator("#write-h").textContent(),
    );
    const line = host.getByLabel(
      "Your line, one sentence, twelve words at most",
    );
    const lock = host.getByRole("button", { name: "Lock it in", exact: true });
    assert(await lock.isDisabled());
    await line.fill(
      "one two three four five six seven eight nine ten eleven twelve thirteen",
    );
    assert(await lock.isDisabled());
    await line.fill("This is our verification line.");
    step = "submit with Enter and missing judge";
    await line.press("Enter");
    await visible(
      host.getByRole("alert").filter({ hasText: "Lock it in again" }),
    );
    await visible(line);
    await shot(host, "missing-judge-retry");
    await note(
      "writing validation and missing-judge failure",
      "PASS; empty/13-word lines disabled; no-key submission returns retry, never a fabricated score",
    );
    await note(
      "doctor after expected scoring failure",
      JSON.stringify(await health(LOCAL)),
    );

    // Existing HTTP judge boundary only: synthetic answers, never OpenRouter.
    fixture = createServer(async (request, response) => {
      try {
        let body = "";
        for await (const chunk of request) body += chunk;
        const input = JSON.parse(body);
        assert.equal(input.model, "verification-fixture");
        assert.deepEqual(Object.keys(input.questions).sort(), [
          "appropriate_a",
          "appropriate_b",
          "coherence",
        ]);
        fixtureCalls++;
        const score = { type: "score", score: 3, confidence: 1 };
        response.setHeader("Content-Type", "application/json");
        response.end(
          JSON.stringify({
            model: "verification-fixture",
            answers: {
              appropriate_a: score,
              appropriate_b: score,
              coherence: score,
            },
          }),
        );
      } catch {
        response.writeHead(400);
        response.end("verification judge contract mismatch");
      }
    });
    await new Promise((resolve) => fixture.listen(0, "127.0.0.1", resolve));
    process.env.JEV_OPENROUTER_API_KEY = "synthetic-verification-only";
    process.env.JEV_MODEL = "verification-fixture";
    process.env.JEV_DECISIONS_URL = `http://127.0.0.1:${fixture.address().port}/decisions`;
    step = "configure local backend";
    await configureBackend(processes, local, backend);
    for (let round = 1; round <= 3; round++) {
      step = `round ${round} submit and synchronized reveal`;
      await visible(host.locator("#write-h"));
      assert.match(
        await host.locator("#write-h").textContent(),
        new RegExp(`Round ${round}:`),
      );
      await line.fill(`This is verification round ${round}.`);
      await click(host, "Lock it in");
      await visible(host.locator(".locked-line"));
      assert(
        !(await guest.locator("body").innerText()).includes(
          `This is verification round ${round}.`,
        ),
      );
      if (round > 1) {
        await guest
          .getByLabel("Your line, one sentence, twelve words at most")
          .fill(`Another verification line for round ${round}.`);
        await click(guest, "Lock it in");
      }
      await visible(host.getByRole("list", { name: "Every line this round" }));
      await visible(guest.getByRole("list", { name: "Every line this round" }));
      const hostLines = await host
        .getByRole("list", { name: "Every line this round" })
        .innerText();
      const guestLines = await guest
        .getByRole("list", { name: "Every line this round" })
        .innerText();
      assert.equal(
        hostLines.replace(/\bYou\b/g, "Verify Host"),
        guestLines.replace(/\bYou\b/g, "Verify Guest"),
      );
      assert.deepEqual(
        await host.locator(".ranked .pts").allTextContents(),
        round === 1 ? ["6", "0"] : ["6", "6"],
      );
      assert.deepEqual(
        await host.locator(".standings .total").allTextContents(),
        [String(round * 6), String((round - 1) * 6)],
      );
      await shot(host, `round-${round}-scores-fixture`);
      await note(
        `round ${round} reveal with HTTP fixture`,
        round === 1
          ? "PASS; idle guest hits real 30-second deadline; both clients reveal the same line (synthetic judge)"
          : "PASS; peer line hidden before reveal, both clients show identical lines and scores (synthetic judge)",
      );
      await click(host, round === 3 ? "See who won" : "Next round");
    }
    await visible(
      host.getByRole("button", { name: "Play again", exact: true }),
    );
    await shot(host, "match-finished-fixture");
    assert.equal(
      fixtureCalls,
      5,
      "five distinct lines must cross the HTTP judge boundary",
    );
    await note(
      "three-round match",
      "PASS with synthetic judge; live Jev quality and paid-provider access UNPROVEN: needs explicit spending permission plus dedicated key",
    );
    await click(host, "Play again");
    await visible(host.locator("#write-h"));
    await menu(guest, "Menu");
    assert.equal(
      await guest
        .getByRole("button", { name: "End this game", exact: true })
        .count(),
      0,
    );
    assert.equal(
      await guest
        .getByRole("button", { name: "Close the room", exact: true })
        .count(),
      0,
    );
    await click(guest, "Keep playing");
    await menu(host);
    await click(host, "End this game");
    await visible(host.getByRole("list", { name: "Players", exact: true }));
    await visible(guest.getByRole("list", { name: "Players", exact: true }));
    await menu(guest);
    await click(guest, "Leave the game");
    await visible(
      guest.getByRole("button", { name: "Start a game", exact: true }),
    );
    await host
      .getByRole("list", { name: "Players", exact: true })
      .getByText("Verify Guest")
      .waitFor({ state: "hidden" });
    // Cover invite URL separately; a landing call cannot wait for the home CTA here.
    await guest.goto(`${LOCAL}/?code=${code}`);
    await visible(guest.getByLabel("Your name", { exact: true }));
    assert.equal(
      await guest.getByLabel("Game code", { exact: true }).inputValue(),
      code,
    );
    await guest.getByLabel("Your name", { exact: true }).fill("Verify Guest");
    await click(guest, "Join");
    await visible(guest.getByRole("list", { name: "Players", exact: true }));
    await menu(host);
    await click(host, "Leave the game");
    await visible(
      guest
        .getByRole("button", { name: "Start the game", exact: true })
        .or(guest.getByText("You can start once someone joins.")),
    );
    await menu(guest);
    await visible(
      guest.getByRole("button", { name: "Close the room", exact: true }),
    );
    await click(guest, "Close the room");
    await visible(
      guest.getByRole("button", { name: "Start a game", exact: true }),
    );
    await guest.goto(`${LOCAL}/?code=${code}`);
    await visible(guest.getByLabel("Your name", { exact: true }));
    await guest.getByLabel("Your name", { exact: true }).fill("Verify Guest");
    await click(guest, "Join");
    await visible(
      guest.getByRole("alert").filter({ hasText: "No game with that code" }),
    );
    await shot(guest, "closed-room-rejection");
    await note(
      "room lifecycle",
      "PASS; replay, host-only end, leave, invite rejoin, host transfer, close, closed-code rejection",
    );
    step = "invalid guest continuity recovery";
    const recoveryContext = await browser.newContext({
      viewport: { width: 390, height: 844 },
      reducedMotion: "reduce",
    });
    const recovery = await recoveryContext.newPage();
    await recoveryContext.addCookies([
      {
        name: "double-take-continuity",
        value: "invalid-verification-cookie",
        url: LOCAL,
        httpOnly: true,
        sameSite: "Lax",
      },
    ]);
    await recovery.goto(LOCAL);
    await visible(
      recovery.getByRole("heading", { name: "We couldn’t restore your seat" }),
    );
    await shot(recovery, "invalid-continuity");
    await click(recovery, "Start fresh");
    await visible(
      recovery.getByRole("button", { name: "Start a game", exact: true }),
    );
    await note(
      "invalid guest continuity recovery",
      "PASS; bad cookie displays recovery; Start fresh returns usable home",
    );
    await browser.close();
    browser = undefined;
    // The actual owned backend stops; this is not a mocked health response.
    process.kill(-backend.job.child.pid, "SIGINT");
    await backend.job.done;
    const down = await fetch(`${LOCAL}/api/health`);
    assert.equal(down.status, 503);
    assert.equal((await down.json()).status, "unhealthy");
    await note(
      "backend unavailable",
      "PASS; real owned backend stopped, web health returns 503 unhealthy",
    );
    success = true;
  }
} catch (error) {
  // Browser exceptions can contain request bodies: retain the step, not raw errors.
  await note(
    "FAIL",
    `${step}; ${error.name}; inspect this step locally (raw errors withheld for privacy)`,
  );
  if (/^Port (3210|3220|3221) is already in use\./.test(error.message)) {
    await note("unmet precondition", error.message);
  }
  console.error(
    error.stack
      ?.split("\n")
      .filter((line) => /^\s+at /.test(line))
      .join("\n"),
  );
  process.exitCode = 1;
} finally {
  await browser?.close();
  await processes?.stop();
  if (fixture) await new Promise((resolve) => fixture.close(resolve));
  if (createdLocal) {
    await rm(resolve(ROOT, ".convex"), { recursive: true, force: true });
    await rm(resolve(ROOT, ".env.local"), { force: true });
  }
  await access(resolve(evidence, "actions.json"));
  await note(
    "cleanup",
    "Owned browser/server/fixture stopped; run-created local data and keys removed; evidence retained",
  );
  await writeFile(
    resolve(evidence, "result.json"),
    JSON.stringify(
      {
        status: success ? "PASS" : "FAIL",
        mode,
        fixtureCalls,
        ownerSignIn: "n/a: accountless guest rooms",
        liveJev:
          "UNPROVEN: needs explicit spending permission and dedicated key",
      },
      null,
      2,
    ) + "\n",
  );
}
