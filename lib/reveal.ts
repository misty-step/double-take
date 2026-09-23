/**
 * The reveal is a shared clock, not a client animation.
 *
 * The server stores `revealStartedAt` and the ordered lines; every phone
 * derives the same line and step from its own clock, so the whole room sees
 * each double take together. The server uses the same arithmetic to know when
 * the reveal is over.
 */

/** Offsets, in milliseconds, from the start of each line's slot. */
export const REVEAL_STEPS = {
  verdictA: 700,
  wipe: 1_800,
  verdictB: 2_600,
  score: 3_400,
} as const;

/** The seam floods into the first world before line one. */
export const REVEAL_LEAD_MS = 600;
/** Time each line holds the screen. */
export const REVEAL_LINE_MS = 5_400;

export type RevealStep = "line" | keyof typeof REVEAL_STEPS;

export type RevealPosition =
  { done: false; index: number; step: RevealStep } | { done: true };

export function revealEndsAt(startedAt: number, lineCount: number): number {
  return startedAt + REVEAL_LEAD_MS + lineCount * REVEAL_LINE_MS;
}

/** Which line is on screen, and how far into it, at `now`. */
export function revealPosition(
  startedAt: number,
  lineCount: number,
  now: number,
): RevealPosition {
  const elapsed = now - startedAt - REVEAL_LEAD_MS;
  if (lineCount === 0 || now >= revealEndsAt(startedAt, lineCount))
    return { done: true };
  const index = Math.max(0, Math.floor(elapsed / REVEAL_LINE_MS));
  const offset = elapsed - index * REVEAL_LINE_MS;
  let step: RevealStep = "line";
  for (const [name, at] of Object.entries(REVEAL_STEPS) as [
    keyof typeof REVEAL_STEPS,
    number,
  ][]) {
    if (offset >= at) step = name;
  }
  return { done: false, index, step };
}
