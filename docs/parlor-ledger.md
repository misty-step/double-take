# Parlor issue ledger — Double Take

Platform owner for these findings: card t_b2f5248d (river). This ledger lists what
Double Take exercised against Parlor, and every platform defect found, with a
reproducible case. Values and pins are exact.

## Pin

- `misty-step/parlor` @ `df1a0be174c3f131d4ff15df1e3d27d487e34313`, vendored under
  `vendor/parlor` (paths: `packages`, `integrations`, `tsconfig.base.json`, `LICENSE`;
  modifications: none). See `vendor/parlor/UPSTREAM.json`.

## Exercised surface (candidate, 2026-09-20)

- `@parlor/convex/schema` — `parlorTables` merged into the game schema.
- `@parlor/convex` — `resolvePlayer`, `beginMatch`, `completeMatch`,
  `requireActiveMatch`, `sweepAbandonedMatches`.
- `@parlor/convex/rooms` — `createRoom`, `joinRoom`, `getRoomState`, `heartbeat`,
  `leaveRoom`, `closeRoom` (re-exported in `convex/rooms.ts`).
- `@parlor/react` — `useHeartbeat`, `useGuestCredential`.
- `@parlor/auth/server` — `issueGuestToken` (web server route `app/api/guest`).
- `@parlor/web` — `GuestCredentialIssuer` type.

Journeys run with two independent browser clients on room `5E4V`: create, join by
code, host start, synchronized round, two submissions, judging, two-stage reveal.
Guest continuity cookie used for seat identity. Real server-side Jev judgments.

## Findings

### P-1 (observation, not a defect): build ordering for vendored workspace packages

`next dev` fails to resolve `@parlor/*` imports until the vendored packages are
built. Repro: fresh checkout, `pnpm install`, then `pnpm dev:web` without
`pnpm build:parlor` — Next.js cannot resolve the package entry points. Workaround
in repo: `pnpm dev` (the harness) and `pnpm check` run `build:parlor` first.
Not filed as a platform defect: the documented consumption path builds first.

### P-2 (documentation gap): skill import not present in the vendored copy

`vendor/parlor/UPSTREAM.json` initially claimed the skill guidance was imported
under `.agents/skills/parlor`; the directory does not exist because `skills/` is
not part of the vendored paths. Corrected in the pin metadata: the skill stays
upstream at `skills/parlor/SKILL.md` on the pinned commit. Platform owner may
decide whether consumers should vendor `skills/`.

### Defects found

None. No reproducible platform defect was observed in the exercised surface during
this build. Deeper compatibility testing (Linejam/Poppycock regression, presence,
host transfer under disconnect) belongs to the platform card t_b2f5248d.

## Deferred to platform card

- Host transfer under disconnect (not exercised here; room host transfer was not
  part of the MVP journey).
- Reconnect mid-round with continuity cookie (partially exercised: reload keeps the
  seat; full mid-round replay belongs to the platform matrix).
