# Reveal and match

Players see the same reveal and scores, advance through three rounds, and play
again. Once all but one are locked in, the last player has thirty seconds.

## Sub-features

- `last-player`: idle guest reaches the real last-player deadline.
- `reveal-sync`: two phones show the same revealed lines and scores.
- `match-finish`: three rounds lead to final standings and Play again.
- `live-jev`: a previously unjudged line crosses the paid provider and scores.

## How to get to it (user POV)

Lock a line while another player writes. Watch the reveal; the host chooses
Next round, then See who won after round three, then Play again.

## Driving it with verify.mjs

Preconditions: baseline README.md; two seated guests. Fixture mode requires no
external credential or spending permission.

- **Mechanics:** run `scripts/verify.mjs run <new-evidence-directory>` relative
  to this skill. Its localhost fixture answers the existing server HTTP contract
  with synthetic 3+3 ratings. Round one leaves the second guest idle and waits
  for the real 30-second deadline. Rounds two and three submit both players.
  Compare Every line this round on both phones, capture `round-*-scores-fixture.*`,
  choose Next round/See who won and require Play again. Require five actual HTTP
  fixture calls for five distinct submitted lines. Play again opens writing.
- **Live Jev, required for provider proof:** in a separate disposable local
  checkout, first obtain explicit paid-model scope and the dedicated
  `workstation/OPENROUTER_MISTY_STEP_DOUBLE_TAKE_JEV_API_KEY` through
  `authenticated-commands`. Follow the repository README's pass-env bootstrap
  and dev commands. Using two fresh Playwright contexts, follow the same labeled
  room/writing/reveal actions above with new synthetic lines; inspect both phones
  and verify dedicated-key usage readback as described in docs/deploy.md. Retain
  action/result evidence and the provider readback with secrets and identifiers
  removed. Stop only processes started by that separate run. The default helper
  deliberately cannot enable live spending.

## Gotchas

- **UNPROVEN live Jev:** this task has no explicit model-spending permission.
  Exact unmet precondition: authorized paid-model scope plus access to the
  dedicated pass entry and its usage readback. Do not call a paid model merely
  because a key exists. Keep the real-provider journey intact.
- The local HTTP fixture replaces only the existing external judge boundary;
  it does not prove real Jev ratings, availability or production room play.
- Wait for the round list; reveal animation duration depends on line count.
- The helper tests a real last-player deadline, not wall-clock fast-forwarding.
- No model judgments or game writes run against production in this skill.
