# Write and lock a line

Every seated player sees the same pair and writes one line of at most twelve
words. Submitted lines stay hidden from peers until the reveal. Judge failure
allows retry without assigning a score.

## Sub-features

- `writing-start`: host starts and both phones display the same round/pair.
- `writing-limits`: empty and thirteen-word lines cannot be locked.
- `writing-private`: peers cannot see a submitted line before reveal.
- `writing-retry`: missing judge configuration yields an actionable retry.

## How to get to it (user POV)

In a two-player lobby the host chooses Start the game. Fill Your line, one
sentence, twelve words at most and choose Lock it in (Enter also submits).

## Driving it with verify.mjs

Preconditions: two seated guests; no judge configuration for the first attempt.

- **Write:** run `scripts/verify.mjs run <new-evidence-directory>` relative to
  this skill. Start the game and assert both Round 1 headings contain the same
  worlds. Require Lock it in disabled for an empty line and a thirteen-word line.
- **Retry:** press Enter on This is our verification line. With no dedicated key, require
  Lock it in again and an editable line, then doctor the still-healthy instance.
  Retain `missing-judge-retry.*`.
- **Privacy:** the same run configures a loopback judge fixture, submits a new
  host line, and confirms the guest's visible text excludes that line before
  reveal. No direct game-state setters or seeded submissions are used.

## Gotchas

- Enter submits the missing-key attempt; Lock it in submits fixture-backed lines.
- Health stays healthy when the judge is unavailable; doctor alone cannot detect it.
- The dedicated key is required; generic OPENROUTER_API_KEY cannot enable scoring.
- Fixture scores prove mechanics, not live model access or scoring quality.
