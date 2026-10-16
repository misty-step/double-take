import { afterEach, describe, expect, it, vi } from "vitest";
import { backendSignal } from "../lib/backend-telemetry";

afterEach(() => vi.unstubAllGlobals());
const env = {
  SENTRY_DSN: "https://public@example.ingest.sentry.io/123",
  APP_ENVIRONMENT: "staging",
  APP_RELEASE: "0123456789abcdef0123456789abcdef01234567",
  PRIVATE_CANARY: "private-player-content-never-send",
};
describe("backend telemetry", () => {
  it("sends only fixed error and actual cron outcome, with exact source/environment", async () => {
    const calls: string[] = [];
    vi.stubGlobal(
      "fetch",
      vi.fn(async (_input: RequestInfo | URL, init?: RequestInit) => {
        calls.push(String(init?.body));
        return new Response(null, { status: 200 });
      }),
    );
    await backendSignal("maintenance", "ok", env);
    await backendSignal("judge_unavailable", "error", env);
    expect(calls[0]).toContain('"type":"check_in"');
    expect(calls[0]).toContain('"status":"ok"');
    expect(calls[1]).toContain('"operation":"judge_unavailable"');
    for (const text of calls) {
      expect(text).toContain(env.APP_RELEASE);
      expect(text).toContain('"environment":"staging"');
      expect(text).not.toContain(env.PRIVATE_CANARY);
    }
  });
  it("contains unavailable and hung sinks and refuses unattributed delivery", async () => {
    const sink = vi.fn(
      async (_input: RequestInfo | URL, _init?: RequestInit) => {
        throw new Error("sink offline");
      },
    );
    vi.stubGlobal("fetch", sink);
    await expect(
      backendSignal("maintenance", "error", env),
    ).resolves.toBeUndefined();
    expect(sink.mock.calls[0]?.[1]?.signal).toBeDefined();
    await backendSignal("maintenance", "error", {
      ...env,
      APP_RELEASE: "missing",
    });
    expect(sink).toHaveBeenCalledTimes(1);
  });
});
