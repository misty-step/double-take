---
name: Double Take
version: polish-1
status: shipped
reference: synthesis/index.html
colors:
  page: "#FFFFFF"
  ink: "#000000"
  ink-2: "#595959"
  rule: "#E0E0E0"
  placeholder: "#767676"
  alert: "#B3261E"
  brand-a: "#F8DCE1"
  brand-b: "#16203A"
  brand-rose: "#F2A5B8"
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

| Rule          | Value                                                                                     | Today (`convex/rules.ts`, `convex/game.ts`)                                |
| ------------- | ----------------------------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| Table         | 2 to 8 players in a room with a 4 letter code; the creator hosts                          | Parlor rooms, 2 to 12 (cap at 8)                                           |
| Round         | Everyone gets the same pair; three rounds; no pair repeats within a game                  | `pickPair`, `ROUNDS_PER_MATCH` = 3 (keep)                                  |
| Line          | One sentence, 1 to 12 words, 160 chars; one line per player per round, final once locked  | `checkSentence` (keep); `MAX_SUBMISSIONS_PER_ROUND` = 3 becomes 1          |
| Rating        | Each world rates the line 0 to 3 (Doesn't fit, A stretch, Fits, Perfect)                  | `PLAUSIBILITY_LEVELS` (keep)                                               |
| Points        | `a + b`, 0 to 6                                                                           | replaces `PLAUSIBILITY_POINTS[min(a, b)]`                                  |
| Zero rules    | Stitched, generic, or either world at 0: the line scores 0                                | `composeResult` gates (keep order; unreadable becomes "either world at 0") |
| Round winner  | Most points; tie goes to the higher weaker world; still tied is a shared win              | new                                                                        |
| Game winner   | Most total points after three rounds; ties share the win                                  | `score` accumulation (keep)                                                |
| Clock         | None while people write. When all but one have locked in, the last player gets 30 seconds | replaces `WRITING_WINDOW_MS` = 150 s                                       |
| Judge failure | The line is not locked; the player sees the error and locks it in again                   | new client path; server retries as today                                   |

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

| Screen       | Content                                                                                                                                                                                                                                                                                                                                                                                                                             |
| ------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Home         | The game in miniature: world A, a real example line with both ratings and its points, world B; then "Two worlds, one line that fits both. A party game for 2 to 8 phones.", Start a game, Join a game. "How to play" is a text button in the header. The example cycles through four authored pairs with the reveal wipe every 5.2 s; reduced motion holds the first.                                                               |
| Name / Join  | Title; game code field with the hint "Four characters, on the host’s screen." (join only); your name; one full width action ("Starting…" / "Joining…" while busy). The field that failed is outlined in `alert` and names the error through `aria-describedby`. The right field takes focus on arrival.                                                                                                                             |
| Lobby        | "Game code" and the code set large; roster with Host tag and a "Waiting for friends to join" or "Room for N more" row; "3 players. Three rounds, about five minutes."; host alone: Invite friends (primary) and "You can start once someone joins."; host with players: Start the game, then Invite friends; guests: Invite friends and "Priya starts the game when everyone is here." Leaving is in the Menu only.                 |
| Write        | World A above, white band, world B below. Band: a seat per player (filled when locked in), the line field (grows to three lines), a status line, Lock it in. After locking: your line, "Locked in. Waiting on Sam and Jo." Last player: a 4 px bar drains across the top of the band and the status reads "You’re the last one. 24 seconds."                                                                                        |
| Reveal       | Full screen world; the header wears the current world. "Line 2 of 4"; world label; the line; world A rating; wipe to world B with the line in the same place; world B rating; then points, "3 + 2 points", the author's name, and a reason when it scored 0. A 6 adds "Double take".                                                                                                                                                |
| Round result | "Priya takes the round" (or "You and Sam tie", "Nobody scored this round"); a single winner's line as a flippable world card ("Tap to see the other world."); then every line as a ranked row: points, the line, author, and a swatch plus rating word for each world, or "Stitched together" / "One world said no" / "No line this round"; scores with this round's gain; Next round / See who won, or who the room is waiting on. |
| Final        | "You win" (or tie, or "Nobody scored") set large, "10 points over 3 rounds."; standings with shared positions; line of the game; Play again (host) or "Ada can start another game." (guests); Back to lobby.                                                                                                                                                                                                                        |

## Colors

| Token                    | Value     | Role                                                                                                     |
| ------------------------ | --------- | -------------------------------------------------------------------------------------------------------- |
| `page`                   | `#FFFFFF` | Every non-world surface                                                                                  |
| `ink`                    | `#000000` | Text, primary buttons, pips on white, locked-in seats                                                    |
| `ink-2`                  | `#595959` | Secondary text (7.0:1)                                                                                   |
| `rule`                   | `#E0E0E0` | Hairlines                                                                                                |
| `placeholder`            | `#767676` | Field placeholder (4.54:1)                                                                               |
| `alert`                  | `#B3261E` | Error text and the invalid field's outline (6.5:1); always paired with words                             |
| `world.bg` / `world.ink` | per pair  | The only color in the product; every world comes from the palette in `convex/content.ts` (7:1 or better) |

## Mark and icons

One idea everywhere: a tile split into two worlds, blush over navy, with one white speech
bubble across both. A line that belongs in both worlds. Source of truth: `lib/brand.ts`.

| Use                                | Form                                                                                                                                              | Where                                                  |
| ---------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------ |
| Browser tab                        | 16 px optical variant: deeper `brand-rose` top so the pink survives beside the white bubble and grey tabs, smaller bubble so a band of pink shows | `app/icon.tsx` (SVG)                                   |
| `favicon.ico`                      | 16 (optical), 32 and 48 (mark)                                                                                                                    | `app/favicon.ico`, written by `bun scripts/favicon.ts` |
| In-app mark, install icons 192/512 | Rounded tile, transparent corners                                                                                                                 | `MARK_SVG`; `app/app-icon/[kind]/route.tsx`            |
| iOS home screen                    | Full bleed; iOS rounds it                                                                                                                         | `app/apple-icon.tsx`                                   |
| Android maskable                   | Full bleed; bubble inside the 80% safe circle                                                                                                     | `app/app-icon/[kind]/route.tsx`                        |
| Link previews                      | The home example as a 1200x630 card: world A, the line, world B, wordmark; Newsreader                                                             | `app/opengraph-image.tsx`                              |

Everything but `favicon.ico` is generated by Next at build time from `lib/brand.ts`; the
manifest (`app/manifest.ts`) makes the game installable (Chrome reports no installability
errors).

## Typography

| Role                          | Family            | Size                                                     | Weight        |
| ----------------------------- | ----------------- | -------------------------------------------------------- | ------------- |
| The line, reveal              | Newsreader        | clamp(32, 9vw, 50) / 1.1, `text-wrap: balance`, max 20ch | 400           |
| The line, writing             | Newsreader        | clamp(24, 6.8vw, 32) / 1.2                               | 400           |
| World label, seam             | Newsreader italic | clamp(30, 9vw, 44)                                       | 400           |
| World label, reveal and cards | Newsreader italic | clamp(20, 5.4vw, 26); 18 on cards                        | 400           |
| Points                        | Newsreader        | 56 (reveal), 28 (ranked list), 22 (standings)            | 600           |
| Game code                     | Newsreader        | 64, tracked 0.12em                                       | 600           |
| Titles                        | Newsreader        | 34                                                       | 600           |
| UI                            | Libre Franklin    | 12 to 17                                                 | 400, 600, 700 |

Both OFL; ship with `next/font/google`. Fallbacks Georgia and Helvetica Neue/Arial.

## Layout

- Single column, max 30rem on white pages; worlds are full bleed.
- Header 56 px: mark and wordmark left; "Round 1 of 3", Menu, and How to play right. On
  the home screen How to play is a text button. During the flood and reveal the header
  wears the current world's colors, so the world fills the phone.
- Seam: world A, band, world B fill `100dvh - header`; worlds keep at least 76 px so both
  labels survive an open keyboard (`interactive-widget=resizes-content`; size from
  `visualViewport` on iOS).
- Home: header, then the hero (world A, band, world B) fills what the footer leaves; the
  footer (lede and two actions) is capped at 30rem and sits within thumb reach.
- Reveal: two absolutely stacked world layers with identical `1fr auto 1fr` grids; the
  points block lives only in the world B layer, below the line, so it never moves the line.
- Radii: 999 buttons, 20 dialog, 18 world cards, 12 inputs, 3 swatches.

## Components and states

| Component                           | States                                                                                                                                                                                                                                                                                                                         |
| ----------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Primary / secondary / quiet buttons | default, pressed, focus (ink ring), disabled                                                                                                                                                                                                                                                                                   |
| Seat                                | writing (outlined initial), locked in (filled), announced to screen readers                                                                                                                                                                                                                                                    |
| Seam field                          | empty, typing ("1 of 4 locked in."), near limit ("3 words left"), over ("2 words over", Lock it in disabled), locked (static line and waiting names), last ("You’re the last one. 24 seconds." with the draining bar), error ("Your line didn’t go through. Lock it in again."). The field grows to three lines, then scrolls. |
| Reveal stage                        | world A with rating, wipe, world B with rating, points; zero variants: stitched shows "Doesn’t count" in both worlds and "Two lines stitched together. It has to be one line."; rejected shows the real ratings, "3 + 0, so no points", and "One world said no, so it scores nothing."                                         |
| World card                          | flips on tap with the same wipe; aria label names both worlds                                                                                                                                                                                                                                                                  |
| Rating                              | a 12 px swatch in the world's color and the rating word; the world name for screen readers                                                                                                                                                                                                                                     |
| Ranked row                          | points, line, author, a Rating per world; or "Stitched together" (no ratings), ratings plus "One world said no", or "No line this round"                                                                                                                                                                                       |
| Invite                              | Invite friends opens the share sheet with "Play Double Take with me. Game code 377R." and the link; without a share sheet it copies the same message ("Invite copied. Paste it to your friends.")                                                                                                                              |
| Standings row                       | position (shared on ties), name, round gain, total; leader bold                                                                                                                                                                                                                                                                |

## Motion

| Moment                 | Timing                                                                                                                                                           | Purpose                                           | Reduced motion                |
| ---------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------- | ----------------------------- |
| Flood (seam to reveal) | 460 ms, cubic-bezier(.2,.8,.2,1)                                                                                                                                 | Writing ends, the room turns to the lines         | instant                       |
| Per line               | A rating at 0.7 s, wipe at 1.8 s (720 ms, cubic-bezier(.65,0,.35,1), clip-path from the bottom), B rating at 2.6 s, points and name at 3.4 s, next line at 5.4 s | The double take, then the reveal of who wrote it  | 160 ms crossfades, same holds |
| Ratings and points     | 220 ms fade and rise; points scale from .92                                                                                                                      | Result lands                                      | instant                       |
| Header tone to world B | 160 ms color change after a 560 ms delay                                                                                                                         | Follows the wipe to the top                       | instant                       |
| Last player clock      | width drains 1 s linear per tick                                                                                                                                 | The last 30 seconds, felt as well as read         | steps                         |
| Home example           | the reveal wipe (720 ms) every 5.2 s                                                                                                                             | Shows what a double take is before a word is read | holds the first example       |

About 22 seconds for a four player round. Outside the reveal, only card flips, the home
example, and the last player clock move.

## Copy

Nouns: game, round, line, world, points, host. Never: judge, model, score level, table,
press, print. Actions keep one name, and their busy form uses the same verb: Start a game
(Starting…), Join a game, Join (Joining…), Start the game, Invite friends, Lock it in
(Locking in…), Next round, See who won, Play again, Back to lobby, Leave the game, Got it.
Each zero reason has one name everywhere: "Stitched together" and "One world said no".
Apostrophes and quotes are typographic (`lib/typeset.ts` sets world names on the server
and players' lines wherever they are shown).

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

| Area                                                                                                                                   | Change                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| -------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `convex/rules.ts`                                                                                                                      | `points = zero ? 0 : a + b` where zero is stitched, generic, or `min(a, b) < 1`; delete `PLAUSIBILITY_POINTS`; tiebreak helper; `MAX_SUBMISSIONS_PER_ROUND = 1`; replace `WRITING_WINDOW_MS` with `LAST_PLAYER_MS = 30_000`.                                                                                                                                                                                                                                               |
| `convex/game.ts`                                                                                                                       | `submit`: accept once, then schedule `judge` for that submission (`ctx.scheduler.runAfter(0, ...)`) instead of the client driven judge loop. Round closes when every seated player is judged, or when the last player's clock runs out (set `lastDeadline` when all but one are in). `beginReveal`: store `revealStartedAt` and the ordered submission ids (points ascending, weaker world ascending); keep the once-only score application. Delete the host force reveal. |
| `convex/schema.ts`                                                                                                                     | `rounds`: replace `deadline` with optional `lastDeadline`, add `revealStartedAt` and `revealOrder`. `submissions.revision` goes.                                                                                                                                                                                                                                                                                                                                           |
| `convex/content.ts`                                                                                                                    | Short labels plus `bg`, `ink` per world (see the prototype deck); settings stay judge only.                                                                                                                                                                                                                                                                                                                                                                                |
| `components/double-take.tsx`                                                                                                           | Replace with `Home`, `NameForm`, `Lobby`, `Seam`, `Reveal` (clock derived), `RoundResult`, `Final`, `HowTo`, `WorldCard`. Delete solo `SoloPractice`, `PairCards`, `ScoreSummary`, `useSound`, the print copy, and the client judge polling.                                                                                                                                                                                                                               |
| `convex/solo.ts`                                                                                                                       | Removed with solo practice.                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| `lib/brand.ts`, `app/icon.tsx`, `app/apple-icon.tsx`, `app/app-icon/`, `app/manifest.ts`, `app/opengraph-image.tsx`, `app/favicon.ico` | The mark and every icon and preview (polish-1). `public/brand/` is gone.                                                                                                                                                                                                                                                                                                                                                                                                   |
| Parlor                                                                                                                                 | Unchanged: rooms, codes, presence, guest tokens, host transfer.                                                                                                                                                                                                                                                                                                                                                                                                            |

## Validation plan

1. Rules tests: sum scoring, each zero rule, tiebreak order, shared wins.
2. Game tests: one line per player per round; judge scheduled on submit; reveal waits for
   every judgment; the last player clock closes the round; a no-show scores 0.
3. Reveal sync: two clients with offset local clocks show the same line and step.
4. Rendered states at 390x844 and 1280x800, axe-core on each. polish-1 evidence: every
   state before and after (55 states), kept outside the repository at
   `~/.cache/visual-states/double-take/{before,after}`; axe found no violations on home,
   how to play, form error, lobby, writing, reveal, round result, menu, and final.
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

## Proposed user stories (operator approves; not yet in `USER_STORIES.md`)

These are proposals, unnumbered until minted. `USER_STORIES.md` holds the minted stories.

- **One prompt, whole table.** Every player in a game sees the same two worlds each
  round, labeled in four words or fewer each.
- **One line each.** Each player locks in one sentence of at most twelve words per
  round; a line the game fails to rate is not locked and the player is told to lock it in
  again.
- **Points for fitting both.** A line earns its two world ratings added together (0 to
  6), and 0 when it is stitched or rejected by either world.
- **The reveal.** After the last line locks in, every phone shows each line without its
  author, lowest to highest, in the first world, then the second world with the words in
  the same place, then its points and author, at the same moment.
- **Round and game winners.** The round goes to the most points, ties to the more
  balanced line, and the game to the most total points after three rounds.
- **Nobody holds the table.** When all but one player have locked in, the last player
  has 30 seconds; after that the round is revealed without their line.

## Polish pass lineage (polish-1)

Boards: `design/polish/`. Marks were judged at 16, 32, 48, and 120 px on white, a light
browser tab, and dark.

| Direction                                    | Verdict                                                                                                       |
| -------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| A. Seam (the previous mark)                  | Reads at 16 px but is a generic two tone card; nothing says speech                                            |
| E. Seam with a line pill                     | Reads as a text field or toggle                                                                               |
| C. Two quotes                                | Generic quote glyph                                                                                           |
| D. Take two (stacked cards)                  | Reads as the copy icon                                                                                        |
| B. Split bubble                              | Kept the bubble; its navy outline vanished on dark tabs                                                       |
| B2, B3 bubble on its own, split horizontally | Better, but the split tile app icon said more                                                                 |
| **Split tile with a white bubble**           | **Chosen**: the game in one picture; a line bar inside the bubble was dropped because it read as a minus sign |
| Home H1, the centered stack                  | Sparse; never shows what a double take is                                                                     |
| Home H3, a card hero                         | A generic card and two buttons                                                                                |
| **Home H2, the seam hero**                   | **Chosen**: the game's own screen, so the first look teaches the game                                         |

The round result went back to this spec's ranked rows; the build had drifted to one tall
card per line with a world toggle, which pushed the ranking below the fold.

## Scope honesty

Explored: home, join, lobby, writing, reveal, round result, final, how to play, error and
last player states at phone and desktop widths, with simulated tablemates. Not explored:
host transfer and late joiners (Parlor handles them today; they need the new styling),
reconnects mid reveal, spectators, 8 player density on the seat row, and real devices in
one room.
