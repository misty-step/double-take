import { describe, expect, it } from "vitest";
import {
  PRACTICE_SCORING_UNAVAILABLE,
  SEAT_RECOVERY_UNAVAILABLE,
  SEAT_RESET_UNAVAILABLE,
  TABLE_ACTION_UNAVAILABLE,
  TABLE_SCORING_UNAVAILABLE,
  practiceFailureCopy,
} from "../lib/player-copy";

describe("player-facing recovery copy", () => {
  it("uses fixed seat recovery copy instead of reflecting setup details", () => {
    expect(SEAT_RECOVERY_UNAVAILABLE).toBe(
      "We couldn’t reach the game service. Try again in a moment.",
    );
    expect(SEAT_RESET_UNAVAILABLE).toBe(
      "We couldn’t start a fresh seat. Check your connection and try again.",
    );
    expect(
      `${SEAT_RECOVERY_UNAVAILABLE} ${SEAT_RESET_UNAVAILABLE}`,
    ).not.toMatch(/fixture|server|configured|guest issuer/i);
  });

  it("maps every judge outage to one concise, non-technical retry message", () => {
    for (const code of [
      undefined,
      "JUDGE_UNCONFIGURED",
      "JUDGE_HTTP_529",
      "JUDGE_TIMEOUT",
      "UNEXPECTED_PROVIDER_BODY",
    ]) {
      expect(practiceFailureCopy(code)).toBe(PRACTICE_SCORING_UNAVAILABLE);
    }
    expect(PRACTICE_SCORING_UNAVAILABLE).toBe(
      "Scoring is temporarily unavailable. Your line wasn’t scored. Try again in a moment.",
    );
    expect(PRACTICE_SCORING_UNAVAILABLE).not.toMatch(
      /judge|provider|server|configured|fixture/i,
    );
  });

  it("keeps actionable validation and pacing failures specific", () => {
    expect(practiceFailureCopy("SENTENCE_EMPTY")).toBe(
      "Write one sentence of at least two characters.",
    );
    expect(practiceFailureCopy("SENTENCE_TOO_LONG")).toBe(
      "Keep the sentence under 160 characters.",
    );
    expect(practiceFailureCopy("TOO_MANY_WORDS")).toBe(
      "One sentence, twelve words at most.",
    );
    expect(practiceFailureCopy("NO_LETTERS")).toBe(
      "Use at least one letter or number.",
    );
    expect(practiceFailureCopy("SLOW_DOWN")).toBe(
      "That’s a lot of tries at once. Wait a minute, then try again.",
    );
    expect(practiceFailureCopy("SESSION_INVALID")).toBe(
      "Your practice seat expired. Go back and start again.",
    );
  });

  it("keeps generic table failures free of backend terminology", () => {
    expect(TABLE_ACTION_UNAVAILABLE).toBe(
      "That didn’t go through. Check your connection and try again.",
    );
    expect(TABLE_ACTION_UNAVAILABLE).not.toMatch(
      /convex|server|mutation|action|fixture/i,
    );
    expect(TABLE_SCORING_UNAVAILABLE).toBe(
      "Scoring is temporarily unavailable. Submitted lines are safe. Try again in a moment.",
    );
    expect(TABLE_SCORING_UNAVAILABLE).not.toMatch(
      /judge|provider|server|configured|fixture/i,
    );
  });
});
