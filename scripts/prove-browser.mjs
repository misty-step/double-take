// Consumes an already-running isolated Worker. Never routes a cloud backend to a fixture.
import assert from "node:assert/strict";
import { mkdirSync, writeFileSync } from "node:fs";
// Optional proof tool, installed in the isolated proof workspace, not the app.
const { chromium } = await import(
  process.env.DOUBLETAKE_PLAYWRIGHT_MODULE ?? "playwright"
);

export async function proveBrowser(origin, output, options = {}) {
  mkdirSync(output, { recursive: true });
  const browser = await chromium.launch({ headless: true });
  const requests = [];
  const errors = [];
  const pages = [];
  const contexts = [];
  const evidence = {
    mode: options.mode ?? "real-loopback-workerd-synthetic-judge",
    checkpoints: [],
    requests,
    errors,
  };
  try {
    for (const [name, viewport, colorScheme] of [
      ["desktop", { width: 1440, height: 1000 }, "light"],
      ["mobile", { width: 390, height: 844 }, "dark"],
    ]) {
      const context = await browser.newContext({
        viewport,
        colorScheme,
        reducedMotion: "reduce",
        extraHTTPHeaders: options.extraHTTPHeaders,
      });
      // A protected preview's service credential must never reach another host.
      if (options.extraHTTPHeaders) {
        await context.route("**/*", (route) =>
          new URL(route.request().url()).origin === origin
            ? route.continue()
            : route.abort(),
        );
      }
      contexts.push(context);
      const page = await context.newPage();
      pages.push(page);
      page.on("pageerror", (error) =>
        errors.push({ name, message: error.message }),
      );
      page.on("request", (request) =>
        requests.push({
          name,
          origin: new URL(request.url()).origin,
          pathname: new URL(request.url()).pathname,
        }),
      );
      await page.goto(origin, { waitUntil: "networkidle" });
      await page
        .getByRole("button", { name: "Start a game", exact: true })
        .waitFor();
      await page.screenshot({
        path: `${output}/${name}-home.png`,
        fullPage: true,
      });
      evidence.checkpoints.push(`${name}-${colorScheme}-home`);
    }
    const [host, friend] = pages;
    await host
      .getByRole("button", { name: "Start a game", exact: true })
      .click();
    await host.getByLabel("Your name", { exact: true }).fill("Synthetic Host");
    await host
      .getByRole("button", { name: "Start a game", exact: true })
      .click();
    await host.locator(".code").waitFor();
    const code = (await host.locator(".code").innerText()).trim();
    assert.match(code, /^[A-Z2-9]{4}$/);
    await friend
      .getByRole("button", { name: "Join a game", exact: true })
      .click();
    await friend.getByLabel("Game code", { exact: true }).fill(code);
    await friend
      .getByLabel("Your name", { exact: true })
      .fill("Synthetic Friend");
    await friend.getByRole("button", { name: "Join", exact: true }).click();
    await host
      .getByRole("button", { name: "Start the game", exact: true })
      .waitFor();
    await host.screenshot({
      path: `${output}/desktop-lobby.png`,
      fullPage: true,
    });
    await friend.screenshot({
      path: `${output}/mobile-lobby.png`,
      fullPage: true,
    });
    await friend.reload({ waitUntil: "networkidle" });
    await friend.getByRole("list", { name: "Players", exact: true }).waitFor();
    assert.equal(
      await friend
        .getByRole("list", { name: "Players", exact: true })
        .locator("li:not(.joining)")
        .count(),
      2,
    );
    evidence.checkpoints.push("two-real-browser-guests-lobby-reload-same-seat");
    await host
      .getByRole("button", { name: "Start the game", exact: true })
      .click();
    for (let round = 1; round <= 3; round++) {
      for (const page of pages)
        await page.getByPlaceholder("Write one line for both.").waitFor();
      await host.screenshot({
        path: `${output}/desktop-writing-${round}.png`,
        fullPage: true,
      });
      await friend.screenshot({
        path: `${output}/mobile-writing-${round}.png`,
        fullPage: true,
      });
      await host
        .getByPlaceholder("Write one line for both.")
        .fill("We should begin this together.");
      await host
        .getByRole("button", { name: "Lock it in", exact: true })
        .click();
      // The friend's live DOM must not reveal the other accepted private line.
      assert.equal(
        await friend
          .getByText("We should begin this together.", { exact: true })
          .count(),
        0,
      );
      await friend
        .getByPlaceholder("Write one line for both.")
        .fill("I have waited for this moment.");
      await friend
        .getByRole("button", { name: "Lock it in", exact: true })
        .click();
      const advance = host.getByRole("button", {
        name: round === 3 ? "See who won" : "Next round",
        exact: true,
      });
      await advance.waitFor({ timeout: 90_000 });
      await host.screenshot({
        path: `${output}/desktop-reveal-${round}.png`,
        fullPage: true,
      });
      await friend.screenshot({
        path: `${output}/mobile-reveal-${round}.png`,
        fullPage: true,
      });
      assert.equal(
        await host
          .getByRole("list", { name: "Every line this round", exact: true })
          .locator("li")
          .count(),
        2,
      );
      await advance.click();
      evidence.checkpoints.push(
        `round-${round}-private-writing-live-reveal-advance`,
      );
    }
    await host.getByText("Final scores", { exact: true }).waitFor();
    await friend.getByText("Final scores", { exact: true }).waitFor();
    for (const [index, name] of ["desktop", "mobile"].entries()) {
      await pages[index].screenshot({
        path: `${output}/${name}-final.png`,
        fullPage: true,
      });
      assert.ok(
        await pages[index].evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
        `${name} final overflow`,
      );
    }
    evidence.checkpoints.push("three-round-final-both-browsers-no-overflow");
    assert.deepEqual(errors, []);
    assert.ok(requests.length > 0);
    assert.deepEqual(
      requests.filter((request) =>
        /convex\.(?:cloud|site)/.test(request.origin),
      ),
      [],
    );
    evidence.noConvexRequests = true;
    return evidence;
  } finally {
    writeFileSync(
      `${output}/browser-proof.json`,
      JSON.stringify(evidence, null, 2),
    );
    for (const context of contexts) await context.close();
    await browser.close();
  }
}
