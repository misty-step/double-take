# Deploy contract — Double Take

Frontend promotion and code rollback run through GitHub Actions. Backend code,
schema and accepted player data are separate; frontend CD never deploys Convex.
See the [foundations](https://foundations.mistystep.io/) and
[local release decision](adr/001-continuous-delivery.md).

## 1. Components

| Piece    | Target                                                              | Notes                                                                                                                                                      |
| -------- | ------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Frontend | Cloudflare Worker `double-take`                                     | OpenNext build of this repo. Custom domain `doubletake.mistystep.io` via `{pattern, custom_domain: true}` (Poppycock precedent). No public exe.dev origin. |
| Backend  | Convex project `doubletake`, prod deployment `proper-albatross-726` | `https://proper-albatross-726.convex.cloud` and `.convex.site`. Isolated per-game project.                                                                 |
| Judge    | Server-side only                                                    | OpenRouter decisions route. Key never reaches the browser.                                                                                                 |

## 2. Build

CI is the only production frontend deploy path. Repository secrets are
`CLOUDFLARE_API_TOKEN` (the shared narrow CD token) and `SENTRY_AUTH_TOKEN`
(build-only source-map upload). Never load `.env.pass` into a frontend build.

```sh
pnpm install --frozen-lockfile
pnpm check            # build:parlor + typecheck + tests
APP_ENVIRONMENT=production APP_RELEASE=$(git rev-parse HEAD) node scripts/build-worker.mjs
APP_RELEASE=$(git rev-parse HEAD) node scripts/smoke-worker.mjs
```

The build reads public URLs and DSNs from `wrangler.jsonc`. OpenNext (not
`pnpm build` alone) produces `.open-next/worker.js` and assets. The local smoke
runs that package in workerd with synthetic signing keys; its backend probe is
GET-only and it creates no game room or paid judgment.

On each `master` push, CI checks, builds once with source-map upload, smokes the
package, and uploads `worker-<SHA>` plus its SHA256. The serialized deploy job
downloads that exact artifact, checks its hash and that source is still current
`master`, and promotes it without rebuilding. Existing Worker signing secrets
are retained. `deployment-<SHA>` records the previous and new provider versions.

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

## 4. Worker env (web server only)

Signing secrets stay on the Worker. Public URLs, attribution and the public
Sentry DSN may reach the browser; the upload token never does.

- `PARLOR_GUEST_TOKEN_AUDIENCE=doubletake`
- `PARLOR_GUEST_TOKEN_KEYS` (same key ring as the backend)
- `DOUBLETAKE_CONTINUITY_SECRET` — `pass` label `workstation/DOUBLETAKE_PARLOR_CONTINUITY_SECRET`.
- `NEXT_PUBLIC_CONVEX_URL`, `NEXT_PUBLIC_CONVEX_SITE_URL` — public, baked at build.
- `APP_ENVIRONMENT=production`
- `APP_RELEASE` — the exact 40-character candidate commit SHA.
- `SENTRY_DSN` and `NEXT_PUBLIC_SENTRY_DSN` — the `double-take` project DSN.
- `SENTRY_ORG=misty-step`, `SENTRY_PROJECT=double-take`, and `SENTRY_AUTH_TOKEN`
  during the build that uploads source maps. The auth token is never a Worker runtime variable.

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

1. Exact-head CI: `.github/workflows/ci.yml` runs frozen install, `pnpm check`,
   OpenNext build and packaged-Worker smoke on every PR and `master` push.
   Only default-branch pushes can reach deployment. Failed/skipped checks cannot
   deploy; a moved default head refuses promotion.
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

- Frontend: dispatch **Roll back Worker code** on `master` with the previous
  provider version UUID from the deployment artifact. It shares promotion's
  concurrency group, selects that existing version without rebuilding, and
  verifies provider identity plus public home, exact-release health, guest
  issuance and cross-origin refusal. A failed deployment automatically performs
  this recovery to the version captured before promotion and still fails loudly.
- A frontend rollback restores code/configuration, not Convex code, data,
  credentials or DNS. Do not redeploy an old source tree as a substitute for
  selecting the previous immutable Worker version.
- Convex retains rooms, submissions, adjudications and product events. A backend
  code rollback needs explicit compatibility verification against retained state;
  never clear tables or assume the database is empty. Data recovery is a separate
  operation, not part of frontend rollback.
- CI/CD failures send a bounded error event (run URL and source SHA, no player
  content) to the existing Double Take Sentry production incident path. Existing
  external uptime/Sentry watchers remain unchanged.

## 7. QA environment used for candidate verification

Historical evidence under `evidence/` predates the current live Worker. It is not
proof of the current candidate and is not an instruction to reuse or delete a VM.
Current checks run in the isolated workspace and Actions using the pinned runtime.
