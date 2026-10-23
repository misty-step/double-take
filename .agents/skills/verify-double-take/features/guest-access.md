# Guest access and public pages

A visitor gets a guest seat without an account, can learn the rules, read changes,
and restore or deliberately replace a broken seat.

## Sub-features

- `guest-acquire`: usable home after automatic guest issuance.
- `guest-continuity`: reload restores a joined seat.
- `guest-recovery`: invalid continuity cookie shows recovery; Start fresh works.
- `public-pages`: help and changelog render at phone width.

## How to get to it (user POV)

Open `/`; choose How to play or Changelog. Reload while in a room. When a seat
cannot be restored, choose Start fresh to abandon that identity.

## Driving it with verify.mjs

Preconditions: the baseline in README.md and an owned local backend.

- **Local:** run `scripts/verify.mjs run <new-evidence-directory>` relative to
  this skill (from repo root use the full path in SKILL.md). Home's Start a game
  appears; How to play opens a dialog. A joined guest reloads into the same roster.
- **Recovery:** the same run opens a fresh context with a synthetic invalid continuity
  cookie and no cached access proof, opens `/`, asserts We couldn’t restore your seat, then chooses Start fresh.
  A usable home returns; retain `invalid-continuity.*`.
- **Deployed:** run `scripts/verify.mjs production <new-evidence-directory>`.
  Assert `/api/guest` 200 and Start a game/Join a game, open and close help,
  follow Changelog to Back to the game. Retain `production-*` at 390×844.

## Gotchas

- Owner login/email/inbox/owner-only pages are n/a; do not invent an owner identity.
- Health does not test issuance: the browser must reach the usable home.
- Cookie corruption is a local test precondition, never a production action.
- Start fresh creates a new guest and leaves old room/points behind.
- A reload restores guest continuity, not every form draft.
