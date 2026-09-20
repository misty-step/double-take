# Deploy contract — Double Take

Owner of production release: Zoe (card t_0db65fd9). This document is the contract
between the game code and the release owner. Values are labels only. Secrets live
in `pass` and in Convex deployment env.

## 1. Components

| Piece | Target | Notes |
| --- | --- | --- |
| Frontend | Cloudflare Worker `double-take` | OpenNext build of this repo. Custom domain `doubletake.mistystep.io` via `{pattern, custom_domain: true}` (Poppycock precedent). No public exe.dev origin. |
| Backend | Convex project `doubletake`, prod deployment `proper-albatross-726` | `https://proper-albatross-726.convex.cloud` and `.convex.site`. Isolated per-game project. |
| Judge | Server-side only | OpenRouter decisions route. Key never reaches the browser. |

## 2. Build

```sh
pnpm install --frozen-lockfile
pnpm check            # build:parlor + typecheck + tests
pnpm build            # build:parlor + next build  (produces .open-next)
```

`NEXT_PUBLIC_CONVEX_URL` and `NEXT_PUBLIC_CONVEX_SITE_URL` are baked at build time
and must point at the Convex deployment above.

## 3. Backend deploy

```sh
CONVEX_DEPLOY_KEY=$(pass show workstation/DOUBLETAKE_CONVEX_DEPLOY_KEY) npx convex deploy --yes
```

Server env on the deployment (names only; already set by provisioning t_a342c750):

- `OPENROUTER_API_KEY` — scoped key, `pass` label `workstation/DOUBLETAKE_OPENROUTER_API_KEY`.
- `JEV_MODEL=typesafe/jev-1.13`
- `JEV_DECISIONS_URL=https://openrouter.ai/api/alpha/decisions`
- `PARLOR_GUEST_TOKEN_AUDIENCE=doubletake`
- `PARLOR_GUEST_TOKEN_KEYS` — key ring, `pass` label `workstation/DOUBLETAKE_PARLOR_GUEST_TOKEN_KEYS`.

## 4. Worker env (web server only)

These stay on the Worker. They never go into the client bundle or the browser.

- `PARLOR_GUEST_TOKEN_AUDIENCE=doubletake`
- `PARLOR_GUEST_TOKEN_KEYS` (same key ring as the backend)
- `DOUBLETAKE_CONTINUITY_SECRET` — `pass` label `workstation/DOUBLETAKE_PARLOR_CONTINUITY_SECRET`.
- `NEXT_PUBLIC_CONVEX_URL`, `NEXT_PUBLIC_CONVEX_SITE_URL` — public, baked at build.

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
   `pnpm check` (parlor build + typecheck + tests) and `pnpm build` on every PR and
   `main` push. No secrets are wired into CI. The release owner records the check run
   for the merged head.
2. Independent review verdict PASS on the implementation card.
3. Candidate browser evidence (see `evidence/`) plus production two-client journey.

## 6. Rollback

- Frontend: `npx wrangler rollback` to the previous Worker version, or redeploy the
  previous commit.
- Backend: `npx convex deploy` from the previous good commit. No user data is held yet.
- Hostname: remove the route and redeploy; Cloudflare removes the sentinel record.

## 7. QA environment used for candidate verification

- App served from task-owned VM `doubletake-qa-2f3bbf3d.exe.xyz` (private, ephemeral;
  remove after QA).
- Backend: the deployment above. No production host existed at candidate time.
- Cleanup: `ssh exe.dev rm doubletake-qa-2f3bbf3d`.
