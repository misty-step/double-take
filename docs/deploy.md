# Deploy contract — Double Take

Owner of production release: Zoe (card t_0db65fd9). This document is the contract
between the game code and the release owner. Values are labels only. Secrets live
in `pass` and in Convex deployment env.

## 1. Components

| Piece    | Target                                                              | Notes                                                                                                                                                      |
| -------- | ------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Frontend | Cloudflare Worker `double-take`                                     | OpenNext build of this repo. Custom domain `doubletake.mistystep.io` via `{pattern, custom_domain: true}` (Poppycock precedent). No public exe.dev origin. |
| Backend  | Convex project `doubletake`, prod deployment `proper-albatross-726` | `https://proper-albatross-726.convex.cloud` and `.convex.site`. Isolated per-game project.                                                                 |
| Judge    | Server-side only                                                    | OpenRouter decisions route. Key never reaches the browser.                                                                                                 |

## 2. Build

Use a clean release checkout of the reviewed commit, separate from anonymous
local play. Do not run `pnpm bootstrap` there or carry over its `.env.local`;
`DOUBLETAKE_LOCAL=true` changes the build's guest-session and monitoring behavior.
Use the Node and pnpm versions declared in [`package.json`](../package.json).

Bind only the credential each command needs from pass; `.env.pass` inventories
local entry names and must not be passed wholesale to the frontend build.
Install and run the repository checks first:

```sh
pnpm install --frozen-lockfile
pnpm check            # Parlor build, format, lint, typecheck, and tests
```

Before building, set `NEXT_PUBLIC_CONVEX_URL` and
`NEXT_PUBLIC_CONVEX_SITE_URL` to the production deployment in section 1, and
`NEXT_PUBLIC_SENTRY_DSN` to the configured public DSN in
[`wrangler.jsonc`](../wrangler.jsonc). These values are baked into the browser
bundle; runtime Worker variables cannot repair an incorrectly built client.

Build the Cloudflare artifact with production attribution and source-map upload:

```sh
: "${NEXT_PUBLIC_CONVEX_URL:?Set the production Convex URL}"
: "${NEXT_PUBLIC_CONVEX_SITE_URL:?Set the production Convex site URL}"
: "${NEXT_PUBLIC_SENTRY_DSN:?Set the configured public Sentry DSN}"
export NEXT_PUBLIC_CONVEX_URL NEXT_PUBLIC_CONVEX_SITE_URL NEXT_PUBLIC_SENTRY_DSN
APP_ENVIRONMENT=production APP_RELEASE="$(git rev-parse HEAD)" \
  SENTRY_ORG=misty-step SENTRY_PROJECT=double-take \
  pass-env run -e SENTRY_AUTH_TOKEN=workstation/SENTRY_AUTH_TOKEN -- \
  pnpm exec opennextjs-cloudflare build
test -f .open-next/worker.js
test -d .open-next/assets
```

