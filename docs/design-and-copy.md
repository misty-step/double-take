# Double Take design and copy — Two Impressions

## Direction

**Two Impressions** makes the game mechanic visible before a player reads the rules: one line is printed twice in deliberately offset red and blue ink. The overlap is controlled, never a glitch effect. Ink-plum is the paper; red and blue are the two readings.

- Paper: `#1b1626`
- First ink: riso red `#ff5a45`
- Second ink: riso blue `#4f6bff`
- Reading text: warm paper `#fff8e7`
- Interface: a sturdy grotesk system stack
- The line being read: a book serif stack; never monospace

Interface motion is a short print-settle transition and is removed under `prefers-reduced-motion`. Texture stays low contrast so it cannot compete with words.

## Mark

The mark is one rounded bar printed twice. It is a square, editable SVG and is not a wordmark.

- `double-take-mark-16.svg`: simplified silhouette, no registration detail, tuned for 16 px tabs.
- `double-take-mark-32.svg`: stronger offset plus two registration dots for 32 px launchers.
- `double-take-mark.svg`: 128-unit master with registration crosses for large use.
- `double-take-share.svg`: 1200 × 630 share card combining the master motif and product name.

Do not scale the large master down and call it the 16 px asset. Preserve the optical variants. Keep red first and blue second; reversing them changes the reveal language.

## Player copy

Voice: concise print-room prompts. Warm, direct, never technical.

- Premise: **One line. Two impressions. Make both read true.**
- Rule card: **Say it twice.** Read the two scenes, write one sentence, then watch the same words land both ways.
- Actions use one stable name: **Practice**, **Open a table**, **Join a table**, **Print my line**, **Second impression**, **First impression**, **Next round**, **Play again**.
- A score may name each reading’s fit and say that the weaker impression sets the score.
- Never show model names, confidence, rubric versions, schema versions, raw gates, provider errors, or backend diagnostics to players.
- Error copy says what happened and the next safe action. Codes stay in telemetry, not visible prose.

## Layout and reveal

Entrance is a print poster rather than a centered SaaS card. On wide screens the mark/premise and press controls share the sheet; on phones they stack. The reveal reserves the serif for the submitted line and labels the active state as **First impression** or **Second impression**. Both impressions remain individually reachable; the second never replaces or destroys the first.

## Maintenance checks

1. Run `pnpm design:contrast` after changing colors; normal text pairs must remain at least 4.5:1 and large/decorative ink use must not carry essential copy.
2. Capture the named visual-state manifest at mobile and desktop widths.
3. Inspect the 16 px, 32 px, and large marks on plum, light, and browser-tab backgrounds.
4. Verify served HTML contains the declared icon and share-image links.
5. Search the player component for confidence, rubric, model, and schema leakage before release.
