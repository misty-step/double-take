import { TokenVerifier } from "@parlor/cloudflare";

export type OperatorEnv = {
  readonly DOUBLETAKE_ACCESS_ISSUER?: string;
  readonly DOUBLETAKE_ACCESS_AUD?: string;
  /** Exact verified subjects; never infer authority from a supplied header. */
  readonly DOUBLETAKE_OPERATOR_SUBJECTS?: string;
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
  const token = request.headers.get("Cf-Access-Jwt-Assertion");
  if (
    !issuer ||
    !audience ||
    !token ||
    subjects.length === 0 ||
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
    return identity.subject.length > 0 && subjects.includes(identity.subject);
  } catch {
    return false;
  }
}
