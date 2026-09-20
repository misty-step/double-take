import { describe, expect, it } from "vitest";
import { issueGuestSession } from "../lib/session";

/** 32-byte secrets encoded canonically, so the strict round-trip check accepts them. */
const PARLOR_KEY = Buffer.alloc(32, 0x01).toString("base64url");
const CONTINUITY_SECRET = Buffer.alloc(32, 0x02).toString("base64url");

function env(nodeEnv: string) {
  return {
    PARLOR_GUEST_TOKEN_AUDIENCE: "doubletake",
    PARLOR_GUEST_TOKEN_KEYS: JSON.stringify({ signing: PARLOR_KEY }),
    DOUBLETAKE_CONTINUITY_SECRET: CONTINUITY_SECRET,
    NODE_ENV: nodeEnv,
  };
}

function guestRequest(body: unknown, headers: Record<string, string> = {}, e = env("production")) {
  return issueGuestSession(
    new Request("http://localhost:3210/api/guest", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        origin: "http://localhost:3210",
        ...headers,
      },
      body: JSON.stringify(body),
    }),
    e,
  );
}

function cookieFrom(response: Response, name: string): string {
  const cookies = response.headers.getSetCookie();
  const cookie = cookies.find((value) => value.startsWith(`${name}=`));
  expect(cookie, `expected a Set-Cookie for ${name}`).toBeDefined();
  return cookie!;
}

function guestIdOf(cookie: string): string {
  const value = cookie.split("=")[1]!.split(";")[0]!;
  const payload = value.split(".")[0]!;
  const claims = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as {
    guestId: string;
  };
  return claims.guestId;
}

function tamper(cookie: string): string {
  const [header, value] = cookie.split(";")[0]!.split("=");
  const [payload, signature] = value!.split(".");
  const flipped = signature!.startsWith("A") ? signature!.replace(/^A/, "B") : `A${signature!.slice(1)}`;
  return `${header}=${payload}.${flipped}`;
}

describe("guest session continuity", () => {
  it("issues a fresh guest with the production-mode cookie name", async () => {
    const response = await guestRequest({ mode: "acquire" });
    expect(response.status).toBe(200);
    const body = (await response.json()) as { token: unknown; expiresAt: unknown };
    expect(typeof body.token).toBe("string");
    expect(typeof body.expiresAt).toBe("number");
    const cookie = cookieFrom(response, "__Host-double-take-continuity");
    expect(cookie).toContain("Secure");
    expect(cookie).toContain("HttpOnly");
  });

  it("restores the same guest identity from a valid cookie (refresh and acquire)", async () => {
    const first = await guestRequest({ mode: "acquire" });
    const cookie = cookieFrom(first, "__Host-double-take-continuity").split(";")[0]!;
    const guestId = guestIdOf(cookie);

    const refreshed = await guestRequest(
      { mode: "refresh", token: "advisory" },
      { cookie },
    );
    expect(refreshed.status).toBe(200);
    expect(guestIdOf(cookieFrom(refreshed, "__Host-double-take-continuity"))).toBe(guestId);

    // A valid cookie wins over a fresh identity: the same guest is kept.
    const reentered = await guestRequest({ mode: "acquire" }, { cookie });
    expect(reentered.status).toBe(200);
    expect(guestIdOf(cookieFrom(reentered, "__Host-double-take-continuity"))).toBe(guestId);
  });

  it("rejects refresh when the cookie is missing", async () => {
    const response = await guestRequest({ mode: "refresh", token: "advisory" });
    expect(response.status).toBe(401);
    expect(((await response.json()) as { code: string }).code).toBe("GUEST_CONTINUITY_REQUIRED");
  });

  it("rejects acquire when the cookie fails verification (no silent identity fork)", async () => {
    const first = await guestRequest({ mode: "acquire" });
    const cookie = cookieFrom(first, "__Host-double-take-continuity").split(";")[0]!;
    const response = await guestRequest({ mode: "acquire" }, { cookie: tamper(cookie) });
    expect(response.status).toBe(401);
    expect(((await response.json()) as { code: string }).code).toBe("GUEST_CONTINUITY_INVALID");
  });

  it("reset starts a NEW identity and expires the other build mode's cookie", async () => {
    const first = await guestRequest({ mode: "acquire" });
    const oldCookie = cookieFrom(first, "__Host-double-take-continuity").split(";")[0]!;
    const oldGuestId = guestIdOf(oldCookie);

    const reset = await guestRequest({ mode: "reset" }, { cookie: tamper(oldCookie) });
    expect(reset.status).toBe(200);
    const fresh = cookieFrom(reset, "__Host-double-take-continuity");
    expect(fresh).not.toContain("Max-Age=0");
    expect(guestIdOf(fresh)).not.toBe(oldGuestId);
    // The dev-mode cookie name is expired so a stranded guest cannot loop.
    const cleared = cookieFrom(reset, "double-take-continuity");
    expect(cleared).toContain("Max-Age=0");
  });

  it("reset works with no cookie at all and rejects a token", async () => {
    const reset = await guestRequest({ mode: "reset" });
    expect(reset.status).toBe(200);
    const refused = await guestRequest({ mode: "reset", token: "advisory" });
    expect(refused.status).toBe(400);
    expect(((await refused.json()) as { code: string }).code).toBe("INVALID_GUEST_REQUEST");
  });

  it("keeps the same-origin boundary on every mode", async () => {
    for (const mode of ["acquire", "refresh", "reset"] as const) {
      const response = await issueGuestSession(
        new Request("http://localhost:3210/api/guest", {
          method: "POST",
          headers: { "content-type": "application/json", origin: "https://evil.example" },
          body: JSON.stringify(mode === "refresh" ? { mode, token: "advisory" } : { mode }),
        }),
        env("production"),
      );
      expect(response.status, mode).toBe(403);
      expect(((await response.json()) as { code: string }).code).toBe("SAME_ORIGIN_REQUIRED");
    }
  });

  it("uses the local cookie name in development and reset expires the production name", async () => {
    const first = await guestRequest({ mode: "acquire" }, {}, env("development"));
    const cookie = cookieFrom(first, "double-take-continuity");
    expect(cookie).not.toContain("Secure");
    const reset = await guestRequest({ mode: "reset" }, {}, env("development"));
    expect(cookieFrom(reset, "__Host-double-take-continuity")).toContain("Max-Age=0");
  });

  it("fails closed when the continuity secret is missing", async () => {
    const response = await issueGuestSession(
      new Request("http://localhost:3210/api/guest", {
        method: "POST",
        headers: { "content-type": "application/json", origin: "http://localhost:3210" },
        body: JSON.stringify({ mode: "acquire" }),
      }),
      { ...env("production"), DOUBLETAKE_CONTINUITY_SECRET: undefined },
    );
    expect(response.status).toBe(503);
    expect(((await response.json()) as { code: string }).code).toBe("GUEST_ISSUER_UNCONFIGURED");
  });
});
