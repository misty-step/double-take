export type ReadingLevel = 0 | 1 | 2 | 3;

export type PlayerAdjudication = {
  readings: {
    first: ReadingLevel;
    second: ReadingLevel;
  };
  points: number;
  note: string;
};

type StoredAdjudication = {
  levels: {
    plausibilityA: number;
    plausibilityB: number;
    coherence: number;
    specificity: number;
  };
  points: number;
  gateMessage: string;
  [key: string]: unknown;
};

function readingLevel(value: number, field: string): ReadingLevel {
  if (!Number.isInteger(value) || value < 0 || value > 3) {
    throw new Error(`${field} must be an integer from 0 through 3`);
  }
  return value as ReadingLevel;
}

/**
 * The evaluator record is intentionally richer than the player projection.
 * Keep confidence, model, rubric, and diagnostic gates on the server.
 */
export function toPlayerAdjudication(input: StoredAdjudication): PlayerAdjudication {
  if (!Number.isFinite(input.points) || input.points < 0 || input.points > 6) {
    throw new Error("points must be a finite score from 0 through 6");
  }
  const note = input.gateMessage.trim();
  if (note.length === 0 || note.length > 240) {
    throw new Error("gateMessage must contain concise player-facing copy");
  }
  return {
    readings: {
      first: readingLevel(input.levels.plausibilityA, "plausibilityA"),
      second: readingLevel(input.levels.plausibilityB, "plausibilityB"),
    },
    points: input.points,
    note,
  };
}
