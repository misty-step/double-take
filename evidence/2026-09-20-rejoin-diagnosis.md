# Same-cookie rejoin failure — diagnosis (2026-09-20, run 1052)

Head under test: 9654bae (river/mvp). Candidate: `next start` (production build) on
doubletake-qa-2f3bbf3d.exe.xyz:3210, reached via local ssh tunnels (3210/3211). The
tunnels and VM HTTP were both 200 throughout. Two persisted independent browser
clients (agent-browser sessions dtA = host "River", dtB = joiner "Ada") held the
same-cookie state from the earlier `next dev` era (room EPR8).

## Reproduction (live, deterministic)

- dtA network log, last request after page load:
  `POST http://localhost:3210/api/guest (Fetch) 401` — followed by no further
  app activity. Console: no exceptions, no page errors. DOM:
  "Setting the table…" with ZERO interactive elements (permanent dead end).
- In-page replay (credentials included, no token material printed):
  `401 GUEST_CONTINUITY_REQUIRED` — "The guest identity cookie is missing..."
- dtA cookie jar contains ONLY `double-take-continuity` (dev-era name,
  value redacted). localStorage holds `double-take:credential` (dev-era
  access token). Same for dtB.
- Fresh cookie-less curl POST /api/guest → 403 SAME_ORIGIN_REQUIRED (Origin
  check works; not the failure under test).

## Root cause chain (code-cited)

1. Cookie name differs by build mode: `lib/session.ts:96-103` —
   `secure = NODE_ENV === "production"`; name `__Host-double-take-continuity`
   in production, `double-take-continuity` otherwise. A seat created while
   `next dev` served the origin stores the dev-named cookie; after the same
   origin switches to a production build, the browser sends a cookie the
   server never reads.
2. `@parlor/react` useGuestCredential persists the access token
   (`double-take:credential`) and sends `mode:"refresh"` on load; with no
   readable continuity cookie the server answers 401 GUEST_CONTINUITY_REQUIRED
   (`lib/session.ts:266-273`).
3. The UI has no failure path: `components/double-take.tsx:807-818` renders
   the loading card "Setting the table…" whenever `guest.credential` is null,
   including when `guest.error` is set. No error surface, no retry, and the
   HttpOnly cookie cannot be cleared from JS — the guest is stranded.

## Classification

- NOT a browser crash, NOT browser-context loss, NOT transient: tabs alive,
  console clean, deterministic server 401 with a stable code.
- Product defect: unrecoverable dead-end UI on guest-credential failure.
- Environment trigger: dev/prod cookie-name split on one origin (the QA
  topology; a https production origin that only ever serves prod builds would
  not split the name, but any guest stranded this way still needs the
  recovery path).

## Fix plan (minimal)

1. Server: add `mode:"reset"` to POST /api/guest — clears the caller's own
   continuity cookie (Max-Age=0) and issues a fresh guest identity; works even
   when the existing cookie is invalid.
2. Client: when `guest.error` is set and no credential exists, render the
   error with a "Start as a new guest" action that calls the reset path.
3. Regression tests for the reset path and the invalid-cookie 401; then
   re-run the reconnect journey on the production build.
