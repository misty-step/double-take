import { describe, expect, it } from "vitest";
import { buildHealthPayload, parseBackendHealth } from "../lib/health";

describe("health boundary", () => {
  it("accepts only the backend health contract", () => {
    expect(
      parseBackendHealth({ status: "ok", service: "double-take-backend" }),
    ).toEqual({ status: "ok", service: "double-take-backend" });
    expect(() => parseBackendHealth({ status: "ok", service: "other" })).toThrow(
      /backend health/i,
    );
    expect(() => parseBackendHealth("ok")).toThrow(/backend health/i);
  });

  it("builds a public response without secrets or scoring diagnostics", () => {
    const payload = buildHealthPayload({
      backend: { status: "ok", service: "double-take-backend" },
      environment: "staging",
      release: "0123456789abcdef0123456789abcdef01234567",
      checkedAt: "2026-09-21T12:00:00.000Z",
    });
    expect(payload).toEqual({
      status: "ok",
      service: "double-take",
      environment: "staging",
      release: "0123456789abcdef0123456789abcdef01234567",
      checkedAt: "2026-09-21T12:00:00.000Z",
      dependencies: { backend: "ok" },
    });
    expect(JSON.stringify(payload)).not.toMatch(/token|dsn|rubric|confidence/i);
  });
});
