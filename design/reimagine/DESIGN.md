---
name: Double Take
version: reimagine-2
status: proposed
reference: synthesis/index.html
colors:
  page: "#FFFFFF"
  ink: "#000000"
  ink-2: "#595959"
  rule: "#E0E0E0"
  placeholder: "#767676"
  brand-a: "#F8DCE1"
  brand-b: "#16203A"
typography:
  line:
    family: Newsreader
    size: clamp(32px, 9vw, 50px)
    weight: 400
    lineHeight: 1.1
  label:
    family: Newsreader
    style: italic
    size: clamp(30px, 9vw, 44px)
    weight: 400
  points:
    family: Newsreader
    size: 56px
    weight: 600
  ui:
    family: Libre Franklin
    size: 16px
    weight: 600
---

# Double Take: One Line, together

## Overview

A party game for 2 to 8 people, each on their own phone. Like Apples to Apples, everyone
plays the same prompt: two very different worlds. Everyone writes one line that fits both.
Jev rates every line in each world; a line's points are both ratings added together. Lines
are revealed without names, lowest to highest, and the most points takes the round. Three
rounds, most points wins.

Rationale, rejected concepts, and QA evidence: [README.md](README.md). Clickable
reference: `synthesis/index.html`, run through `serve.ts` (three simulated players; every line judged by live Jev).

## Rules (the game contract)

