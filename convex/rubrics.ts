/**
 * Versioned, descriptive Score rubrics for the Jev adjudication.
 *
 * One request carries four independent questions about the same sentence:
 * plausibility under context A, plausibility under context B, coherence, and
 * specificity. The levels are ordered descriptions, per the TypeSafe Score
 * primitive (https://docs.typesafe.ai/primitives/score). Code — not the model —
 * composes the points in ./rules.ts.
 *
 * Bump RUBRIC_VERSION when any level text or instruction changes; retained
 * adjudications record the version that produced them.
 */

export const RUBRIC_VERSION = "double-take-rubric@2";

export const PLAUSIBILITY_LEVELS = [
  "Impossible or contradictory here — the words fight this context",
  "Strained — possible, but a reader in this context would stumble",
  "Natural — a person in this context could say exactly this",
  "Idiomatic — unmistakably at home in this context",
] as const;

export const COHERENCE_LEVELS = [
  "Two stitched fragments — each half serves a different context, joined by a comma or conjunction",
  "Fragmentary or garbled — not one sentence a person would deliberately write",
  "One coherent sentence — reads as a single deliberate line",
  "A single sentence with natural voice and rhythm",
] as const;

export const SPECIFICITY_LEVELS = [
  "Empty — would fit any context, says nothing in particular",
  "Vague — gestures at meaning without landing on anything",
  "Concrete — clearly about something in the situation",
  "Vivid — precise, memorable, committed",
] as const;

export type Context = { label: string; setting: string };
export type Pair = {
  key: string;
  title: string;
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

export function buildQuestions(pair: Pair): Record<string, JudgeQuestion> {
  return {
    plausibility_a: {
      type: "score",
      instructions: {
        question:
          "Read `sentence` as if the only context that existed were `context_a`. How plausible is it as something said or written in that context?",
        guidance:
          "Judge this reading alone. Do not reward the sentence for also fitting `context_b`. A reader who knows only context A must find the line natural. Impossible is a strong verdict: use it only when the words fight this context under every reasonable delivery. If a natural delivery — sincere, menacing, or sardonic — could say the line here, the reading is at least Strained.",
      },
      criteria: PLAUSIBILITY_LEVELS,
    },
    plausibility_b: {
      type: "score",
      instructions: {
        question:
          "Read `sentence` as if the only context that existed were `context_b`. How plausible is it as something said or written in that context?",
        guidance:
          "Judge this reading alone. Do not reward the sentence for also fitting `context_a`. A reader who knows only context B must find the line natural. Impossible is a strong verdict: use it only when the words fight this context under every reasonable delivery. If a natural delivery — sincere, menacing, or sardonic — could say the line here, the reading is at least Strained.",
      },
      criteria: PLAUSIBILITY_LEVELS,
    },
    coherence: {
      type: "score",
      instructions: {
        question:
          "Is `sentence` one coherent sentence, or two independent clauses stitched together so that each half serves a different context?",
        guidance:
          "Stitched: the two halves would not be said together by anyone, and each half works in only one context — a different context for each half. A comma or conjunction does not make two sentences one. Clauses that both work in the same context are one sentence, not stitching.",
      },
      criteria: COHERENCE_LEVELS,
    },
    specificity: {
      type: "score",
      instructions: {
        question: "How much does `sentence` commit to concrete meaning?",
        guidance:
          "A generic line (for example: 'we need to talk') fits every context and therefore means nothing in any. Judge commitment, not grammar.",
      },
      criteria: SPECIFICITY_LEVELS,
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
    questions: buildQuestions(pair),
  };
}
