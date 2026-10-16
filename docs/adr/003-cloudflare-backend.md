# ADR 003: Double Take backend on the shared Parlor Cloudflare adapter

Status: implementation in progress; not deployed or approved for cutover
Date: 2026-10-16

## Decision

Use `@parlor/cloudflare` 0.1.0, unchanged at the component revision in
`vendor/parlor/UPSTREAM.json`. Its version-1 protocol/operations contract is
[Parlor ADR 0003](https://github.com/misty-step/parlor/blob/610f57104a9eb7ece5c9b39f8e822c99a17e1596/docs/adr/0003-cloudflare-durable-object-adapter.md).
Do not copy a second runtime or change the shared schema. Keep the other Parlor
components at their existing pin: this slice is not a framework upgrade.

One SQLite Durable Object, `DoubleTakeBackend`, owns the whole deployment.
`/backend` forwards to that object; OpenNext serves other requests. The object
loads the existing game/schema/cron/HTTP modules. No app file-storage feature
requires R2 and no separate D1 store is needed. R2 is for the required encrypted
custody snapshot, not a second live database. Guest tokens remain the existing
Parlor accountless protocol; there is no OIDC provider to invent.

This first local slice leaves both public backend URLs on Convex. A newly
created object starts frozen and its admin API is disabled without the named
binding. No source change here authorizes a production deployment or a cutover.
CI, immutable artifact promotion, release generation and code rollback continue
to use the existing release owner's path; no parallel workflow was added.

## Executed local evidence

The normal app suite and the same game/product-event assertions run against the
new adapter with the installed Convex 1.45.0. The test fixture now advances fake
timers asynchronously: scheduled actions run outside the scheduler lock, and a
synchronous tick did not drain them before assertions or environment teardown.
No vendored runtime was patched to make these tests pass.

`scripts/prove-backend.mjs` runs the finalized OpenNext Worker in loopback
workerd, creates synthetic guests through the actual issuer, and uses real HTTP
and WebSocket consumers. Its HTTP judge fixture is explicit and makes no paid
request. It checks denial, continuity, concurrent idempotency, hidden writing,
judge refusal/retry, three rounds, a freeze barrier and process restart with
identical canonical table checksums. This is not a hosted preview, real-data
restore, visual acceptance or production proof. The served release label is the
base source during this uncommitted local experiment; the receipt's executable
SHA-256 binds the actual tested artifact instead of claiming an exact-head CI.

## Remaining work before cutover

- Provision physically isolated preview resources and fresh preview-only secrets
  under the scoped credential authorization. Public players remain public;
  Access guards only operator/machine surfaces, as Kaylee decided. Add and prove
  assertion verification/identity allowlists before enabling a hosted admin key;
  the adapter's bearer key alone is not the required Access identity contract.
- Hosted preview is still pending. The browser build can now select an isolated
  config through the existing build script. Health accepts `/backend/http`, and
  the Worker uses its DO binding for same-Worker health instead of self-fetching.
- Finish the candidate module-map regression, browser journeys and inspected
  screenshots, concurrency/reconnect/abuse/failure paths, cron/Sentry receipts,
  deployed point-in-time recovery drill, exact-head CI and independent review.
- Use the standing encrypted custody rule, not another request for the same
  custody decision. Keep raw records on the approved private path only. Establish
  a bounded retention/recovery objective with the accepted-data recovery owner;
  do not introduce indefinite retention of ephemeral content.
- Authenticated deployment metadata at 2026-10-16T09:22Z confirms the installed
  `abandon unattended matches` cron: every 60 seconds,
  `maintenance.js:sweepAbandoned`, latest run success and next run pending.
- Reconcile in-flight work, not just documents. Parlor's operator ZIP deliberately
  excludes `_scheduled_functions`. A paused-source snapshot can contain pending
  `judgeSubmission` actions and `closeWriting` deadlines. Blind import would
  strand pending lines or miss deadlines. `recovery:rearm` and its private HTTP
  caller now reconstruct missing judgments/deadlines in 50-document pages,
  refusing a live-job-set overflow instead of hiding a duplicate. Native/adapter
  tests prove repeated pages do not duplicate jobs or mutate user records;
  finished/inactive matches do not trigger paid judgments. The hosted re-arm and
  native-source rollback execution remain unproven. In particular the old
  deployed Convex code does not yet contain this new internal function; do not
  assume restoring equal user tables re-arms its jobs.
- Independent designer review precedes production. Preserve reviewed artifact
  identity; the dormant deployment adds a DO class, so a pre-class version is not
  assumed to be a compatible native rollback target.

## Rehearsal evidence and Access boundary (2026-10-16)

One consistent source rehearsal export was age-encrypted with plaintext only in
memory. Its ciphertext is in private R2 `doubletake-migration-custody`; exact
readback SHA-256 matches. Its 11 user tables/508 documents restore, export again
and survive a process restart in a separate loopback workerd object with every
canonical checksum and table number equal. That object stayed frozen and was
removed with its run-owned state after proof. This is not the final paused-source
export, native Convex rollback or production import. The identity is only in the
named Mirrodin pass entry `workstation/DOUBLETAKE_BACKUP_AGE_IDENTITY`.

Two real local browser guests (desktop/light preference and mobile/dark preference)
completed create/join, reload continuity, private writing, all three reveals and
the final through the finalized Worker's HTTP/WebSocket interfaces. The observed
41 browser requests contained no Convex-cloud/site origin and there were no page
errors. Inspected screenshots show usable lobby/writing/reveal/final layouts; the
product remains light despite the emulated dark preference, a pre-existing theme
gap, not a passing dark-theme claim. The judge was an explicit loopback HTTP
fixture, never paid Jev. No hosted-preview acceptance is claimed by these images.

Operator routes require both a signed Access assertion (fixed issuer, audience,
expiry, exact nonempty subject) and the backend bearer key. The same check runs
at the origin, including provider routes. Under the literal standing empty-sub
rule, Cloudflare service-token JWTs are denied: Cloudflare documents their `sub`
as empty and their machine identity as signed `common_name`. The owner decision
on that machine-identity distinction and the adopted token's production role
remain explicit questions; do not silently weaken the rule or broaden its role.
The existing preview token has been adopted by Kaylee. No further token creation
or account-token writes are permitted. Hosted acceptance/cutover remain pending.

## Single-writer recovery contract

After all proof/review, pause the source and take the final consistent snapshot
under the standing custody rule. Hash-verify the encrypted private R2 readback,
restore in non-production, and compare canonical table records, mappings, IDs,
creation times and relationships before any production import. Keep the target
frozen while importing; verify every table and outstanding-work reconciliation,
record a PITR bookmark, then hand writes to exactly that backend.

For rollback after the target has accepted a write: freeze it, wait for running
actions to quiesce, export all pages at the freeze timestamp, restore into the
still-paused Convex deployment, reconcile canonical records and outstanding
work, and only then resume the old writer and switch compatible routing. A code
rollback alone does not migrate accepted post-cutover writes. A failed step
keeps the non-authoritative writer frozen; never accept writes in both places.
Convex stays intact and recoverable. No retirement/deletion/revocation is granted
by this ADR or by the local proof.