The [OpenNext build command](https://opennext.js.org/cloudflare/cli) invokes the
package's `build` script (Parlor build plus `next build`), then adapts that output
for Cloudflare. `pnpm build` alone produces the Next.js `.next` output, not the
`.open-next/worker.js` and `.open-next/assets` required by Wrangler. The artifact
checks above confirm paths exist; they do not prove source-map upload, deployed
health, or a successful player journey. Record those release readbacks separately.

## 3. Backend deploy

Server env on the deployment (names only; existing settings provisioned by
t_a342c750; the dedicated Jev key must be installed before this code deploy):

- `JEV_OPENROUTER_API_KEY` — dedicated Jev-only key, `pass` label
  `workstation/OPENROUTER_MISTY_STEP_DOUBLE_TAKE_JEV_API_KEY`. No
  `OPENROUTER_API_KEY` fallback; leave any existing mixed-use key and issuer
  caps untouched.
- `JEV_MODEL=typesafe/jev-1.13`
- `JEV_DECISIONS_URL=https://openrouter.ai/api/alpha/decisions`
- `PARLOR_GUEST_TOKEN_AUDIENCE=doubletake`
- `PARLOR_GUEST_TOKEN_KEYS` — key ring, `pass` label `workstation/DOUBLETAKE_PARLOR_GUEST_TOKEN_KEYS`.
- `PRODUCT_ENVIRONMENT=production` — explicit product-event partition; never inferred.

The release owner installs the dedicated secret on the existing production
deployment (not the Worker) without printing its value:

```sh
pass-env run \
  -e CONVEX_DEPLOY_KEY=workstation/DOUBLETAKE_CONVEX_DEPLOY_KEY \
  -e JEV_OPENROUTER_API_KEY=workstation/OPENROUTER_MISTY_STEP_DOUBLE_TAKE_JEV_API_KEY -- \
  sh -c 'printf %s "$JEV_OPENROUTER_API_KEY" | pnpm exec convex env set --force JEV_OPENROUTER_API_KEY'
```

After setting the key, deploy the backend:

```sh
pass-env run -e CONVEX_DEPLOY_KEY=workstation/DOUBLETAKE_CONVEX_DEPLOY_KEY -- pnpm exec convex deploy --yes
```

After deploying backend code, smoke a controlled production room with two
guests: submit one new, valid line from one guest, leave the other guest idle,
and wait for the 30-second last-player deadline to reveal its score. Use a
previously unjudged line so the cache cannot bypass Jev; verify the dedicated
key's usage readback rather than attributing a cached reveal to this key.
Exercise the missing-dedicated-key retry path on a fresh anonymous local
backend with only a generic key, not by disabling the production key. Do not
run `judge:probe` or the pair battery as a production smoke: both make multiple
paid Jev requests.

## 4. Frontend configuration boundaries

Private Worker runtime secrets, never included in the browser bundle:

- `PARLOR_GUEST_TOKEN_KEYS` (same key ring as the backend)
- `DOUBLETAKE_CONTINUITY_SECRET` — `pass` label `workstation/DOUBLETAKE_PARLOR_CONTINUITY_SECRET`.

Worker runtime configuration (not secret):

- `PARLOR_GUEST_TOKEN_AUDIENCE=doubletake`
- `APP_ENVIRONMENT=production`
- `APP_RELEASE` — the exact 40-character candidate commit SHA.
- `SENTRY_DSN` — the public `double-take` project DSN used by server monitoring.

Public browser build inputs are `NEXT_PUBLIC_CONVEX_URL`,
`NEXT_PUBLIC_CONVEX_SITE_URL`, and `NEXT_PUBLIC_SENTRY_DSN`. Section 2 supplies
these plus `APP_ENVIRONMENT` and `APP_RELEASE`; `next.config.ts` exposes the
attribution as `NEXT_PUBLIC_APP_ENVIRONMENT` and `NEXT_PUBLIC_APP_RELEASE`.
These values intentionally reach the browser.

Source-map upload uses `SENTRY_ORG=misty-step`, `SENTRY_PROJECT=double-take`, and
the private `SENTRY_AUTH_TOKEN` only during the build. The upload token is neither
a Worker runtime variable nor a browser build input.

`APP_ENVIRONMENT`, `PRODUCT_ENVIRONMENT`, and the Sentry project environment must
agree. The SDK sends no default PII, removes request payloads, query strings,
headers, users, extras, and breadcrumbs, and samples traces at 5%. Builds without
upload credentials remain buildable but cannot be released: source-map upload and
the exact release attribution are release readbacks.

Guest session API (same-origin only, strict JSON body): `POST /api/guest` with
`mode:"acquire"` (fresh guest), `mode:"refresh"` (+ advisory token, restores the
seat from the signed HttpOnly continuity cookie), or `mode:"reset"` (recovery:
drops the caller's own cookie — even an unreadable one — and issues a NEW guest
identity; the response also expires the cookie name used by the other build
mode). The continuity cookie name is `__Host-double-take-continuity` in
production and `double-take-continuity` in development; a seat created under
one build mode cannot be restored under the other, which is why the client
surfaces an explicit "Start as a new guest" recovery card.

## 5. Required checks before release

1. Exact-head CI: `.github/workflows/ci.yml` runs `pnpm install --frozen-lockfile`,
   `pnpm check` (Parlor build, format, lint, typecheck, and tests), then
   `pnpm build:web` (`next build`) on every PR and `master` push. No secrets are
   wired into CI. The release owner records the check run for the merged head.
   This workflow does not build the OpenNext artifact, upload source maps, or
   deploy either service; a green run alone is not release verification.
2. Independent review verdict PASS on the implementation card.
3. Candidate browser evidence (see `evidence/`) plus production two-client journey.
4. `GET /api/health` returns 200 with the exact release and reports the Convex
   dependency `ok`; the backend route is `GET /health` on the configured
   `.convex.site` origin. Neither response contains secrets or judge diagnostics.
5. Sentry readback confirms the `double-take` project, `production` environment,
   exact release, uploaded source maps, and a labeled test issue. Shared webhook
   activation remains owned by `t_089aca22`; this repo only registers the prepared
   `sentry-games` triage adapter in `config/game-operations.json`.

## 6. Rollback

Rollback is an explicit release-owner operation. Retain the known-good source
commit, Worker version, and release evidence before changing either service.

- Frontend: select the known-good Worker version for `pnpm exec wrangler rollback`,
  or rebuild the previous commit through section 2 before redeploying it. Confirm
  the restored client and backend remain compatible and repeat the health and
  player-journey readbacks. Do not change the hostname route as a code rollback.
- Backend: assess the previous code and schema against the data currently stored
  before considering a redeploy. [`convex/schema.ts`](../convex/schema.ts) includes
  rooms/players through Parlor, games, rounds, player submission text,
  adjudications, and product events. Redeploying an older commit is not a data
  restore and must not assume an empty database or erase newer player data.
- Data recovery is separate from code rollback. This guide does not establish a
  verified backup or restore procedure; obtain an operator-approved recovery plan
  if the incident requires one.

## 7. Historical candidate verification

The earlier candidate used the private, ephemeral VM
`doubletake-qa-2f3bbf3d.exe.xyz` with the backend named in section 1, before a
production frontend hostname existed. This is historical context, not a current
QA target or an instruction to reuse or delete that VM. Verify the current
environment owner and use an explicitly selected candidate environment; local
tests use the anonymous backend described in the [README](../README.md).