| Rule | Value | Today (`convex/rules.ts`, `convex/game.ts`) |
| --- | --- | --- |
| Table | 2 to 8 players in a room with a 4 letter code; the creator hosts | Parlor rooms, 2 to 12 (cap at 8) |
| Round | Everyone gets the same pair; three rounds; no pair repeats within a game | `pickPair`, `ROUNDS_PER_MATCH` = 3 (keep) |
| Line | One sentence, 1 to 12 words, 160 chars; one line per player per round, final once locked | `checkSentence` (keep); `MAX_SUBMISSIONS_PER_ROUND` = 3 becomes 1 |
| Rating | Each world rates the line 0 to 3 (Doesn't fit, A stretch, Fits, Perfect) | `PLAUSIBILITY_LEVELS` (keep) |
| Points | `a + b`, 0 to 6 | replaces `PLAUSIBILITY_POINTS[min(a, b)]` |
| Zero rules | Stitched, generic, or either world at 0: the line scores 0 | `composeResult` gates (keep order; unreadable becomes "either world at 0") |
| Round winner | Most points; tie goes to the higher weaker world; still tied is a shared win | new |
| Game winner | Most total points after three rounds; ties share the win | `score` accumulation (keep) |
| Clock | None while people write. When all but one have locked in, the last player gets 30 seconds | replaces `WRITING_WINDOW_MS` = 150 s |
| Judge failure | The line is not locked; the player sees the error and locks it in again | new client path; server retries as today |

**Why the zero rule.** Points are a sum so the best line is the one that lands hardest in
both worlds, as asked. Without a floor, a line that is perfect in one world and impossible
in the other (3 + 0) would beat a line that is a stretch in both (1 + 1), which rewards
ignoring a world. Scoring 0 whenever either world rejects the line keeps "fits both" true.
The tiebreak (higher weaker world) makes a 3 + 3 beat nothing and a 2 + 2 beat a 3 + 1.

## Journey

```
Home ─┬─ Start a game ─▶ Name ─▶ Lobby (code, roster, Start the game)
      └─ Join a game ──▶ Code + name ─▶ Lobby (Waiting for host)
Lobby ─▶ Write (seam) ─▶ Reveal (every line, lowest to highest) ─▶ Round result
                 ▲                                                    │
                 └────────────────── Next round (host) ◀──────────────┤
                                                                      ▼
                                          Final (standings, line of the game, Play again)
```

- Lines are judged the moment they are locked in, hidden until the reveal, so the reveal
  starts as soon as the last line lands. No player ever waits on the judge in public.
- The reveal is synchronized: the server stores `revealStartedAt` and the ordered line
  list; every phone derives the current line and step from the shared clock, so the whole
  room sees each double take at the same moment.
- The host advances between rounds; everyone else sees who they are waiting on.

## Screens

| Screen | Content |
| --- | --- |
| Home | Mark, name, one sentence rule, Start a game, Join a game, How to play, "2 to 8 players, each on their own phone." |
| Name / Join | Title, game code field (join only), your name, one action. Errors: "No game with that code. Check it and try again." / "Add your name so the table knows who wrote what." |
| Lobby | "Game code" and the code set large; Copy invite link; roster with Host tag; "4 players. Three rounds, about five minutes."; host sees Start the game (disabled as "Waiting for another player"); guests see "Priya starts the game when everyone is here." |
| Write | World A above, white band, world B below. Band: a seat per player (filled when locked in), the line field, a status line, Lock it in. After locking: your line, "Locked in. Waiting on Sam and Jo." Last player: "You're the last one. 24 seconds." |
| Reveal | Full screen world. "Line 2 of 4"; world label; the line; world A rating; wipe to world B with the line in the same place; world B rating; then points, "3 + 2 points", the author's name, and a reason when it scored 0. A 6 adds "Double take". |
| Round result | "Priya takes the round" (or "You and Sam tie", "Nobody scored this round"); the winning line as a flippable world card; every line ranked with points, author, and both worlds' pips or the zero reason; scores with this round's gain; Next round / See who won (host) or who they are waiting on. |
| Final | "You win" (or tie); final standings with shared positions for ties; line of the game (highest scoring line, earliest wins ties); Play again (host), Leave the game. |

## Colors

| Token | Value | Role |
| --- | --- | --- |
| `page` | `#FFFFFF` | Every non-world surface |
| `ink` | `#000000` | Text, primary buttons, pips on white, locked-in seats |
| `ink-2` | `#595959` | Secondary text (7.0:1) |
| `rule` | `#E0E0E0` | Hairlines |
| `placeholder` | `#767676` | Field placeholder (4.54:1) |
| `world.bg` / `world.ink` | per pair | The only color in the product (every shipped pair is 14.6:1 or better) |

## Typography

| Role | Family | Size | Weight |
| --- | --- | --- | --- |
| The line, reveal | Newsreader | clamp(32, 9vw, 50) / 1.1, `text-wrap: balance`, max 20ch | 400 |
| The line, writing | Newsreader | clamp(24, 6.8vw, 32) / 1.2 | 400 |
| World label, seam | Newsreader italic | clamp(30, 9vw, 44) | 400 |
| World label, reveal and cards | Newsreader italic | clamp(20, 5.4vw, 26); 18 on cards | 400 |
| Points | Newsreader | 56 (reveal), 28 (ranked list), 22 (standings) | 600 |
| Game code | Newsreader | 64, tracked 0.12em | 600 |
| Titles | Newsreader | 34 | 600 |
| UI | Libre Franklin | 12 to 17 | 400, 600, 700 |

Both OFL; ship with `next/font/google`. Fallbacks Georgia and Helvetica Neue/Arial.

## Layout

- Single column, max 30rem on white pages; worlds are full bleed.
- Header 56 px: mark and wordmark (home) left; "Round 1 of 3" and How to play right.
- Seam: world A, band, world B fill `100dvh - header`; worlds keep at least 76 px so both
  labels survive an open keyboard (`interactive-widget=resizes-content`; size from
  `visualViewport` on iOS).
- Reveal: two absolutely stacked world layers with identical `1fr auto 1fr` grids; the
  points block lives only in the world B layer, below the line, so it never moves the line.
- Radii: 999 buttons, 20 dialog, 18 world cards, 12 inputs.

## Components and states

| Component | States |
| --- | --- |
| Primary / secondary / quiet buttons | default, pressed, focus (ink ring), disabled |
| Seat | writing (outlined initial), locked in (filled), announced to screen readers |
| Seam field | empty, typing ("1 of 4 locked in."), near limit ("3 words left"), over ("2 words over", Lock it in disabled), locked (static line and waiting names), last ("You're the last one. 24 seconds."), error ("Your line didn't go through. Lock it in again.") |
| Reveal stage | world A with rating, wipe, world B with rating, points; zero variants: stitched and generic show "Doesn't count" in both worlds, rejected shows the real ratings and "3 + 0, so no points" with "One world doesn't buy it." |
| World card | flips on tap with the same wipe; aria label names both worlds |
| Ranked row | points, line, author, two swatch plus pip groups; or "Stitched", "Too safe", "One world said no"; "No line" for players who ran out of time |
| Standings row | position (shared on ties), name, round gain, total; leader bold |

## Motion

| Moment | Timing | Purpose | Reduced motion |
| --- | --- | --- | --- |
| Flood (seam to reveal) | 460 ms, cubic-bezier(.2,.8,.2,1) | Writing ends, the room turns to the lines | instant |
| Per line | A rating at 0.7 s, wipe at 1.8 s (720 ms, cubic-bezier(.65,0,.35,1), clip-path from the bottom), B rating at 2.6 s, points and name at 3.4 s, next line at 5.4 s | The double take, then the reveal of who wrote it | 160 ms crossfades, same holds |
| Ratings and points | 220 ms fade and rise; points scale from .92 | Result lands | instant |

About 22 seconds for a four player round. Nothing animates outside the reveal and card flips.

## Copy

Nouns: game, round, line, world, points, host. Never: judge, model, score level, table,
press, print. Actions keep one name: Start a game, Join a game, Join, Start the game, Lock it
in, Next round, See who won, Play again, Leave the game, Copy invite link, Got it. Zero
reasons: "That's two lines stitched together. Make it one." / "Too safe. That would fit
anywhere." / "One world doesn't buy it."

## Accessibility

- Contrast 4.5:1 minimum for text; worlds 7:1 at authoring time.
- Visible focus everywhere; ink ring on black buttons.
- Seats and roster expose locked in or writing as text. The reveal announces each world's
  rating and the points and author through a polite live region; the inactive world layer
  is `aria-hidden`.
- Enter locks in; Escape closes How to play; 44 px minimum targets; every moment has a
  reduced-motion path.

## Implementation mapping

The existing room game already does most of this. The change is scoring, pacing, and UI.

| Area | Change |
| --- | --- |
| `convex/rules.ts` | `points = zero ? 0 : a + b` where zero is stitched, generic, or `min(a, b) < 1`; delete `PLAUSIBILITY_POINTS`; tiebreak helper; `MAX_SUBMISSIONS_PER_ROUND = 1`; replace `WRITING_WINDOW_MS` with `LAST_PLAYER_MS = 30_000`. |
| `convex/game.ts` | `submit`: accept once, then schedule `judge` for that submission (`ctx.scheduler.runAfter(0, ...)`) instead of the client driven judge loop. Round closes when every seated player is judged, or when the last player's clock runs out (set `lastDeadline` when all but one are in). `beginReveal`: store `revealStartedAt` and the ordered submission ids (points ascending, weaker world ascending); keep the once-only score application. Delete the host force reveal. |
| `convex/schema.ts` | `rounds`: replace `deadline` with optional `lastDeadline`, add `revealStartedAt` and `revealOrder`. `submissions.revision` goes. |
| `convex/content.ts` | Short labels plus `bg`, `ink` per world (see the prototype deck); settings stay judge only. |
| `components/double-take.tsx` | Replace with `Home`, `NameForm`, `Lobby`, `Seam`, `Reveal` (clock derived), `RoundResult`, `Final`, `HowTo`, `WorldCard`. Delete solo `SoloPractice`, `PairCards`, `ScoreSummary`, `useSound`, the print copy, and the client judge polling. |
| `convex/solo.ts` | Removed with solo practice. |
| `app/globals.css`, `public/brand/` | New tokens; new mark with a 16 px optical variant. |
| Parlor | Unchanged: rooms, codes, presence, guest tokens, host transfer. |

## Validation plan

1. Rules tests: sum scoring, each zero rule, tiebreak order, shared wins.
2. Game tests: one line per player per round; judge scheduled on submit; reveal waits for
   every judgment; the last player clock closes the round; a no-show scores 0.
3. Reveal sync: two clients with offset local clocks show the same line and step.
4. Rendered states (every hash state in `synthesis/index.html`) at 390x844 and 1280x800,
   plus iOS Safari with the keyboard open on the seam; axe-core on each.
5. Real online path: a four phone game against live Jev with the calibration lines.

## Do and don't

- Do keep names hidden until each line's points land.
- Do keep the line the largest thing on every reveal and still across the wipe.
- Don't show the setting text, confidence, or rule names.
- Don't reintroduce a visible countdown for everyone, revisions, or a host force reveal.
- Don't let a player's phone skip ahead in the reveal; the room watches together.

## Open questions

- Solo practice is gone. If a warm-up mode is wanted later, `finalists/solo-daily.html`
  is the recorded design.
- Two players are supported. Apples to Apples needs three because one player sits out
  as judge each round; here Jev judges, so a head-to-head game is complete. With two the
  anonymous reveal hides nothing about authorship, but the points still land last, so
  the suspense is who scored higher. Names stay last for every table size, so there is
  one reveal, not two.

## Proposed user stories (no `USER_STORIES.md` exists yet; operator approves)

- **US-001 One prompt, whole table.** Every player in a game sees the same two worlds each
  round, labeled in four words or fewer each.
- **US-002 One line each.** Each player locks in one sentence of at most twelve words per
  round; a line the game fails to rate is not locked and the player is told to lock it in
  again.
- **US-003 Points for fitting both.** A line earns its two world ratings added together
  (0 to 6), and 0 when it is stitched, generic, or rejected by either world.
- **US-004 The reveal.** After the last line locks in, every phone shows each line without
  its author, lowest to highest, in the first world, then the second world with the words
  in the same place, then its points and author, at the same moment.
- **US-005 Round and game winners.** The round goes to the most points, ties to the more
  balanced line, and the game to the most total points after three rounds.
- **US-006 Nobody holds the table.** When all but one player have locked in, the last
  player has 30 seconds; after that the round is revealed without their line.

## Scope honesty

Explored: home, join, lobby, writing, reveal, round result, final, how to play, error and
last player states at phone and desktop widths, with simulated tablemates. Not explored:
host transfer and late joiners (Parlor handles them today; they need the new styling),
reconnects mid reveal, spectators, 8 player density on the seat row, and real devices in
one room.
