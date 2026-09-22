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
export const WRITING_WINDOW_MS = 150_000;
/** One original submission plus two revisions. */
export const MAX_SUBMISSIONS_PER_ROUND = 3;
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

/** Points for the weaker reading. Deterministic table, no interpolation. */
export const PLAUSIBILITY_POINTS = [0, 1, 3, 6] as const;

export type JudgedLevels = {
  plausibilityA: number;
  plausibilityB: number;
  coherence: number;
  specificity: number;
};

export type Gate = "ok" | "stitched" | "generic" | "unreadable";

export type ComposedResult = {
  weaker: number;
  points: number;
  gate: Gate;
  gateMessage: string;
};

export const GATE_MESSAGES: Record<Gate, string> = {
  ok: "Both readings hold. The weaker one sets the points.",
  stitched:
    "Stitched halves do not count. One sentence must serve both contexts, not two clauses dividing the work.",
  generic: "The sentence fits anything, so it means nothing in particular.",
  unreadable: "One reading collapses in its context.",
};

export function composeResult(levels: JudgedLevels): ComposedResult {
  const weaker = Math.min(levels.plausibilityA, levels.plausibilityB);
  if (levels.coherence < 2)
    return {
      weaker,
      points: 0,
      gate: "stitched",
      gateMessage: GATE_MESSAGES.stitched,
    };
  if (levels.specificity < 1)
    return {
      weaker,
      points: 0,
      gate: "generic",
      gateMessage: GATE_MESSAGES.generic,
    };
  if (weaker < 1)
    return {
      weaker,
      points: 0,
      gate: "unreadable",
      gateMessage: GATE_MESSAGES.unreadable,
    };
  return {
    weaker,
    points: PLAUSIBILITY_POINTS[weaker] ?? 0,
    gate: "ok",
    gateMessage: GATE_MESSAGES.ok,
  };
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
