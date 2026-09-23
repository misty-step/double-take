/**
 * Pure, deterministic rules for Double Take.
 *
 * No model output is composed here without passing through these functions.
 * Points, gates, and validation are ordinary code so they can be tested
 * without a judge, and so a judge outage can never invent a score.
 */

export const MAX_WORDS = 12;
export const MAX_CHARS = 160;
export const MIN_CHARS = 2;
export const ROUNDS_PER_MATCH = 3;
export const MIN_PLAYERS = 2;
export const MAX_PLAYERS = 8;
/** No clock while people write; once all but one are in, the last player gets this long. */
export const LAST_PLAYER_MS = 30_000;
/** After a reveal ends, any seated player may advance if the host has not. */
export const ADVANCE_GRACE_MS = 60_000;
export const JUDGE_RATE_LIMIT = { windowMs: 10 * 60_000, max: 24 } as const;
export const MAX_JUDGE_ATTEMPTS = 3;
export const JUDGE_TIMEOUT_MS = 12_000;

export type SentenceCheck =
  | { ok: true; text: string; normalized: string; wordCount: number }
  | { ok: false; code: string; message: string };

// oxlint-disable-next-line no-control-regex -- the input boundary removes controls explicitly.
const CONTROL_CHARS = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g;

/** Treat player text as data: strip control characters, collapse whitespace. */
export function sanitizeSentence(input: string): string {
  return input.replace(CONTROL_CHARS, " ").replace(/\s+/g, " ").trim();
}

export function wordCount(text: string): number {
  const trimmed = text.trim();
  if (trimmed.length === 0) return 0;
  return trimmed.split(/\s+/).length;
}

/** Dedupe key for adjudication reuse. Case and punctuation do not matter. */
export function normalizeSentence(text: string): string {
  return text
    .toLowerCase()
    .replace(/[\u2018\u2019\u201C\u201D"'.,!?;:\u2014\u2013-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function checkSentence(input: string): SentenceCheck {
  const text = sanitizeSentence(input);
  if (text.length < MIN_CHARS)
    return {
      ok: false,
      code: "SENTENCE_EMPTY",
      message: "Write one sentence of at least two characters.",
    };
  if (text.length > MAX_CHARS)
    return {
      ok: false,
      code: "SENTENCE_TOO_LONG",
      message: `Keep the sentence under ${MAX_CHARS} characters.`,
    };
  const words = wordCount(text);
  if (words > MAX_WORDS)
    return {
      ok: false,
      code: "TOO_MANY_WORDS",
      message: `One sentence, twelve words at most. That was ${words}.`,
    };
  if (!/[a-zA-Z0-9]/.test(text))
    return { ok: false, code: "NO_LETTERS", message: "Letters, please." };
  return {
    ok: true,
    text,
    normalized: normalizeSentence(text),
    wordCount: words,
  };
}

/**
 * What Jev said about one line. `a` and `b` are the probability-weighted
 * appropriateness scores for each world (0 to 3, fractional); `coherence` is the most likely
 * coherence level (0 to 3).
 */
export type JudgedLevels = {
  a: number;
  b: number;
  coherence: number;
};

/** Why a line scored nothing. Player copy for each lives in the client. */
export type ZeroReason = "stitched" | "rejected";

export type ComposedResult = {
  /** Each world's rating as players see it, 0 to 3. */
  first: number;
  second: number;
  weaker: number;
  points: number;
  zero: ZeroReason | null;
};

/**
 * Each world's rating is Jev's weighted appropriateness score rounded to the nearest
 * level, so an even split between two levels lands between them instead of
 * on whichever the tie happens to pick. A line's points are both ratings
 * added (0 to 6). It scores nothing when it is two stitched halves, or when
 * either world finds it inappropriate: without that floor a line that suits
 * one world and is wrong in the other (3 + 0) would beat one that fits both.
 */
export function composeResult(levels: JudgedLevels): ComposedResult {
  const first = rating(levels.a);
  const second = rating(levels.b);
  const weaker = Math.min(first, second);
  const zero: ZeroReason | null =
    levels.coherence < 2 ? "stitched" : weaker < 1 ? "rejected" : null;
  return { first, second, weaker, points: zero ? 0 : first + second, zero };
}

function rating(score: number): number {
  return Math.max(0, Math.min(3, Math.round(score)));
}

/** Round order: more points first; equal points go to the more balanced line. */
export function compareLines(
  x: { points: number; weaker: number },
  y: { points: number; weaker: number },
): number {
  return y.points - x.points || y.weaker - x.weaker;
}

export function levelIndexFromScore(score: number, levelCount: number): number {
  const rounded = Math.round(score);
  return Math.max(0, Math.min(levelCount - 1, rounded));
}

/** Argmax over a probability map keyed by level index strings. */
export function levelIndexFromProbabilities(
  probabilities: Record<string, number>,
  levelCount: number,
): number | null {
  let best: number | null = null;
  let bestValue = -1;
  for (let level = 0; level < levelCount; level += 1) {
    const value = probabilities[String(level)] ?? 0;
    if (value > bestValue) {
      bestValue = value;
      best = level;
    }
  }
  return best;
}
