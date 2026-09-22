import { describe, expect, it } from "vitest";
import { toPlayerAdjudication } from "../lib/player-adjudication";

describe("player adjudication projection", () => {
  it("keeps only player-facing reading results and score copy", () => {
    const result = toPlayerAdjudication({
      levels: {
        plausibilityA: 3,
        plausibilityB: 2,
        coherence: 3,
        specificity: 2,
      },
      weaker: 2,
      points: 3,
      gate: "ok",
      gateMessage: "Both readings hold. The weaker one sets the points.",
      confidenceMin: 0.41,
      rubricVersion: "double-take-rubric@2",
      model: "private-model-id",
    });

    expect(result).toEqual({
      readings: { first: 3, second: 2 },
      points: 3,
      note: "Both readings hold. The weaker one sets the points.",
    });
    expect(JSON.stringify(result)).not.toMatch(/confidence|rubric|model|coherence|specificity/i);
  });

  it("fails closed when a stored level or score is outside the game contract", () => {
    expect(() =>
      toPlayerAdjudication({
        levels: { plausibilityA: 4, plausibilityB: 2, coherence: 3, specificity: 2 },
        points: 3,
        gateMessage: "Nope",
      }),
    ).toThrow(/plausibilityA/);
    expect(() =>
      toPlayerAdjudication({
        levels: { plausibilityA: 2, plausibilityB: 2, coherence: 3, specificity: 2 },
        points: Number.NaN,
        gateMessage: "Nope",
      }),
    ).toThrow(/points/);
  });
});
