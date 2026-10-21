# Double Take verification map

The maintained journey source for the accountless Convex application on master.
Start with [SKILL.md](../SKILL.md) for setup, scope, doctor and teardown.

## Baseline preconditions

- Empty disposable checkout; no `.env`, `.env.local`, or `.convex`.
- Ports 3210, 3220 and 3221 free in the selected network namespace; installed dependencies and Playwright Chromium.
- Two fresh browser contexts named Verify Host and Verify Guest, mobile 390×844.
- Source-backed cards seeded by the normal bootstrap tooling; no real records.
- Owner sign-in **n/a**: no account or owner authorization exists. Guest issuance
  and room host controls are distinct capabilities and are verified explicitly.

## Driving conventions

Run `.agents/skills/verify-double-take/scripts/verify.mjs run <new-evidence-directory>`
from the repo root. It drives all five recipes in order in one owned instance;
commands in each feature select this complete run, not independently seeded
partial states. Use `doctor local` before manual follow-up and after surprises.
The production command in SKILL.md performs only landing/help/changelog reads
and automatic guest issuance. Production game writes are outside this skill.

## Proof and skip reporting

Pair each action with an asserted visible result and retain snapshots/screenshots.
Check mutations from the second player's UI, not by inspecting DB rows. Read
`actions.json` for the action chronology and `result.json` for fixture/owner state.
Record an unmet prerequisite as UNPROVEN, with the exact command/route and
required access. Never turn a missing judge key into a fabricated passing score.
The live paid-provider journey stays in the map even when spending is unavailable.

## Features

- [Guest access and public pages](guest-access.md): automatic session, reload,
  help, changelog, mobile and invalid-cookie recovery.
- [Create and join rooms](rooms.md): names, codes, solo state and shared roster.
- [Write and lock a line](writing.md): limits, same pair, hidden lines and retry.
- [Reveal and match](reveal-match.md): deadline, scores, three rounds and replay;
  fixture proof and live Jev prerequisite are distinct.
- [Room lifecycle](room-lifecycle.md): host controls, leave/rejoin, host transfer,
  close and closed-code rejection.
