import { describe, expect, it } from "vitest";
import {
  checkSentence,
  compareLines,
  composeResult,
  levelIndexFromProbabilities,
  levelIndexFromScore,
  normalizeSentence,
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
    const result = checkSentence(
      "one two three four five six seven eight nine ten eleven twelve thirteen",
    );
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
    expect(sanitizeSentence("hello\u0000 \u0007 world\n\nagain")).toBe(
      "hello world again",
    );
    expect(wordCount("  a   b ")).toBe(2);
  });

  it("normalizes punctuation and case for adjudication reuse", () => {
    expect(normalizeSentence("I will love you, until death takes me!")).toBe(
      normalizeSentence("i will love you until death takes me"),
    );
  });
});

const levels = (a: number, b: number, coherence = 3) => ({ a, b, coherence });

describe("group scoring", () => {
  it("adds both worlds' ratings together", () => {
    expect(composeResult(levels(3, 3))).toEqual({
      first: 3,
      second: 3,
      weaker: 3,
      points: 6,
      zero: null,
    });
    expect(composeResult(levels(1, 3)).points).toBe(4);
  });

  it("rounds each world's weighted fit to the nearest rating", () => {
    // An even split between Filler and Fits lands on Fits, not whichever tied.
    expect(composeResult(levels(1.49, 1.59))).toMatchObject({
      first: 1,
      second: 2,
      points: 3,
    });
    expect(composeResult(levels(2.51, 0.49))).toMatchObject({
      first: 3,
      second: 0,
    });
  });

  it("lets filler score low in both worlds instead of vanishing", () => {
    const filler = composeResult(levels(1.1, 1.2));
    expect(filler).toMatchObject({ points: 2, zero: null });
    expect(filler.points).toBeLessThan(composeResult(levels(2, 2)).points);
  });

  it("scores nothing when either world rejects the line, however strong the other", () => {
    expect(composeResult(levels(0.4, 3))).toMatchObject({
      points: 0,
      zero: "rejected",
    });
    // Without the floor, 3 + 0 would beat a line that is filler in both.
    expect(composeResult(levels(1, 1)).points).toBeGreaterThan(
      composeResult(levels(3, 0)).points,
    );
  });

  it("zeroes stitched halves before anything else, however well they fit", () => {
    expect(composeResult(levels(3, 3, 1))).toMatchObject({
      points: 0,
      zero: "stitched",
    });
    expect(composeResult(levels(0, 3, 0))).toMatchObject({ zero: "stitched" });
  });

  it("ranks more points first and breaks equal points toward the balanced line", () => {
    const lines = [
      { name: "lopsided", ...composeResult(levels(3, 1)) },
      { name: "perfect", ...composeResult(levels(3, 3)) },
      { name: "balanced", ...composeResult(levels(2, 2)) },
    ];
    expect(lines.sort(compareLines).map((line) => line.name)).toEqual([
      "perfect",
      "balanced",
      "lopsided",
    ]);
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
    expect(
      levelIndexFromProbabilities({ "0": 0, "1": 0.57, "2": 0.43, "3": 0 }, 4),
    ).toBe(1);
    expect(
      levelIndexFromProbabilities({ "0": 0, "1": 0, "2": 0, "3": 1 }, 4),
    ).toBe(3);
  });
});
