---
name: verify-double-take
description: Verify Double Take guest access, rooms, writing, synchronized reveals, and recovery from a shell; use after game or deployment changes.
---

# Verify Double Take

Read [the feature map](features/README.md) first. This skill targets the Convex
application on master, documented in [the README](../../../README.md) and
[deployment guide](../../../docs/deploy.md). Double Take is accountless: owner
login, owner email, inbox delivery, and owner-only pages are **n/a**. A room host
is a guest with room-scoped controls, not an account owner.

## Launch

Run from a **fresh disposable checkout** with Node >=22.12 and pnpm >=11:

```sh
pnpm install --frozen-lockfile
# Reuse an installed Playwright module if available. Otherwise install only in scratch:
VERIFY_BROWSER_DIR="$HOME/.cache/tmp/double-take-verification-browser"
npm install --prefix "$VERIFY_BROWSER_DIR" --no-save --no-package-lock playwright@1.64.1
export PLAYWRIGHT_MODULE="$VERIFY_BROWSER_DIR/node_modules/playwright/index.mjs"
node "$VERIFY_BROWSER_DIR/node_modules/playwright/cli.js" install chromium
# Optional: use an existing Chromium instead of downloading a browser:
# export PLAYWRIGHT_CHROMIUM_EXECUTABLE=/usr/bin/chromium
mkdir -p evidence/verify-double-take
.agents/skills/verify-double-take/scripts/verify.mjs run \
  "evidence/verify-double-take/local-$(date -u +%Y%m%dT%H%M%SZ)"
```

`PLAYWRIGHT_MODULE` is an absolute path to `playwright/index.mjs`; omit it when
`playwright` already resolves from this checkout. Browser dependencies stay out
of the product lockfile. An installed browser and internet for the initial
Convex binary download are prerequisites.

The runner refuses existing `.env`, `.env.local`, or `.convex` state. It reuses
`scripts/local.mjs`: build Parlor, generate local signing keys, start anonymous
Convex on 3220/3221, deploy functions, seed source-backed cards, and start Next
on 3210. It waits for attributed health **and** usable guest UI. Fixed ports
allow only one local run per network namespace; occupied ports fail without takeover.

The runner drops inherited judge API keys. The fresh backend first has no judge
configuration, then receives a synthetic key and loopback HTTP fixture. It never
selects a cloud backend, calls OpenRouter, or reads a password store. Remote
Convex selectors are rejected by the repository's local tooling.

For occupied shared-host ports on Linux, use the optional Docker wrapper (existing
`mcr.microsoft.com/playwright:v1.64.0-noble` image required):

```sh
.agents/skills/verify-double-take/scripts/container.sh \
  "evidence/verify-double-take/container-$(date -u +%Y%m%dT%H%M%SZ)"
```

It runs the identical helper in a private network namespace with no published
ports, mounts this checkout at the same absolute path (pnpm records that path),
and mounts the installed Node, pnpm and Playwright read-only. It assumes Linux
native dependencies compatible with Ubuntu 24.04. The browser module version
1.64.1 and image 1.64.0 both use Chromium revision 1248. Docker is optional; the
normal shell run needs no container. Evidence and cleanup stay in this checkout.

## Doctor

During a native local run (from a second shell), or whenever the instance surprises you:

```sh
.agents/skills/verify-double-take/scripts/verify.mjs doctor local
.agents/skills/verify-double-take/scripts/verify.mjs doctor production
```

For container runs, use the exact `docker exec` doctor command printed by
`container.sh`; host-local ports belong to a different network namespace.

Local doctor is read-only: require HTTP 200, service `double-take`, test/local
attribution, backend `ok`, and port 3220's anonymous instance name matching this
checkout's local config. Production requires production attribution and a full
release SHA. Neither check proves guest issuance or judge availability; the
browser drives prove the former. After an unexpected failed drive, rerun doctor,
then restart the complete isolated run rather than reusing a partially driven UI.

## Drive

`verify.mjs run <new-evidence-directory>` launches, doctors, drives every mapped
feature serially using two isolated browser contexts, and cleans up. It uses
Playwright ARIA names and visible labels, and cross-checks changes on the other
player's screen. Exit 0 means its listed assertions passed; it does **not** mean
live Jev was exercised.

Run the separate deployed surface with guest issuance as the only allowed
application write:

```sh
.agents/skills/verify-double-take/scripts/verify.mjs production \
  "evidence/verify-double-take/production-$(date -u +%Y%m%dT%H%M%SZ)"
```

This visits `https://doubletake.mistystep.io`, verifies automatic `/api/guest`
success, mobile home, help and changelog. Other non-read requests are blocked;
attempted same-origin/backend writes fail the run. It creates no production
room or model request. T3 preview is optional for inspection, never required.

For a full **live Jev** match, retain the complete journey in
[reveal and match](features/reveal-match.md). It requires explicit model-spending
scope plus the dedicated key; discover it with `authenticated-commands` using
the pass entry named in the deployment guide. This run intentionally leaves that
journey UNPROVEN rather than substituting fixture scores as live evidence.

## Evidence

The chosen directory must be new and its parent must exist. Retain `actions.json`
(action/result/time), `result.json`, `.aria.txt` snapshots and PNGs. Record base
SHA, actual command, runtime versions, feature coverage, and limitations in a
run README. Existing convention is `evidence/`; fleet evidence lives under
`evidence/verify-double-take/2026-10-20/`.

Only synthetic player names and lines reach local screenshots. Helpers retain
no cookies, access tokens, storage dumps, traces, raw HTTP bodies or server
logs. Failure evidence names the failed step and error class; reproduce locally
for detailed diagnosis. Review each artifact before committing. A health 200
alone is not guest or scoring proof. Fixture results prove game mechanics at
an existing external boundary; live model quality and provider access remain
separate unmet prerequisites.

## Cleanup

The runner's `finally` closes its browser, fixture and owned child process
groups using `LocalProcesses.stop()`, removes only `.convex` and `.env.local`
created after its empty-checkout guard, then checks evidence still exists. It
never resets a shared database or kills a process by name. Dependency/build
caches may remain. On normal failure the same cleanup runs and the exit is
nonzero. SIGKILL or machine loss cannot run `finally`: inspect owned processes
and saved checkout state before starting another run; use another empty checkout
rather than deleting unknown state.

## Helpers

The executable `scripts/verify.mjs` owns `run`, `production`, and `doctor` shown
above. The executable `scripts/container.sh <new-evidence-directory>` adds only
network isolation for shared-host port collisions. All driving requires a shell,
Node, and Playwright (plus Docker for this optional wrapper). Keep this map
current with `/maintain-verification-skill`; audit every feature against source
and real UI after routes, labels, guest continuity or backend contracts change.
