import { TokenVerifier } from "@parlor/cloudflare";

export type OperatorEnv = {
  readonly DOUBLETAKE_ACCESS_ISSUER?: string;
  readonly DOUBLETAKE_ACCESS_AUD?: string;
  /** Exact verified subjects; never infer authority from a supplied header. */
  readonly DOUBLETAKE_OPERATOR_SUBJECTS?: string;
  /** Exact signed service-token Client IDs, scoped to this application/role. */
  readonly DOUBLETAKE_OPERATOR_MACHINES?: string;
};

const verifiers = new Map<string, TokenVerifier>();

/** Also enforced at the origin, so workers.dev cannot bypass Access. */
export async function authorizeOperator(
  request: Request,
  env: OperatorEnv,
): Promise<boolean> {
  const issuer = env.DOUBLETAKE_ACCESS_ISSUER;
  const audience = env.DOUBLETAKE_ACCESS_AUD;
  const subjects =
    env.DOUBLETAKE_OPERATOR_SUBJECTS?.split(",").filter(Boolean) ?? [];
  const machines =
    env.DOUBLETAKE_OPERATOR_MACHINES?.split(",").filter(Boolean) ?? [];
  const token = request.headers.get("Cf-Access-Jwt-Assertion");
  if (
    !issuer ||
    !audience ||
    !token ||
    (subjects.length === 0 && machines.length === 0) ||
    token.length > 16_384
  )
    return false;
  try {
    const key = `${issuer}|${audience}`;
    let verifier = verifiers.get(key);
    if (!verifier) {
      verifier = new TokenVerifier(
        {
          providers: [
            {
              type: "customJwt",
              issuer,
              jwks: `${issuer}/cdn-cgi/access/certs`,
              applicationID: audience,
              algorithm: "RS256",
            },
          ],
        },
        (input, init) =>
          fetch(input, { ...init, signal: AbortSignal.timeout(3000) }),
      );
      // Only deployment configuration creates a verifier; untrusted claims cannot.
      verifiers.set(key, verifier);
    }
    const { identity } = await verifier.verify(token);
    // Access org-session tokens are not application assertions. Custom claims
    // below come only from the signature-verified payload, never identity headers.
    if (identity.type !== "app" || identity.issuer !== issuer) return false;
    if (identity.subject === "") {
      return (
        typeof identity.common_name === "string" &&
        machines.includes(identity.common_name)
      );
    }
    return (
      identity.common_name === undefined && subjects.includes(identity.subject)
    );
  } catch {
    return false;
  }
}
