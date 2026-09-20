# Calibration deck reconciliation — 2026-09-20

Card: kanban t_b451e516 (tenant misty-step-parlor-games), follow-up to the
Double Take release (t_0db65fd9). This document records every decision that
reconciled the CALIBRATION deck in `convex/content.ts` with live judge
behavior, per the operator directive of 2026-09-20: test the semantic
suitability of each example; do not bless current judge output.

## Deck semantics

- Deck expectations are authored intent, not verified outputs. A divergence is
  diagnostic signal, never automatically a defect in the deck.
- Points compose deterministically in `convex/rules.ts`: the weaker reading
  maps to [0, 1, 3, 6] points, behind the stitched (coherence < 2), generic
  (specificity < 1), and unreadable (weaker < 1) gates.
- Arithmetic note: the release receipt's probe-day annotations printed the
  weaker reading's LEVEL as "points" for the A3/B3 entries (for example
  "authored 3 pts" for `I will love you until death takes me`, which composes
  to 6 authored points). This document cites composed points per rules.ts.

## Method

`scripts/judge-probe.mjs` now imports CALIBRATION from `convex/content.ts`,
the request builder from `convex/rubrics.ts`, and the composition from
`convex/rules.ts`, so the probe sends byte-identical production requests and
cannot drift from the shipped rubric. `PROBE_REPEATS=N` judges each entry N
times. Four runs, 4 repeats per entry, model `typesafe/jev-1.13` (served
`typesafe/jev-1.13-20260917`):

1. rubric@1 baseline, pre-reconciliation deck:
   `evidence/2026-09-20-calibration-probe-full-deck.txt`
2. rubric@2 experiment, pre-reconciliation deck (isolates the rubric effect):
   `evidence/2026-09-20-calibration-probe-rubric2-experiment.txt`
3. entry #8 replacement candidates:
   `evidence/2026-09-20-calibration-probe-candidates.txt`
4. rubric@2 final, reconciled deck:
   `evidence/2026-09-20-calibration-probe-reconciled.txt`

Repeats were identical per entry in nearly every run; the judge is
near-deterministic at this temperature. The release-day production readback
(16 fresh live adjudications, `t_0db65fd9` evidence) corroborates. Per-side
confidence below 0.45 marks a genuinely borderline call.

## Rubric @2 (guidance only; level texts unchanged)

Two defects in rubric@1 guidance, each probe-validated before shipping:

1. Plausibility floor. rubric@1 read trope-plausible "away" readings as
   Impossible: the villain side of `I will love you until death takes me`
   scored Impossible at confidence 0.44 with probabilities 0.52 Impossible /
   0.42 Strained, and the same model-sentence pair read Strained under the
   release-day probe's shortened guidance. The level-1 text ("possible, but a
   reader in this context would stumble") already covers such readings; the
   guidance lacked the floor. rubric@2 adds: Impossible is for words that
   fight the context under every reasonable delivery; a sincere, menacing, or
   sardonic delivery keeps the reading at least Strained.
   Effect: #1 B 0 -> 1 (8/8 under @2), side confidence 0.40 -> 0.61;
   #8-original B 1 -> 2. No gate regressions (#3 stitched and #5 generic held
   in every repeat).
2. Coherence stitching ambiguity. rubric@1 said "each half only works in one
   context". For the orbit-hold line, both halves serve the SAME context (the
   hold message), and the judge pattern-matched comma + "one context" into
   stitching at self-reported confidence 0.00. rubric@2 says each half must
   work in a DIFFERENT context, and clauses that share one context are one
   sentence.
   Effect: #6 coherence 0 -> 2 in 2 of 8 @2 repeats (partial; the residual
   comma bias is documented below, not claimed as fixed).

`RUBRIC_VERSION` is now `double-take-rubric@2`. Retained adjudications keep
`double-take-rubric@1`; new adjudications record @2. The frontend does not
import rubrics, so no Worker deploy is needed; the Convex backend must be
redeployed after review and merge, per release receipt section 7.

## Decisions per entry

### #1 vow-villain — "I will love you until death takes me" — expected B 3 -> 2

Operator question, answered: the villain reading is not genuinely implausible.
The judge was over-strict under rubric@1 — Impossible at 0.44 confidence, torn
with Strained at 0.42 — and rubric@2's floor fixes the class (now Strained,
8/8, confidence 0.61). But the deck's B3 also overshot: the villain borrows
the vow's native idiom ("until death takes me" is a "till death do us part"
variant), and a borrowed register is at home, not native. The entry's own note
says both framings "hold"; holding is Natural (2). Authored: A3/B2 -> 3 pts.
Live: 1 pt (B1, 8/8 under @2). Recorded divergence: one level on the villain
side, deck intent kept.

### #2 vow-villain — "You will never escape me now" — expected A 0 -> 1

Operator question, answered: the judge is right. The possessive-vow reading
exists ("you are stuck with me now" is a playable dark-affection register at
an altar); the words do not fight the wedding context, so Impossible
overshoots. A reader stumbles: Strained. Live agrees — A1 in 12/12 fresh
repeats across both rubrics (confidence 0.51-0.55) plus the release-day
production row. This is independent semantic agreement, not blessing. Role
change: the entry was a collapse control (0 pts); it now calibrates the
one-point floor (1 pt), a tier previously covered only by the unplayable
entry #8. B3 unchanged (the threat is natively at home; 12/12).

