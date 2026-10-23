# Double Take shell verification — 2026-10-20

Base and deployed release: `8085f06e29cf8bfb9a1ce9f4e4ec0f89cb6718c5`.
Run timestamps are UTC on 2026-10-21 (the operator's 2026-10-20 evening).

## Outcome

The complete reusable shell harness passed in [local-06](local-06/actions.json)
with a real anonymous Convex backend, real Next.js app and three isolated browser
contexts (two players, then a fresh recovery context). The [result](local-06/result.json)
records five actual localhost judge HTTP calls. The full production shell surface
passed in [production-02](production-02/actions.json): attributed health, automatic
guest issuance, phone-width home, help and changelog. Production reports version
0.2.0, production environment, this exact base release and backend `ok`.

Owner sign-in: **n/a — accountless guest rooms**. There is no owner account,
owner email, inbox delivery or owner-only page. Guest session restoration and
room-scoped host controls were exercised separately.

Live Jev: **UNPROVEN**. This scope supplies no permission for model spending.
The unchanged full provider journey remains in the feature map. It needs explicit
paid-model scope, the dedicated pass entry named in docs/deploy.md, and dedicated-key
usage readback; credential access was not attempted for an unauthorized paid call.
The fixture replaces only the existing judge HTTP boundary and makes no model
quality or live-provider availability claim. No production room or model call was
created. No product, authentication or deployment code changed; no product bug
was confirmed.

## Commands and runtime

Setup: `pnpm install --frozen-lockfile`.
Node 26.12.0, pnpm 11.25.0, Playwright 1.64.1 / Chromium revision 1248.

```sh
export PLAYWRIGHT_MODULE="$HOME/.local/share/mise/installs/npm-playwright/1.64.1/node_modules/playwright/index.mjs"
.agents/skills/verify-double-take/scripts/container.sh evidence/verify-double-take/2026-10-20/local-06
.agents/skills/verify-double-take/scripts/verify.mjs production evidence/verify-double-take/2026-10-20/production-02
.agents/skills/verify-double-take/scripts/verify.mjs doctor production
```

The actual installed prefix was the workstation's mise npm-playwright/1.64.1
installation. Doctor also passed inside the active owned container via the exact
`docker exec` command emitted by the wrapper.

Native launch attempts encountered another verifier occupying ports 3210/3220/3221,
including a race after the free-port preflight. The helper refused takeover and
cleaned only its own state. To remove that collision, the final run used the existing
`mcr.microsoft.com/playwright:v1.64.0-noble` image, with no published ports. Its
Ubuntu 24.04 network namespace was the only app-environment substitution. The
wrapper mounted this same checkout at the same absolute path (pnpm records paths),
and mounted host Node, standalone pnpm and Playwright read-only. The image provided
Chromium 1248. No dependency was added to the product or fetched container image.
Native host coexistence remains unproven while another process owns the fixed ports;
the isolated container path is proven. Launch, function deployment, source-backed
seeding, guest API, game mutations, subscriptions and UI all used the real repo code.

## Coverage and evidence

- Guest access/public pages: [production mobile home](production-02/production-home-mobile.png),
  [help](production-02/production-help.png), [changelog](production-02/production-changelog.png),
  local reload persistence and [invalid-cookie recovery](local-06/invalid-continuity.png).
- Create/join: [solo host](local-06/solo-host.png), [two-player roster](local-06/two-player-lobby.png),
  required-name/code-length validation and invitation rejoin.
- Writing: empty and thirteen-word rejection, Enter submission, [missing-key retry](local-06/missing-judge-retry.png),
  same pair on both phones and peer-line privacy before reveal.
- Reveal/match: [real last-player deadline](local-06/round-1-scores-fixture.png),
  [round two](local-06/round-2-scores-fixture.png), [round three](local-06/round-3-scores-fixture.png),
  [finished match](local-06/match-finished-fixture.png). Fixture points were asserted as
  6 per accepted line, idle player 0, final totals 18 and 12. Both clients' round lists
  were compared after normalizing only the viewer-relative word "You".
- Lifecycle: both logo and text menu entry points, guest host-controls absent,
  host end returns both guests to lobby, replay, leave/rejoin, host transfer,
  room close and [closed-code rejection](local-06/closed-room-rejection.png).
- Backend down: the actual owned backend was stopped; frontend health returned
  503 unhealthy. [Actions](local-06/actions.json) also confirm cleanup and retained proof.
- Checks: [pnpm check](check.log): formatting, lint, types and 81 tests / 14 files passed.
  [Production build](build.log): `pnpm build` passed with public Convex URLs and the base
  SHA attribution; no deployment. Node syntax, helper oxlint, shellcheck, helper/docs
  formatting, relative links, feature headings, executable bits, symlink resolution,
  and `git diff --check` also passed ([helper checks](helper-checks.log)).

All screenshots use synthetic local names/lines or the public production surface.
No cookie, token, browser storage, trace, raw request body or private room data is retained.
Cleanup removed generated local data and keys; owned browser/server/fixture/container
processes stopped, and evidence remained at the named paths.

## Iteration record

- local and local-02: launch refused occupied ports; no game was driven.
- local-03: another verifier claimed port 3220 during Convex startup; safe failure.
- local-04: first container setup changed the workspace path, triggering pnpm's
  noninteractive dependency repair refusal. Wrapper now preserves the absolute path
  and the installed runtime.
- local-05: all game/lifecycle checks passed; recovery setup incorrectly retained a
  valid access proof, so the damaged cookie was not consulted. This was a harness
  precondition error. The final recipe uses a fresh context without cached proof.
- local-06: complete current harness and container wrapper PASS, including recovery,
  real backend-down health and cleanup.
- production: initial screenshot captured an animated entrance in progress.
  production-02 repeats the complete flow with reduced motion for stable visual proof.

## Artifact inventory

### local

- [actions.json](local/actions.json)
- [result.json](local/result.json)

### local-02

- [actions.json](local-02/actions.json)
- [result.json](local-02/result.json)

### local-03

- [actions.json](local-03/actions.json)
- [result.json](local-03/result.json)

### local-04

- [actions.json](local-04/actions.json)
- [result.json](local-04/result.json)

### local-05

- [actions.json](local-05/actions.json)
- [closed-room-rejection.aria.txt](local-05/closed-room-rejection.aria.txt)
- [closed-room-rejection.png](local-05/closed-room-rejection.png)
- [local-help.aria.txt](local-05/local-help.aria.txt)
- [local-help.png](local-05/local-help.png)
- [match-finished-fixture.aria.txt](local-05/match-finished-fixture.aria.txt)
- [match-finished-fixture.png](local-05/match-finished-fixture.png)
- [missing-judge-retry.aria.txt](local-05/missing-judge-retry.aria.txt)
- [missing-judge-retry.png](local-05/missing-judge-retry.png)
- [result.json](local-05/result.json)
- [round-1-scores-fixture.aria.txt](local-05/round-1-scores-fixture.aria.txt)
- [round-1-scores-fixture.png](local-05/round-1-scores-fixture.png)
- [round-2-scores-fixture.aria.txt](local-05/round-2-scores-fixture.aria.txt)
- [round-2-scores-fixture.png](local-05/round-2-scores-fixture.png)
- [round-3-scores-fixture.aria.txt](local-05/round-3-scores-fixture.aria.txt)
- [round-3-scores-fixture.png](local-05/round-3-scores-fixture.png)
- [solo-host.aria.txt](local-05/solo-host.aria.txt)
- [solo-host.png](local-05/solo-host.png)
- [two-player-lobby.aria.txt](local-05/two-player-lobby.aria.txt)
- [two-player-lobby.png](local-05/two-player-lobby.png)

### local-06

- [actions.json](local-06/actions.json)
- [closed-room-rejection.aria.txt](local-06/closed-room-rejection.aria.txt)
- [closed-room-rejection.png](local-06/closed-room-rejection.png)
- [invalid-continuity.aria.txt](local-06/invalid-continuity.aria.txt)
- [invalid-continuity.png](local-06/invalid-continuity.png)
- [local-help.aria.txt](local-06/local-help.aria.txt)
- [local-help.png](local-06/local-help.png)
- [match-finished-fixture.aria.txt](local-06/match-finished-fixture.aria.txt)
- [match-finished-fixture.png](local-06/match-finished-fixture.png)
- [missing-judge-retry.aria.txt](local-06/missing-judge-retry.aria.txt)
- [missing-judge-retry.png](local-06/missing-judge-retry.png)
- [result.json](local-06/result.json)
- [round-1-scores-fixture.aria.txt](local-06/round-1-scores-fixture.aria.txt)
- [round-1-scores-fixture.png](local-06/round-1-scores-fixture.png)
- [round-2-scores-fixture.aria.txt](local-06/round-2-scores-fixture.aria.txt)
- [round-2-scores-fixture.png](local-06/round-2-scores-fixture.png)
- [round-3-scores-fixture.aria.txt](local-06/round-3-scores-fixture.aria.txt)
- [round-3-scores-fixture.png](local-06/round-3-scores-fixture.png)
- [solo-host.aria.txt](local-06/solo-host.aria.txt)
- [solo-host.png](local-06/solo-host.png)
- [two-player-lobby.aria.txt](local-06/two-player-lobby.aria.txt)
- [two-player-lobby.png](local-06/two-player-lobby.png)

### production

- [actions.json](production/actions.json)
- [production-changelog.aria.txt](production/production-changelog.aria.txt)
- [production-changelog.png](production/production-changelog.png)
- [production-help.aria.txt](production/production-help.aria.txt)
- [production-help.png](production/production-help.png)
- [production-home-mobile.aria.txt](production/production-home-mobile.aria.txt)
- [production-home-mobile.png](production/production-home-mobile.png)
- [result.json](production/result.json)

### production-02

- [actions.json](production-02/actions.json)
- [production-changelog.aria.txt](production-02/production-changelog.aria.txt)
- [production-changelog.png](production-02/production-changelog.png)
- [production-help.aria.txt](production-02/production-help.aria.txt)
- [production-help.png](production-02/production-help.png)
- [production-home-mobile.aria.txt](production-02/production-home-mobile.aria.txt)
- [production-home-mobile.png](production-02/production-home-mobile.png)
- [result.json](production-02/result.json)
