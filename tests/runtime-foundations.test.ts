import { readFile } from "node:fs/promises";
import { describe, expect, it, vi } from "vitest";
import { createHealthHandler } from "../app/api/health/handler";
import { redactSentryEvent } from "../lib/sentry-privacy";
import { resolveSentryOptions } from "../lib/sentry-runtime";
import { resolveRuntimeAttribution } from "../lib/runtime-config";

const localEnv = {
  APP_ENVIRONMENT: "test",
  APP_RELEASE: "local",
  DOUBLETAKE_LOCAL: "true",
  NEXT_PUBLIC_CONVEX_SITE_URL: "http://127.0.0.1:3221",
};

describe("runtime attribution", () => {
  it("requires an explicit environment and full release outside local tests", () => {
    expect(resolveRuntimeAttribution(localEnv)).toEqual({
      environment: "test",
      release: "local",
    });
    expect(() =>
      resolveRuntimeAttribution({ APP_ENVIRONMENT: "production" }),
    ).toThrow(/APP_RELEASE/);
    expect(() =>
      resolveRuntimeAttribution({
        APP_ENVIRONMENT: "production",
        APP_RELEASE: "short",
      }),
    ).toThrow(/40-character/);
    expect(
      resolveRuntimeAttribution({
        APP_ENVIRONMENT: "production",
        APP_RELEASE: "0123456789abcdef0123456789abcdef01234567",
      }),
    ).toEqual({
      environment: "production",
      release: "0123456789abcdef0123456789abcdef01234567",
    });
  });
});

describe("served health handler", () => {
  it("returns attributed health only after the backend contract passes", async () => {
    const fetchMock = vi.fn(async () =>
      Response.json({ status: "ok", service: "double-take-backend" }),
    );
    const response = await createHealthHandler({
      fetch: fetchMock as typeof fetch,
      now: () => new Date("2026-09-21T12:00:00.000Z"),
      env: localEnv,
    })();
    expect(response.status).toBe(200);
    expect(response.headers.get("cache-control")).toBe("no-store");
    expect(await response.json()).toEqual({
      status: "ok",
      service: "double-take",
      environment: "test",
      release: "local",
      checkedAt: "2026-09-21T12:00:00.000Z",
      dependencies: { backend: "ok" },
    });
    expect(fetchMock).toHaveBeenCalledWith(
      new URL("http://127.0.0.1:3221/health"),
      expect.objectContaining({ cache: "no-store" }),
    );
  });

  it("fails closed without reflecting backend details", async () => {
    const response = await createHealthHandler({
      fetch: vi.fn(async () =>
        Response.json({ status: "ok", service: "wrong" }),
      ) as typeof fetch,
      now: () => new Date("2026-09-21T12:00:00.000Z"),
      env: localEnv,
    })();
    expect(response.status).toBe(503);
    expect(JSON.stringify(await response.json())).not.toMatch(
      /wrong|dsn|token|rubric|confidence/i,
    );
  });
});

describe("Sentry privacy and operations registration", () => {
  it("redacts player and request identity while preserving trace mechanics", () => {
    const redacted = redactSentryEvent({
      user: { email: "player@example.test", ip_address: "127.0.0.1" },
      request: {
        method: "POST",
        url: "https://doubletake.mistystep.io/play?code=SECRET",
        headers: { cookie: "secret" },
        data: { sentence: "private line" },
      },
      breadcrumbs: [{ message: "private line" }],
      extra: { token: "secret" },
      contexts: { trace: { trace_id: "abc" }, device: { name: "phone" } },
      tags: { runtime: "browser", playerName: "Ada" },
    });
    expect(redacted).toMatchObject({
      user: undefined,
      request: { method: "POST", url: "https://doubletake.mistystep.io/play" },
      breadcrumbs: undefined,
      extra: undefined,
      contexts: { trace: { trace_id: "abc" } },
      tags: { runtime: "browser" },
    });
    expect(JSON.stringify(redacted)).not.toMatch(
      /player@example|SECRET|private line|phone|Ada/,
    );
  });

  it("enables attributed traces only with a valid DSN and exact runtime attribution", () => {
    const options = resolveSentryOptions(
      {
        APP_ENVIRONMENT: "production",
        APP_RELEASE: "0123456789abcdef0123456789abcdef01234567",
        SENTRY_DSN: "https://public@example.ingest.sentry.io/123",
      },
      "server",
    );
    expect(options).toMatchObject({
      enabled: true,
      environment: "production",
      release: "0123456789abcdef0123456789abcdef01234567",
      sendDefaultPii: false,
      tracesSampleRate: 0.05,
    });
  });

  it("registers the approved project slug without claiming shared triage activation", async () => {
    const config = JSON.parse(
      await readFile(
        new URL("../config/game-operations.json", import.meta.url),
        "utf8",
      ),
    );
    expect(config.approvedOpsRef).toContain(
      "8f94da2c553ba20160aac538478e187adfaac8f6",
    );
    expect(config.sentry).toMatchObject({
      projectSlug: "double-take",
      sendDefaultPii: false,
      triage: { route: "sentry-games", status: "prepared-not-activated" },
    });
    expect(config.productEvents).toMatchObject({
      store: "convex",
      contentPolicy: "no-player-text",
    });
  });
});