### #3 vow-villain — "I promise to stay, and you will regret this" — no change

Outcome matches under both rubrics: stitched gate, 0 pts, 12/12. The expected
per-side levels (A2/B2) express the author's intent — each half works
somewhere — while the judge answers the question as posed (whole sentence in
one context: A1/B2 under @2). The gate dominates; the levels are annotated in
the deck note, not rewritten.

### #4 vet-boss — "This will only hurt for a moment" — no change

Operator question, answered: genuinely borderline. The bedside register
stumbles in a conference room (Strained), yet managers do say exactly this
before bad news (Natural). The live judge wobbles identically: B1 in 10 of 12
repeats, B2 in 2, confidence 0.29-0.43. Both levels are defensible; the deck
keeps Natural as authored intent (3 pts authored; 1-3 pts live). Recorded as
an accepted divergence, not rewritten to the modal judge output.

### #5 vet-boss — "We need to talk" — expected B 2 -> 3

The boss side is the stock idiom of the bad-news meeting; Idiomatic is the
semantically correct level, and the judge agrees in every run (B3, confidence
0.73-0.76). The dog side — talking to a creature that cannot talk — is
borderline Strained/Natural; authored A2 is kept, live A1 annotated.
Composition unchanged: the specificity gate zeroes the line (0 pts, 12/12),
which is the entry's purpose.

### #6 orbit-hold — "Please hold, your call matters to us" — no change

The deck is right on coherence: the line is one hold message; both halves
serve the same context. The judge's stitched call under rubric@1 (confidence
0.00) and its residual calls under rubric@2 (stitched in 6 of 8, again at
confidence 0.00-0.02) are a comma-pattern bias, not a semantic insight.
rubric@2's disambiguation is correct even where this judge model still fails
it. Outcome is 0 pts either way (authored: collapse gate; live: mostly
stitched gate). Authored A0 is kept: the sardonic-astronaut delivery reads
Strained to the judge under @2 (A1, 8/8), but the design intent — nobody
would transmit this from a dying capsule — remains the authored claim.

### #7 menu-spell — "Tonight we feast on what remains" — expected A 3 -> 2, B 3 -> 2

The live judge is right: poetic borrowing in both registers, native to
neither. A rustic specials board says this kind of line; so does a dark
incantation; neither owns it. Natural on both sides — live A2/B2 in 12/12
fresh repeats plus the release-day production row. This also corrects the
receipt arithmetic: A3/B3 composes to 6 authored points (the receipt printed
"3"); authored is now unambiguously 3 pts, matching live.

### #8 letter-fineprint — sentence replaced

Defect: the original ("By the time you read this, it will be too late to
refuse") has 13 words; the player gate (MAX_WORDS = 12) made it unplayable —
judge-side only, as the release receipt noted. Replaced per the entry's
design role ("fine print at home; a love letter struggles — one point
survives") with:

> "You agree to everything the moment you open this" (9 words)

Probe-validated: A1/B3, coherence >= 2, specificity 2 -> 1 pt in 8/8 repeats
across the candidate run and the reconciled run (A-side confidence 0.61-0.64).
Three rejected candidates are recorded in the candidates evidence file: one
reads too comfortably as a love letter (A2 -> 3 pts), one inverts the
asymmetry (A2/B1), one collapses both sides to Strained (A1/B1). Expected
levels re-authored for the replacement: A1 (presumptive ultimatum in a love
letter), B3 (opening seals the agreement — a native fine-print clause family),
coh2, spec2 -> 1 pt.

## Residual divergences (recorded, not reconciled away)

1. #1 villain side: authored Natural (2), live Strained (1, 8/8, confidence
   0.61). The canonical double reading scores 1 pt live against 3 pts
   authored.
2. #4 boss side: authored Natural (2), live Strained (10 of 12) — the
   semantics genuinely straddle.
3. #6 coherence: authored 3, live comma-biased to stitched (6 of 8 at
   confidence <= 0.02 under @2).
4. Cosmetic one-level drift where both levels are defensible: #2 coherence
   (authored 2, live 3), #3 per-side levels (intent-expression vs
   whole-in-context), #5 A (authored 2, live 1), #8 coherence (authored 2,
   live 3 in 3 of 4).

## Follow-up candidates (not in this change)

- The six-point tier (Idiomatic on both sides) is now absent from the deck by
  honest design: no probed sentence earns it. Authoring one is real semantic
  work for a future deck-grooming pass.
- The judge's comma bias on coherence may deserve a rubric@3 iteration if
  player feedback shows false stitched gates on single-context two-clause
  lines.

## Provenance

- Rubric: `double-take-rubric@2` (guidance amended; level texts unchanged).
- Model: `typesafe/jev-1.13` (served `typesafe/jev-1.13-20260917`).
- Adjudications retain `rubricVersion`; rows before the redeploy keep @1.
- Deploy: Convex backend only, per release receipt section 7, after
  independent review, exact-head CI, and merge. No frontend deploy; the
  frontend does not import rubrics.
