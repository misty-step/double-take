export type BackendHealth = {
  status: "ok";
  service: "double-take-backend";
};

type HealthInput = {
  backend: BackendHealth;
  environment: string;
  release: string;
  checkedAt: string;
};

export function parseBackendHealth(value: unknown): BackendHealth {
  if (
    value === null ||
    typeof value !== "object" ||
    (value as { status?: unknown }).status !== "ok" ||
    (value as { service?: unknown }).service !== "double-take-backend"
  ) {
    throw new Error("Backend health response did not match the Double Take contract");
  }
  return { status: "ok", service: "double-take-backend" };
}

export function buildHealthPayload({ backend, environment, release, checkedAt }: HealthInput) {
  if (!environment || !release || !Number.isFinite(Date.parse(checkedAt))) {
    throw new Error("Health attribution requires environment, release, and checkedAt");
  }
  return {
    status: "ok" as const,
    service: "double-take" as const,
    environment,
    release,
    checkedAt,
    dependencies: { backend: backend.status },
  };
}
