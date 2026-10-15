# Continuous frontend delivery

Status: accepted implementation proposal.

Double Take follows the [foundations](https://foundations.mistystep.io/) and the
[single release convention](https://github.com/misty-step/harness/blob/master/docs/release-convention.md).
This decision records only local boundaries.

The Cloudflare frontend is one deployable unit. The existing CI owns its only
production promotion path: Node 22.23.2, pnpm 11.25.0, frozen lockfile, existing
checks, one finalized production bundle, immutable Actions artifact, isolated
Cloudflare smoke/rollback, serialized promotion and provider/HTTP readback. All
uploads use no-bundle mode; native content readback proves each module's hash.
Signing secrets remain provider-owned, and changed-secret rollback refusals are
never forced.
The shared narrow Cloudflare CD credential and the existing Sentry upload token
are repository bindings; neither is shipped in the artifact.

Convex backend deployment and retained player state are excluded from frontend
promotion/rollback. No schema or backend code changes in this adoption. A Worker
rollback selects an existing provider version and does not restore data.

The repository currently has no required checks or branch protection. Per the
owner's decision, this adoption does not add protection or bypass settings:
record exact-head CI and independent review before squash merging. A final
current-master read prevents an older completed build from replacing newer code.

SPEC.md is absent. USER_STORIES.md contains an explicitly proposed story, not an
accepted specification. This is a recorded spec gap; the existing 79 application
tests and packaged guest/health journey are concrete coverage, not a claim of
complete specification verification. No production room or paid judge request
is needed for this frontend-only delivery change.

Semantic versioning and generated user-facing release notes are the next
independently shipped slice; this first slice changes delivery only.
