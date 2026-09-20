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

## Round 3 journey (2026-09-20, production build on doubletake-qa VM)

Exercised against the production build on the ephemeral QA VM with two
persisted independent browser clients (fresh prod-issued guest cookies):

- Same-cookie mid-round reconnect: reload during an open round restores the
  seat through the valid continuity cookie; the submitted line and its
  revision state survive (room YYWP, round 1). The app itself does not
  persist the table code across reloads, so the player re-enters the code —
  game-side UX, not a platform defect.
- Replay: rounds 1→2→3 complete, each with a real Jev adjudication.
- Host transfer: after the host stopped heartbeating (view exit), the
  platform's deterministic heartbeat self-healing migrated the host to the
  remaining player within the 60 s stale window (rooms.ts heartbeat) —
  game-integration evidence for the acceptance, no platform defect.
- Explicit lost-cookie recovery (separate from reconnection): a dev/prod
  cookie-name split stranded both clients; the game now surfaces the error
  with a "Start as a new guest" card backed by `POST /api/guest`
  `mode:"reset"`. Verified live on both clients; the reset creates a NEW
  identity by design and says so.
- Host force-reveal now judges submitted lines before ending the round
  early (was "Not judged — no score" mid-round; regression-tested).

## Deferred to platform card

- Host transfer under disconnect: the heartbeat self-healing path is now
  exercised (Round 3 above); the disconnect-mid-session variant still belongs
  to the platform matrix on t_b2f5248d.

## Round 5–7 journeys (2026-09-20, QA round-2 rework, production build)

- Match-end standings: the platform completes the match in the same mutation
  that finishes the game (`advance` → `completeMatch`), so `activeMatch` goes
  null exactly when the standings should appear. The strict `findActiveMatch`
  is correct platform behavior; the game now returns the latest game's phase
  from `forRoom` and lingers on its own finished game (predicate in
  `lib/room-view.ts`). Verified live: finish → Final scores first card →
  Play again (host) reachable → cycle 2 starts and seats a member who joined
  during the standings (room 5GVZ, room WEB7).
- Late joiners during an active match: a room member who joined while a match
  ran hit a permanent `MATCH_PARTICIPANT_REQUIRED` failure on `game.view` and
  dead-ended on "Dealing you in…". Reproduced live on the QA VM, that
  sustained failing subscription coincided with the client renderer dying
  within seconds — five fresh identities (Hopper, Marza, Vera, Tess, Iris)
  across fresh browser instances, no JS exception, calm HTTP (11 requests),
  no server error, no host memory pressure. The game now serves such members
  a spectator projection (`me.seated: false`, no writer, advance gated, no
  text before the reveal, outsiders still refused). After the fix the same
  room state that killed every joiner held a new client stable for 36 s+
  (round7-spectator-joiner-stable.png). Root cause of the renderer death is
  on the client stack (Chromium/convex-react under a permanently failing
  subscription); the game-side fix removes the failing state entirely, and
  the mid-match-joiner dead-end is gone as a product bug regardless. If the
  renderer-level mechanism matters, it belongs with the platform owner as a
  convex-react consumer finding, not with this game.
- One crash remained unexplained: the original host tab died once during the
  round-1 writing→reveal transition (room 8PVD) with the same interstitial.
  It never reproduced on any other client through the same transition, and
  every subsequently observed death traced to the non-participant path above.
  Recorded here for honesty; not observed again after the spectator fix.

## Backend candidate deployments (this card's isolated project)

- `proper-albatross-726` redeployed at heads `109d1cf`, `9708296` (functions
  only; the public frontend stays unshipped until independent approval).
