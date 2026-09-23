# Double Take

Everyone gets the same two worlds. Write the line that fits both best.

A phone-first party game for 2 to 8 players, built on
[Parlor](https://github.com/misty-step/parlor) for accountless rooms, presence,
and synchronized matches, with server-side Jev judgments from
[TypeSafe](https://docs.typesafe.ai) through OpenRouter.

## How it plays

1. One player starts a game and shares the four-letter code; everyone joins on
   their own phone.
2. Each round, everyone gets the same two worlds (for example: a wedding vow and
   a villain's gloat) and locks in one sentence of at most twelve words.
3. For each world, Jev rates from 0 to 3 whether the line would be appropriate
   to say there. A line's points are both ratings added together (0 to 6).
   Stitched halves, and lines that would be wrong to say in either world,
   score nothing.
4. Lines are judged as they are locked in and stay hidden. No clock runs while
   people write; once all but one are in, the last player gets 30 seconds.
5. The reveal plays on every phone at once: each line without its author,
   lowest to highest, in the first world, then the second world with the words
   in the same place, then its points and who wrote it.
6. Most points takes the round (ties go to the more balanced line). Three
   rounds; most total points wins.

Rules live in `convex/rules.ts`; the game server in `convex/game.ts`; the
design record and spec in `design/reimagine/`.

## Local development (no Convex account)

```sh
pnpm install
pass-env run -e OPENROUTER_API_KEY=workstation/DOUBLETAKE_OPENROUTER_API_KEY -- pnpm bootstrap
pnpm dev         # web on http://localhost:3210, backend on 3220/3221
```

Passing the key to `bootstrap` (or `dev`) stores it on the anonymous local
Convex deployment only; it is never written to `.env.local` and never reaches
the browser or the Next.js process. Without a key, lines fail to score and
players are asked to lock them in again. `JEV_MODEL` and `JEV_DECISIONS_URL`
default to `typesafe/jev-1.13` and the OpenRouter decisions route.

To play on phones on the same Wi-Fi, set `NEXT_PUBLIC_CONVEX_URL` and
`NEXT_PUBLIC_CONVEX_SITE_URL` in `.env.local` to this computer's LAN IP (ports
3220 and 3221), restart `pnpm dev`, then open `http://<LAN IP>:3210` on each
phone. The dev server allows that host automatically; plain `http` works.

`pnpm test` runs the rule, judge-contract, and backend tests. Tests use a fake
judge and never call a live model.

## Server configuration

The game server reads these Convex environment variables. Values never reach
the browser.

| Variable                      | Purpose                                                                      |
| ----------------------------- | ---------------------------------------------------------------------------- |
| `OPENROUTER_API_KEY`          | Server-only key for the Jev decisions endpoint.                              |
| `JEV_MODEL`                   | Model id, for example `typesafe/jev-1.13`.                                   |
| `JEV_DECISIONS_URL`           | Decisions endpoint, for example `https://openrouter.ai/api/alpha/decisions`. |
| `PARLOR_GUEST_TOKEN_KEYS`     | JSON key id to base64url secret (at least 32 bytes).                         |
| `PARLOR_GUEST_TOKEN_AUDIENCE` | `doubletake`.                                                                |

`pnpm bootstrap` generates local-only values for the Parlor keys. Production
secrets are provisioned by the deployment owner; see `docs/deploy.md`.

## The deck

Each round draws a pair of worlds from `convex/deck.ts`: the hand-authored
pairs in `convex/content.ts`, then generated pairs in `convex/generatedPairs.ts`.
A generated pair reaches players only after it passes the Jev pair battery.
Add more with:

```sh
pass-env run -e OPENROUTER_API_KEY=workstation/DOUBLETAKE_OPENROUTER_API_KEY -- \
  env JEV_MODEL=typesafe/jev-1.13 JEV_DECISIONS_URL=https://openrouter.ai/api/alpha/decisions \
  bun scripts/pairs/generate.ts --batches 10 --max-usd 0.1
```

`bun scripts/pairs/calibrate.ts` (same environment) rechecks the battery
against authored pairs and planted bad pairs. See `docs/pairs.md`.

## Parlor pin

Consumed from a vendored checkout of `misty-step/parlor`; see
`vendor/parlor/UPSTREAM.json` for the exact commit. Private workspace packages
are not published to npm.

## Layout

- `convex/` server: schema, rooms, game state machine, judging, the deck.
- `scripts/pairs/` the pair generator and its Jev check battery.
- `lib/` client helpers: reveal timing, sessions, player copy, telemetry.
- `app/`, `components/` the phone-first client.
- `tests/` executable rules, contract, and backend tests.
- `evidence/` run logs and screenshots for review.
