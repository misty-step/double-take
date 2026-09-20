import { describe, expect, it } from "vitest";
import {
  checkSentence,
  composeResult,
  levelIndexFromProbabilities,
  levelIndexFromScore,
  normalizeSentence,
  PLAUSIBILITY_POINTS,
  sanitizeSentence,
  wordCount,
} from "../convex/rules";

describe("sentence validation", () => {
  it("accepts a twelve-word sentence and normalizes it", () => {
    const result = checkSentence("I will love you until death takes me");
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.wordCount).toBe(8);
    expect(result.normalized).toBe("i will love you until death takes me");
  });

  it("rejects a thirteenth word", () => {
    const result = checkSentence("one two three four five six seven eight nine ten eleven twelve thirteen");
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.code).toBe("TOO_MANY_WORDS");
  });

  it("rejects empty, overlong, and letterless input", () => {
    expect(checkSentence("   ").ok).toBe(false);
    expect(checkSentence("x".repeat(200)).ok).toBe(false);
    expect(checkSentence("!!! ??? ...").ok).toBe(false);
  });

  it("strips control characters and collapses whitespace", () => {
    expect(sanitizeSentence("hello\u0000 \u0007 world\n\nagain")).toBe("hello world again");
    expect(wordCount("  a   b ")).toBe(2);
  });

  it("normalizes punctuation and case for adjudication reuse", () => {
    expect(normalizeSentence("I will love you, until death takes me!")).toBe(
      normalizeSentence("i will love you until death takes me"),
    );
  });
});

describe("weakest-reading scoring", () => {
  it("awards the weaker reading's points, not the average", () => {
    const strong = composeResult({ plausibilityA: 3, plausibilityB: 3, coherence: 3, specificity: 2 });
    expect(strong).toMatchObject({ weaker: 3, points: 6, gate: "ok" });

    const lopsided = composeResult({
      plausibilityA: 0,
      plausibilityB: 3,
      coherence: 2,
      specificity: 2,
    });
    expect(lopsided).toMatchObject({ weaker: 0, points: 0, gate: "unreadable" });

    const surviving = composeResult({
      plausibilityA: 1,
      plausibilityB: 3,
      coherence: 2,
      specificity: 2,
    });
    expect(surviving).toMatchObject({ weaker: 1, points: 1, gate: "ok" });
  });

  it("zeroes stitched independent clauses however balanced they are", () => {
    const stitched = composeResult({
      plausibilityA: 2,
      plausibilityB: 2,
      coherence: 0,
      specificity: 2,
    });
    expect(stitched).toMatchObject({ points: 0, gate: "stitched" });
    const almost = composeResult({
      plausibilityA: 2,
      plausibilityB: 2,
      coherence: 1,
      specificity: 2,
    });
    expect(almost).toMatchObject({ points: 0, gate: "stitched" });
  });

  it("zeroes generic filler that fits any context", () => {
    const generic = composeResult({
      plausibilityA: 2,
      plausibilityB: 2,
      coherence: 3,
      specificity: 0,
    });
    expect(generic).toMatchObject({ points: 0, gate: "generic" });
  });

  it("keeps the points table fixed and monotone", () => {
    expect([...PLAUSIBILITY_POINTS]).toEqual([0, 1, 3, 6]);
  });
});

describe("judge answer level mapping", () => {
  it("maps a probability-weighted score to the nearest level", () => {
    expect(levelIndexFromScore(2.52, 4)).toBe(3);
    expect(levelIndexFromScore(1.05, 4)).toBe(1);
    expect(levelIndexFromScore(-3, 4)).toBe(0);
    expect(levelIndexFromScore(99, 4)).toBe(3);
  });

  it("prefers the most probable level when probabilities exist", () => {
    expect(levelIndexFromProbabilities({ "0": 0, "1": 0.57, "2": 0.43, "3": 0 }, 4)).toBe(1);
    expect(levelIndexFromProbabilities({ "0": 0, "1": 0, "2": 0, "3": 1 }, 4)).toBe(3);
  });
});
