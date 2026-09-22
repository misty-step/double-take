export const SEAT_RECOVERY_UNAVAILABLE =
  "We couldn’t reach the game service. Try again in a moment.";

export const SEAT_RESET_UNAVAILABLE =
  "We couldn’t start a fresh seat. Check your connection and try again.";

export const PRACTICE_SCORING_UNAVAILABLE =
  "Scoring is temporarily unavailable. Your line wasn’t scored. Try again in a moment.";

export const TABLE_ACTION_UNAVAILABLE =
  "That didn’t go through. Check your connection and try again.";

export const TABLE_SCORING_UNAVAILABLE =
  "Scoring is temporarily unavailable. Submitted lines are safe. Try again in a moment.";

const PRACTICE_FAILURE_COPY: Record<string, string> = {
  SENTENCE_EMPTY: "Write one sentence of at least two characters.",
  SENTENCE_TOO_LONG: "Keep the sentence under 160 characters.",
  TOO_MANY_WORDS: "One sentence, twelve words at most.",
  NO_LETTERS: "Use at least one letter or number.",
  SLOW_DOWN: "That’s a lot of tries at once. Wait a minute, then try again.",
  SESSION_INVALID: "Your practice seat expired. Go back and start again.",
  NOT_AUTHORIZED: "Your practice seat expired. Go back and start again.",
};

/** Map stable failure codes to copy; backend error text is never rendered. */
export function practiceFailureCopy(code?: string): string {
  return (code && PRACTICE_FAILURE_COPY[code]) ?? PRACTICE_SCORING_UNAVAILABLE;
}
