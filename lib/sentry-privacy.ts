type EventLike = {
  breadcrumbs?: unknown;
  contexts?: Record<string, unknown>;
  extra?: unknown;
  request?: {
    cookies?: unknown;
    data?: unknown;
    env?: unknown;
    headers?: unknown;
    method?: string;
    query_string?: unknown;
    url?: string;
    [key: string]: unknown;
  };
  tags?: Record<string, unknown>;
  user?: unknown;
  [key: string]: unknown;
};

function pathOnly(raw: string | undefined): string | undefined {
  if (!raw) return undefined;
  try {
    const url = new URL(raw, "https://doubletake.invalid");
    return url.origin === "https://doubletake.invalid"
      ? url.pathname
      : `${url.origin}${url.pathname}`;
  } catch {
    return undefined;
  }
}

/** Keep error mechanics while removing player/session/browser identity. */
export function redactSentryEvent<T extends EventLike>(event: T): T {
  const trace = event.contexts?.trace;
  const request = event.request
    ? {
        method: event.request.method,
        url: pathOnly(event.request.url),
      }
    : undefined;
  const tags = Object.fromEntries(
    Object.entries(event.tags ?? {}).filter(([key]) =>
      ["environment", "release", "runtime", "service"].includes(key),
    ),
  );
  return {
    ...event,
    breadcrumbs: undefined,
    contexts: trace === undefined ? undefined : { trace },
    extra: undefined,
    request,
    tags: Object.keys(tags).length === 0 ? undefined : tags,
    user: undefined,
  };
}
