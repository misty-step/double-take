# Double Take

One sentence, two contexts, two readings. The weaker reading wins.

A phone-first party game built on [Parlor](https://github.com/misty-step/parlor) for
accountless rooms, presence, and synchronized matches, with server-side Jev
judgments from [TypeSafe](https://docs.typesafe.ai) for the two plausibility
readings.

Working name: Double Take. Earlier prototype name: Make It Ambiguous.

## How it plays

1. The round offers two contexts (for example: a wedding vow and a villain
   monologue).
2. You write one coherent sentence of at most twelve words.
3. Jev scores the same sentence twice: plausibility under context A, and
   plausibility under context B. A coherence check and a specificity check
   reject stitched clauses and generic filler.
4. The weaker reading determines your points. A sentence that is great for one
   context and nonsense for the other scores low.
5. Reveal: the sentence appears under the first framing, then the same words
   reappear under the opposite framing.

Solo practice scores one player. Rooms synchronize two or more players through
Parlor: submissions, reveals, and replay are server-owned.

## Local development (no Convex account)

```sh
pnpm install
pnpm bootstrap   # anonymous local Convex deployment + local signing keys
pnpm dev         # web on http://localhost:3210, backend on 3220/3221
```

`pnpm test` runs the rule, judge-contract, and backend tests. The judge talks to
a configurable decisions endpoint; tests use a fake server and never call a live
model.

## Server configuration

The game server reads these Convex environment variables. Values never reach
the browser.

| Variable | Purpose |
| --- | --- |
| `OPENROUTER_API_KEY` | Server-only key for the Jev decisions endpoint. |
| `JEV_MODEL` | Model id, for example `typesafe/jev-1.13`. |
| `JEV_DECISIONS_URL` | Decisions endpoint, for example `https://openrouter.ai/api/alpha/decisions`. |
| `PARLOR_GUEST_TOKEN_KEYS` | JSON key id to base64url secret (at least 32 bytes). |
| `PARLOR_GUEST_TOKEN_AUDIENCE` | `doubletake`. |

`pnpm bootstrap` generates local-only values for the Parlor keys. Production
secrets are provisioned by the deployment owner; see `docs/deploy.md`.

## Parlor pin

Consumed from a vendored checkout of `misty-step/parlor`; see
`vendor/parlor/UPSTREAM.json` for the exact commit. Private workspace packages
are not published to npm.

## Layout

- `convex/` server: schema, rooms, game state machine, judging, sweeper.
- `lib/` shared rules, rubrics, and the judge client.
- `app/`, `components/` the phone-first client.
- `tests/` executable rules, contract, and backend tests.
- `evidence/` run logs and screenshots for review.
