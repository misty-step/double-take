type Signal = "maintenance" | "judge_unavailable" | "request_failed";

/** Fixed, value-free backend signals: never accept an exception or player input. */
export async function backendSignal(
  operation: Signal,
  status: "ok" | "error",
  env: Readonly<Record<string, string | undefined>> = process.env,
): Promise<void> {
  if (!env.SENTRY_DSN) return;
  try {
    const dsn = new URL(env.SENTRY_DSN);
    const environment = env.APP_ENVIRONMENT;
    const release = env.APP_RELEASE;
    if (
      !["staging", "production"].includes(environment ?? "") ||
      !/^[a-f0-9]{40}$/.test(release ?? "")
    )
      return;
    const eventId = crypto.randomUUID().replaceAll("-", "");
    const items: unknown[] = [{ event_id: eventId, dsn: env.SENTRY_DSN }];
    if (operation === "maintenance") {
      items.push(
        { type: "check_in" },
        {
          check_in_id: eventId,
          monitor_slug: `doubletake-abandonment-${environment}`,
          status,
          release,
          environment,
          monitor_config: {
            schedule: { type: "interval", value: 1, unit: "minute" },
            checkin_margin: 2,
            max_runtime: 1,
            timezone: "UTC",
          },
        },
      );
    }
    if (status === "error") {
      items.push(
        { type: "event" },
        {
          event_id: eventId,
          timestamp: Date.now() / 1000,
          platform: "javascript",
          level: "error",
          message: `Double Take backend ${operation} failed`,
          environment,
          release,
          tags: { operation, runtime: "backend" },
        },
      );
    }
    if (items.length === 1) return;
    const response = await fetch(
      `${dsn.origin}/api${dsn.pathname}/envelope/?sentry_key=${dsn.username}&sentry_version=7`,
      {
        method: "POST",
        headers: { "Content-Type": "application/x-sentry-envelope" },
        body: items.map((item) => JSON.stringify(item)).join("\n"),
        signal: AbortSignal.timeout(1500),
      },
    );
    if (!response.ok) console.warn("Double Take backend telemetry unavailable");
  } catch {
    // A failed sink cannot turn an accepted game operation into a failure.
    console.warn("Double Take backend telemetry unavailable");
  }
}
