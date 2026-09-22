import {
  parseProductEnvironment,
  type ProductEnvironment,
} from "./product-events";

export type RuntimeAttribution = {
  environment: ProductEnvironment;
  release: string;
};

type RuntimeEnvironment = Record<string, string | undefined>;

export function resolveRuntimeAttribution(
  env: RuntimeEnvironment,
): RuntimeAttribution {
  const environment = parseProductEnvironment(env.APP_ENVIRONMENT);
  const release = env.APP_RELEASE?.trim();
  if (!release) throw new Error("APP_RELEASE is required");
  const localRelease =
    environment === "test" &&
    env.DOUBLETAKE_LOCAL === "true" &&
    release === "local";
  if (!localRelease && !/^[0-9a-f]{40}$/i.test(release)) {
    throw new Error(
      "APP_RELEASE must be the full 40-character candidate commit SHA",
    );
  }
  return { environment, release };
}
