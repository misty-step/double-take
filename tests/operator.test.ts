import { generateKeyPairSync, sign } from "node:crypto";
import { afterEach, describe, expect, it, vi } from "vitest";
import { authorizeOperator } from "../cloudflare/operator";

const pair = generateKeyPairSync("rsa", { modulusLength: 2048 });
const jwk = {
  ...pair.publicKey.export({ format: "jwk" }),
  kid: "synthetic-rsa-key",
  alg: "RS256",
  use: "sig",
};
const issuer = "https://synthetic-access.example.test";
const env = {
  DOUBLETAKE_ACCESS_ISSUER: issuer,
  DOUBLETAKE_ACCESS_AUD: "synthetic-app-audience",
  DOUBLETAKE_OPERATOR_SUBJECTS: "approved-operator",
};
function request(claims: Record<string, unknown> = {}, corrupt = false) {
  const header = Buffer.from(
    JSON.stringify({ alg: "RS256", kid: jwk.kid, typ: "JWT" }),
  ).toString("base64url");
  const body = Buffer.from(
    JSON.stringify({
      iss: issuer,
      aud: [env.DOUBLETAKE_ACCESS_AUD],
      sub: "approved-operator",
      exp: Date.now() / 1000 + 60,
      ...claims,
    }),
  ).toString("base64url");
  const text = `${header}.${body}`;
  const signature = sign(
    "RSA-SHA256",
    Buffer.from(text),
    pair.privateKey,
  ).toString("base64url");
  return new Request("https://doubletake.example.test/backend/admin/status", {
    headers: {
      "Cf-Access-Jwt-Assertion": `${text}.${corrupt ? "invalid" : signature}`,
    },
  });
}
afterEach(() => vi.unstubAllGlobals());
describe("operator origin authorization", () => {
  it("checks signed issuer/audience/expiry and exact subject, denying empty-sub service assertions under the current ruling", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => Response.json({ keys: [jwk] })),
    );
    expect(
      await authorizeOperator(
        new Request("https://origin.test/backend/admin/status"),
        env,
      ),
    ).toBe(false);
    expect(await authorizeOperator(request(), env)).toBe(true);
    for (const claims of [
      { sub: "unknown" },
      { sub: "", common_name: "named-service.access" },
      { sub: "" },
      { aud: ["foreign-app"] },
      { iss: "https://foreign-issuer.test" },
      { exp: 0 },
    ]) {
      expect(await authorizeOperator(request(claims), env)).toBe(false);
    }
    expect(await authorizeOperator(request({}, true), env)).toBe(false);
    expect(
      await authorizeOperator(request(), {
        ...env,
        DOUBLETAKE_OPERATOR_SUBJECTS: "",
      }),
    ).toBe(false);
  });
});
