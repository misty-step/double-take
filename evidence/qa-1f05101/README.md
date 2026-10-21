# Independent QA at 1f05101ac51c729c2e442734c231f3225f7b5843

Candidate: [PR #20](https://github.com/misty-step/double-take/pull/20), exact
HEAD `1f05101ac51c729c2e442734c231f3225f7b5843`, base master
`8085f06e29cf8bfb9a1ce9f4e4ec0f89cb6718c5`. Story: none.
Independent clone; no builder checkout or PR branch changes. UTC run date
2026-10-21, operator evening 2026-10-20. No nested agents or paid model calls.

## Finding

**ISSUES: native replay failed after a successful three-round match.**
The final native rerun completed every mapped journey successfully; the earlier
failures remain evidence that the operational walk is intermittent in this
environment. This report does not turn retries into a clean first-run PASS.
Following the shipped default shell path cold reached all three synchronized
reveals and five actual judge HTTP fixture requests, then `Play again` failed.
The real `game:start` mutation returned `NOT_ENOUGH_PRESENT_PLAYERS`; the helper
timed out at `verify.mjs:423` waiting for the writing screen. A separate doctor
still reported healthy frontend/backend during this failure.

This is an observed failure of the documented player journey, not evidence that
this skill-only diff introduced a product regression. Presence timing is a
possible explanation, not a confirmed root cause: the existing client sends at
15-second intervals and the server's `present` classification also expires after
15 seconds. The failed run's database was correctly removed by cleanup, so no
unobserved presence state is claimed. Investigate and stabilize the public replay
path; preserve the full journey rather than dropping replay or fabricating state.

Evidence: [action chronology](local/actions.json), [FAIL result](local/result.json),
[redacted observed backend error](native-failure.txt), and
[finished match before the failed click](local/match-finished-fixture.png).

## Commands and results

Node 26.12.0, pnpm 11.25.0, Playwright 1.64.1. Setup used exactly the skill's
scratch browser installation and `pnpm install --frozen-lockfile`.
Browser dependencies were not added to the product manifests or lockfile.

```sh
export PLAYWRIGHT_MODULE="$HOME/.cache/tmp/double-take-verification-browser/node_modules/playwright/index.mjs"
.agents/skills/verify-double-take/scripts/verify.mjs run evidence/qa-1f05101/local
.agents/skills/verify-double-take/scripts/verify.mjs production evidence/qa-1f05101/production
.agents/skills/verify-double-take/scripts/verify.mjs doctor local
.agents/skills/verify-double-take/scripts/verify.mjs doctor production
.agents/skills/verify-double-take/scripts/container.sh evidence/qa-1f05101/container
.agents/skills/verify-double-take/scripts/verify.mjs run evidence/qa-1f05101/native-final
pnpm test
```

- Local native: passed guest issuance, required-name/code validation, solo-host
  restriction, two-player roster, reload continuity, writing limits, missing-judge
  retry, line privacy, real 30-second deadline, matching round results and totals,
  and final standings. Failed at replay, so the subsequent lifecycle and invalid
  cookie journeys were not reached in this attempt.
- Final native rerun: [PASS](native-final/result.json),
  [complete chronology](native-final/actions.json). All five journeys completed:
  three rounds and five fixture calls; replay; guest host-controls absent; host
  end returns both players to lobby; leave and invite rejoin; host transfer;
  room close and [closed-code rejection](native-final/closed-room-rejection.png);
  [invalid-cookie recovery](native-final/invalid-continuity.png) then Start fresh;
  and stopping the real backend yielded health 503. The final match totals were
  18 and 12. This run was unchanged shipped code, with no skipped assertion or
  injected game state.
- Production shell: [PASS](production/result.json), [actions](production/actions.json).
  Health reports production release equal to the specified base master and backend
  ok. Guest issuance, mobile landing, help and changelog passed with the shipped
  write guard active. No production room or model request was made.
- Container: [FAIL](container/result.json), [actions](container/actions.json).
  Round one passed; round two failed waiting for the reveal after two fixture
  calls. The real `rooms:heartbeat` also reported a system-operations timeout.
  [Redacted observation](container-failure.txt). This second attempt therefore
  did not establish reliable full coverage either. Its underlying cause remains
  unconfirmed; this is not evidence of a production failure.
- T3 preview: independently observed `/api/guest` POST 200, usable home, help,
  changelog, and return home at 390 by 844. No horizontal document overflow was
  observed. [Home](preview/production-home.png), [help](preview/production-help.png),
  [changelog](preview/production-changelog.png). Public browser navigation also
  emitted the app's existing Sentry telemetry; request bodies were not captured.
- Safety rejection: a second native invocation against the active checkout
  exited 1. Protected local config hashes remained unchanged; the first app
  remained healthy. [Probe](safety-probe.json),
  [rejection result](reject-existing-state/result.json). Expected rejection is
  separate from the unexpected replay failure.
- Occupied-port rejection: with only a QA-owned listener on host port 3220,
  a fresh native invocation exited 1 with the exact occupied-port prerequisite.
  The listener still responded afterward, generated state was removed, and
  evidence survived. [Probe](port-rejection.json),
  [result](reject-occupied-port/result.json).
- Doctor: [native readback](doctor-local.json),
  [container readback](doctor-container.json). No browser or guest issuance is
  required by doctor; its code only reads health, instance name and local config.
- Isolation: an explicitly QA-owned host listener and the real container backend
  coexisted on port 3220 in separate namespaces.
  [Isolation observation](container-isolation.json).
- Checks: [81 tests passed](tests.log), including the existing server-side denial
  of non-host `endGame`. Helper Node syntax, shell syntax, oxlint and Prettier
  passed. All skill-relative links, executable bits and the relative Claude
  symlink resolved correctly. The full diff changes only the skill, its symlink,
  and evidence.

## Boundaries and cleanup

All game writes used synthetic names and lines against the actual disposable
Convex/Next app. Only the existing external judge HTTP boundary was replaced;
the app's normal UI, guest endpoint, mutations, subscriptions, scoring parser,
deadline and persistence paths executed. Fixture scores do not prove live Jev.

Owner sign-in is n/a: accountless guest rooms. Live Jev remains **UNPROVEN**;
exact prerequisites are explicit paid-model spending scope plus the dedicated
`workstation/OPENROUTER_MISTY_STEP_DOUBLE_TAKE_JEV_API_KEY` and dedicated-key
usage readback. The retained live-provider journey remains in the feature map.

Every completed local attempt's cleanup removed `.convex` and `.env.local`, and
retained its action/result/screenshots. The final independent
[cleanup readback](cleanup.json) confirms all three app ports closed, the owned
container removed, the QA sentinel stopped, and retained evidence. Next dev appended its
own generated guidance to AGENTS.md in this disposable clone; it is excluded
from this evidence-only branch. No product source changes are part of QA.
Artifacts contain synthetic local data or public production pages. No cookies,
tokens, storage dumps, traces, request bodies, raw server logs or real room data
are retained. Secret-pattern screening found no likely credential material in
the builder evidence or this QA evidence; screenshots were inspected separately.
