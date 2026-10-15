# Generated frontend releases

Status: accepted implementation proposal.

The frontend adopts the [single release convention](https://github.com/misty-step/harness/blob/master/docs/release-convention.md)
and [foundations](https://foundations.mistystep.io/). The Convex backend remains
outside this frontend release unit and its code/data lifecycle is unchanged.

There are no existing tags or GitHub Releases. We deliberately choose 0.1.0 as
this adoption's starting baseline, at reviewed delivery commit
`a5526d63fc1be4499ce4ea8f4c87e42d01c0eeda`; this is not inferred historical
release evidence and does not fabricate or retag a previous release. The
manifest seed and bootstrap SHA record that one-time decision. The first
user-facing feature earns 0.2.0; the generator's default breaking policy takes
0.x to 1.0.0, proven with the actual pinned engine.

There is one generator: release-please-action v5.0.0 at full SHA
`45996ed1f6d02564a971a2fa1b5860e934307cf7` (bundled release-please 17.6.0), Node
strategy. It owns package.json version, the manifest, CHANGELOG.md, immutable
tags and GitHub Release notes. No second notes file or browser GitHub API exists.
The static /changelog renders the serving revision's CHANGELOG.md with the
existing type system; navigation is on the home screen, never a one-tap exit
from a room. Health imports the same package version beside the exact SHA.

Metadata automation follows successful default-branch CI, separately from CD,
and rejects superseded source or a missing baseline commit. The existing
GH_RELEASE_TOKEN may open ordinary CI-triggering release PRs; GITHUB_TOKEN is
its native fallback, with exact-head native-run approval by the merging agent
where GitHub requires it. No new credential or default-branch bypass is used.
Generated-only PRs merge after exact-head CI and an agent version/notes readback,
without a second code-review ceremony. Squash merging explicitly uses the PR
title and an empty body; repository branch-protection settings remain unchanged
under the existing owner decision in ADR001.

SPEC.md remains missing, and USER_STORIES.md remains explicitly proposed. This
adoption does not invent accepted gameplay stories or claim complete spec QA.
