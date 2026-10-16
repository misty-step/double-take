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
  DOUBLETAKE_OPERATOR_MACHINES: "preview-verifier.access",
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
      type: "app",
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
  it("checks signed application identity and keeps preview machine roles out of production", async () => {
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
    const machine = request({
      sub: "",
      common_name: "preview-verifier.access",
    });
    expect(await authorizeOperator(machine, env)).toBe(true);
    expect(
      await authorizeOperator(machine, {
        ...env,
        DOUBLETAKE_ACCESS_AUD: "production-app-audience",
      }),
    ).toBe(false);
    expect(
      await authorizeOperator(machine, {
        ...env,
        DOUBLETAKE_OPERATOR_MACHINES: "production-operator.access",
      }),
    ).toBe(false);
    for (const claims of [
      { sub: "unknown" },
      { sub: "", common_name: "named-service.access" },
      { sub: "" },
      { sub: null, common_name: "preview-verifier.access" },
      { common_name: "preview-verifier.access" },
      { type: "org" },
      { type: null },
      { aud: ["foreign-app"] },
      { iss: "https://foreign-issuer.test" },
      { exp: 0 },
      { nbf: Date.now() / 1000 + 300 },
    ]) {
      expect(await authorizeOperator(request(claims), env)).toBe(false);
    }
    expect(await authorizeOperator(request({}, true), env)).toBe(false);
    expect(
      await authorizeOperator(request(), {
        ...env,
        DOUBLETAKE_OPERATOR_SUBJECTS: "",
        DOUBLETAKE_OPERATOR_MACHINES: "",
      }),
    ).toBe(false);
  });
});
