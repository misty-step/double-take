# Production analytics fixture exclusions

## Bounded inventory

Double Take excludes a production session only when retained evidence binds its exact ID to a named supervised runner and overlapping telemetry. The reviewed inventory covers the recovery run ending **2026-09-22T15:11:24.267Z**; it is not a complete classification of traffic before or after that cutoff.

Runner receipt: `evidence/supervised-release/recovery-2/remote-attempt-1/browser-receipt.json`

Telemetry receipt: `evidence/supervised-release/monitoring-closure/product-events-readback.json`

| Session ID                             | Rows | First event              | Last event               |
| -------------------------------------- | ---: | ------------------------ | ------------------------ |
| `55fae3b9-5265-43e4-a2d4-67324f628efb` |    1 | 2026-09-22T15:11:21.837Z | 2026-09-22T15:11:21.837Z |
| `2e990248-2d03-4784-9e16-384853487f51` |    1 | 2026-09-22T15:11:22.149Z | 2026-09-22T15:11:22.149Z |
| `j97bdehgb8bd47hdb77zw3ny2x8ewn1f`     |    6 | 2026-09-22T15:11:22.300Z | 2026-09-22T15:11:23.572Z |

Six previously listed IDs are intentionally not excluded:

- `003f32a7-a9eb-40e9-84d1-fa86dfc2e388`, `6ebee9fd-ff9c-4863-af2e-ac265bf241f8`, and `j973mwd4yh635j5nwpmmfbe5a98exxat` have exact telemetry rows but no retained named-run receipt overlapping that earlier interval.
- `d627b25a-ff94-472a-9655-45bcbfcf65b7`, `662f83c6-08b3-44fc-8690-9c27c460f584`, and `j9758vn03aw0bbtjk2ttyy2tgd8exab9` have no retained exact receipt outside the rejected manifest itself.

Rows for all six IDs, if present, remain in the unclassified population.

## Counter meaning

- `fixtureEventsExcluded` counts rows whose exact production session ID is in the evidence-backed inventory.
- `unclassifiedEventsRetained` counts all sampled production rows not in that inventory. It can contain genuine users, unproven QA sessions, or other traffic; it is not a verified-human count.
- `genuineEventsRetained` remains as a backward-compatible alias for `unclassifiedEventsRetained`. Its historical name does not strengthen the classification claim.
- Classification is read-only. It does not delete or rewrite retained event rows, and the production inventory is not applied to staging or test traffic.

## Receipt-first updates

For each future supervised production run:

1. Before emitting events, create a named runner receipt that records the run identity, newly generated session IDs, and bounded start time. Never reuse a prior session ID.
2. After the run, retain a read-only telemetry receipt showing each exact session ID, event count, and first/last event time inside the runner window.
3. Leave any session unclassified unless both receipts establish the same exact ID and overlapping window. Do not infer ownership from a timestamp or filename.
4. Append only fully bound IDs to `KNOWN_PRODUCTION_FIXTURE_SESSION_IDS`; add focused tests for every added ID, near matches, uncertain IDs, staging isolation, and unchanged source-row counts.
5. Require narrow review of the per-ID mapping and exact-head test evidence before using the updated exclusion in a report.
