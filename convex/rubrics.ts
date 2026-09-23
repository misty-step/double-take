/**
 * Versioned, descriptive Score rubrics for the Jev adjudication.
 *
 * One request carries three independent questions about the same sentence:
 * would it be appropriate to say it in context A, would it be appropriate to
 * say it in context B, and is it one coherent sentence rather than two
 * stitched halves. The levels are ordered descriptions, per the TypeSafe Score
 * primitive (https://docs.typesafe.ai/primitives/score). Code, not the model,
 * composes points in ./rules.ts.
 *
 * History: rubric@2 asked about plausibility plus a separate specificity
 * check; rubric@3 asked whether a line "lands" and penalized filler. The game
 * asks one thing of each world: is this an appropriate thing to say here?
 * rubric@4 asks exactly that and nothing about novelty or genericness.
 *
 * Bump RUBRIC_VERSION when any level text or instruction changes; retained
 * adjudications record the version that produced them.
 */

export const RUBRIC_VERSION = "double-take-rubric@4";

export const APPROPRIATE_LEVELS = [
  "Inappropriate: saying this here would be wrong, jarring, or make no sense",
  "Awkward: it could be said here, but it would feel off or out of place",
  "Appropriate: a fitting thing to say here",
  "Exactly right: the right words for this moment",
] as const;

export const COHERENCE_LEVELS = [
  "Two stitched fragments: each half serves a different context, joined by a comma or conjunction",
  "Fragmentary or garbled: not one sentence a person would deliberately write",
  "One coherent sentence: reads as a single deliberate line",
  "A single sentence with natural voice and rhythm",
] as const;

/**
 * One world of a pair. `label` and `setting` are what Jev reads; changing them
 * changes judgments. `name`, `bg`, and `ink` are only what players see.
 */
export type Context = {
  label: string;
  setting: string;
  name: string;
  bg: string;
  ink: string;
};
export type Pair = {
  key: string;
  contextA: Context;
  contextB: Context;
  note?: string;
};

export type JudgeQuestion =
  | {
      type: "score";
      instructions: { question: string; guidance: string };
      criteria: readonly string[];
    }
  | {
      type: "choice";
      instructions: { question: string; guidance: string };
      criteria: Record<string, string | null>;
    };

function appropriateQuestion(side: "a" | "b"): JudgeQuestion {
  const other = side === "a" ? "b" : "a";
  return {
    type: "score",
    instructions: {
      question: `Would it be appropriate to say \`sentence\` in \`context_${side}\`? Consider who is speaking, who is listening, and what is happening.`,
      guidance: `Judge this situation alone; do not reward the line for also suiting \`context_${other}\`. Judge appropriateness only: whether these words suit this speaker, this listener, and this moment. Do not penalize a line for being common, short, simple, playful, or figurative.`,
    },
    criteria: APPROPRIATE_LEVELS,
  };
}

export function buildQuestions(): Record<string, JudgeQuestion> {
  return {
    appropriate_a: appropriateQuestion("a"),
    appropriate_b: appropriateQuestion("b"),
    coherence: {
      type: "score",
      instructions: {
        question:
          "Is `sentence` one coherent sentence, or two independent clauses stitched together so that each half serves a different context?",
        guidance:
          "Stitched: the two halves would not be said together by anyone, and each half works in only one context, a different context for each half. A comma or conjunction does not make two sentences one. Clauses that both work in the same context are one sentence, not stitching.",
      },
      criteria: COHERENCE_LEVELS,
    },
  };
}

export function buildJudgeState(pair: Pair, sentence: string) {
  return {
    sentence,
    context_a: { label: pair.contextA.label, setting: pair.contextA.setting },
    context_b: { label: pair.contextB.label, setting: pair.contextB.setting },
  };
}

/** The full request body for the decisions endpoint (TypeSafe HTTP contract). */
export function buildJudgeRequest(model: string, pair: Pair, sentence: string) {
  return {
    model,
    state: buildJudgeState(pair, sentence),
    questions: buildQuestions(),
  };
}
