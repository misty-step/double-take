# The pair deck and its Jev battery

Each round shows two worlds, and everyone writes one line that belongs in both.
The deck is the game: a pair that nobody can bridge, or that any bland line
bridges, makes a dead round. This page records how pairs are generated, how
Jev checks them, and the evidence behind each threshold.

## Deck layout

- `convex/content.ts`: the palette, the hand-authored pairs, and the
  calibration examples for the in-game rubric.
- `convex/generatedPairs.ts`: generated pairs, each naming a palette surface
  rather than raw colors, so every generated world keeps 7:1 text contrast by
  construction (`tests/content.test.ts` checks the palette and the deck).
- `convex/deck.ts`: the live deck, authored first, then generated. Server only;
  the browser receives each round's pair with the game view.

## Generation

`scripts/pairs/generate.ts` asks `google/gemini-3.8-flash` (reasoning effort
`low`; reasoning tokens were most of the cost and did not buy passes) for 8
pairs per batch. Each batch is seeded with 6 of about 100 life areas so the deck
does not collapse into weddings and villains. The prompt asks for worlds that
are recognizable kinds of speech or writing, far apart, sharing a hidden
overlap, and it asks for three probe lines per pair that belong in both.

World names may appear in at most two pairs. Every judged candidate, pass or
fail, is appended with its raw scores to `evidence/pairs/reports.jsonl`, the
deck's source of truth. The deck file is rebuilt from those records alone
(`--batches 0` only rebuilds): verdicts are recomputed from the stored scores,
so a threshold change re-gates every pair, shipped ones included, without
paying to judge again. To drop a pair, delete its record and rebuild.

The records file is the deck's only source, so the generator fails closed: a
missing records file is an error unless `--new` is passed, a malformed line is
always an error, and it refuses to write a deck smaller than the current one
(a lost history or a battery version bump) unless `--allow-shrink` is passed. Spend is read from the OpenRouter key itself, and
`--max-usd` stops the run.

## The battery (`scripts/pairs/battery.ts`, `pair-battery@2`)

| Stage       | Cost        | Checks                                                                                                                   |
| ----------- | ----------- | ------------------------------------------------------------------------------------------------------------------------ |
| Structure   | free        | key shape, 1 to 4 word names, distinct names, setting length, known surface, no dashes, playable probes, not a duplicate |
| Pair review | 1 Jev call  | each world recognizable from its name alone, distance between worlds, promise as a prompt, safe for a mixed group        |
| Playability | 3 Jev calls | each probe line scored with the production game rubric (`convex/rubrics.ts`)                                             |
| Double take | 1 Jev call  | for every probe: does its meaning turn between the worlds                                                                |

A pair passes when all of these hold:

- safe for a mixed group;
- each world recognizable at 1.8 or better (0 to 3);
- distance 1.5 or better, promise 2.0 or better;
- some probe scores 4 or more points in the game and also turns its meaning
  by 1.5 or better (the double take itself);
- at least two probes score at all, so there is more than one way in.

Passes are ranked by a quality number (promise, distance, clarity, voice, and
the best double take line); the deck file is sorted best first.

### What did not work

- **Clarity asked as "who speaks, to whom, about what".** Jev rated plain
  names like "A valentine" at 0.7. Asking whether a player would recognize the
  situation from the name fixed it (authored pairs 1.8 to 2.8, the planted
  vague world 0.3).
- **A voice gate** ("does the name call up a familiar kind of speech?"). It
  rated "A fortune cookie" 1.0 and "A corporate memo" below 1, so it rejected
  good pairs. It now only ranks.
- **Checking the turn on the top scoring probe only.** The line that fits
  both worlds best is often the blandest; it failed half of all candidates.
  The battery now checks every probe and needs one that both bridges and turns.
- **Letting the generator reason.** About 840 reasoning tokens per call made it
  roughly five times more expensive per pass than `low` effort.

## Calibration (`bun scripts/pairs/calibrate.ts`)

Authored pairs with hand written probes, plus four planted bad pairs, each
built to fail one claim. Run on 2026-09-23 against `typesafe/jev-1.13`:

| Pair                  | Result | Why                                                          |
| --------------------- | ------ | ------------------------------------------------------------ |
| 8 of 10 authored      | pass   | recognizable 2.0 to 2.8, distance 2.6 to 3.0, turn up to 2.7 |
| vet-boss              | fail   | promise 1.9, on the line                                     |
| lighthouse-voicemail  | fail   | "A lighthouse log" recognizable 1.8, on the line             |
| planted: two toasts   | fail   | distance 1.1, promise 1.3, best turn 0.8                     |
| planted: vague world  | fail   | recognizable 0.3, promise 1.9, best turn 1.3                 |
| planted: dead end     | fail   | promise 1.6                                                  |
| planted: two counters | fail   | distance 0.7, best turn 0.6                                  |

Authored pairs are not gated by the battery; the two that miss stay in the
deck because a person chose them.

## First bulk run (2026-09-23)

`pair-battery@2`, `google/gemini-3.8-flash` at `low` reasoning,
`typesafe/jev-1.13`.

- 1,173 candidates judged, 615 passed (52%); 603 entered the deck after the
  world reuse cap and key collisions. With the 10 authored pairs the live deck
  holds 613.
- Quality of deck entries: 7.26 to 10.49, median 8.92.
- Failures, counting every reason: world not recognizable from its name 400,
  no bridging line turns its meaning 145, worlds too close 74, no probe
  bridges 53, only one way to score 45, name too long 20, weak prompt 6, unsafe 3.
- Cost: about $1.35 for the bulk runs, including the abandoned first attempt
  under `pair-battery@1` and its re-judge; about $0.001 per judged candidate and
  $0.002 per kept pair. Pilots and calibration added about $0.15.
- Played live: a round on "Lighthouse radio transmission / A confessional
  whisper" scored "I kept the light on for you" Perfect plus Fits for 5 points.

`design-check` flags "cookie" (fortune cookie) and "operator" (sonar
operator) in the deck as engineering vocabulary. Both are ordinary words in
context; the authored "A fortune cookie" pair carries the same finding.
