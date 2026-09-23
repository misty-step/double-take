/**
 * The Jev check battery for context pairs.
 *
 * A good pair is two situations a player pictures instantly, far apart in
 * who is speaking and why, with a hidden overlap that one clever line can
 * exploit, where the same words mean something different in each. The battery
 * tests each of those claims separately; structure runs first because it is free:
 *
 * 1. Structure (free): names short and distinct, settings present, surfaces
 *    from the palette, probe lines playable, not a duplicate of a known pair.
 * 2. Pair review (1 Jev call): each world recognizable from its name,
 *    distance between them, promise as a prompt, and safety for a mixed
 *    group. Whether each world has a familiar voice only ranks: Jev scored
 *    plainly voiced worlds ("A fortune cookie") too low to gate on it.
 * 3. Playability (3 Jev calls): the generator's probe lines are judged with
 *    the production game rubric (convex/rubrics.ts). A pair passes only if a
 *    real line bridges both worlds, so no pair ships that nobody can score on.
 * 4. Double take (1 Jev call, all probes at once): a bridging line must also
 *    mean something different in each world; otherwise the pair only rewards
 *    bland overlap. The line that fits best is often the blandest, so every
 *    probe is checked, not just the top scorer.
 *
 * Thresholds live in `THRESHOLDS` and `verdict()`; docs/pairs.md records the
 * calibration run that set them.
 */

import { PALETTE, type Surface } from "../../convex/content";
import { PAIRS } from "../../convex/deck";
import {
  type JudgeConfig,
  parseScoreAnswer,
  requestDecision,
  runAdjudication,
} from "../../convex/judge";
import type { Pair } from "../../convex/rubrics";
import { checkSentence, normalizeSentence } from "../../convex/rules";

export const BATTERY_VERSION = "pair-battery@2";

/** A generated pair before it is resolved to colors and written to the deck. */
export type CandidateWorld = {
  label: string;
  setting: string;
  name: string;
  surface: Surface;
};
export type Candidate = {
  key: string;
  a: CandidateWorld;
  b: CandidateWorld;
  /** Lines the generator believes bridge both worlds; judged, never shown to players. */
  probes: string[];
};

const CLARITY_LEVELS = [
  "No idea what situation this is",
  "A rough idea, but players would picture different things",
  "Most players would picture the same situation",
  "Everyone recognizes it instantly and can hear how it sounds",
] as const;
const VOICE_LEVELS = [
  "No: it names an activity, place, or object, not something anyone says",
  "Loosely: someone might say something there, but it has no familiar voice",
  "Yes: a familiar kind of thing people say or write",
  "Unmistakable: everyone can already hear how it sounds",
] as const;
const DISTANCE_LEVELS = [
  "Nearly the same situation: same kind of speaker, purpose, and tone",
  "Related: different, but close in purpose or tone",
  "Different: different speakers, relationships, and purposes",
  "Opposites: the tones and purposes pull against each other",
] as const;
const PROMISE_LEVELS = [
  "Dead end: no sentence could honestly belong in both",
  "Flat: a bridge exists but only through bland, empty words",
  "Promising: a clever line could belong in both",
  "Delightful: players will enjoy hunting for the line that fits both",
] as const;
const TURN_LEVELS = [
  "Same meaning in both",
  "A slight shift in tone",
  "A clear shift: the words do a different job in each",
  "A complete turn: the same words mean something opposite or surprising",
] as const;

export const THRESHOLDS = {
  clarity: 1.8,
  distance: 1.5,
  promise: 2,
  turn: 1.5,
  /** The best probe must score this many points (both worlds, not stitched). */
  bridgePoints: 4,
  /** How many probes must score at all: more than one way in. */
  scoringProbes: 2,
} as const;

export type StructureIssue = string;

function words(text: string) {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

const fingerprint = (a: string, b: string) =>
  [normalizeSentence(a), normalizeSentence(b)].sort().join(" | ");

/** Free checks. Returns every problem so a report shows them all at once. */
export function checkStructure(
  candidate: Candidate,
  known: readonly Pick<Pair, "key" | "contextA" | "contextB">[] = PAIRS,
): StructureIssue[] {
  const issues: StructureIssue[] = [];
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(candidate.key))
    issues.push("key must be lowercase words joined by hyphens");
  if (known.some((pair) => pair.key === candidate.key))
    issues.push("key already used");
  for (const side of ["a", "b"] as const) {
    const world = candidate[side];
    if (words(world.name) < 1 || words(world.name) > 4)
      issues.push(`${side}: name must be 1 to 4 words`);
    if (world.label.trim().length < 3) issues.push(`${side}: label missing`);
    if (world.setting.trim().length < 20 || world.setting.length > 180)
      issues.push(`${side}: setting must be 20 to 180 characters`);
    if (!(world.surface in PALETTE))
      issues.push(`${side}: unknown surface ${world.surface}`);
    if (/[\u2013\u2014]/.test(`${world.name} ${world.label} ${world.setting}`))
      issues.push(`${side}: no dashes in player copy (design-check)`);
  }
  if (
    normalizeSentence(candidate.a.name) === normalizeSentence(candidate.b.name)
  )
    issues.push("the two worlds share a name");
  const mine = fingerprint(candidate.a.name, candidate.b.name);
  if (
    known.some(
      (pair) => fingerprint(pair.contextA.name, pair.contextB.name) === mine,
    )
  )
    issues.push("duplicates a known pair");
  if (candidate.probes.length < 3) issues.push("needs three probe lines");
  for (const probe of candidate.probes)
    if (!checkSentence(probe).ok) issues.push(`probe not playable: ${probe}`);
  return issues;
}

export function toPair(candidate: Candidate): Pair {
  const world = (side: CandidateWorld) => ({
    label: side.label.trim(),
    setting: side.setting.trim(),
    name: side.name.trim(),
    ...PALETTE[side.surface],
  });
  return {
    key: candidate.key,
    contextA: world(candidate.a),
    contextB: world(candidate.b),
  };
}

type Question = {
  type: "score" | "choice";
  instructions: { question: string; guidance: string };
  criteria: readonly string[] | Record<string, string>;
};

function reviewRequest(model: string, pair: Pair) {
  const world = (side: "a" | "b"): Question => ({
    type: "score",
    instructions: {
      question: `Would a player who sees only \`context_${side}.name\` recognize the situation?`,
      guidance: `Players see only the short name on a card. \`context_${side}.setting\` is what it is meant to evoke. Judge whether the name alone calls up a familiar, recognizable kind of moment, not whether every detail comes through.`,
    },
    criteria: CLARITY_LEVELS,
  });
  const voice = (side: "a" | "b"): Question => ({
    type: "score",
    instructions: {
      question: `Does \`context_${side}.name\` name a familiar kind of thing people say or write, like a wedding vow, hold music, a ransom note, or a pep talk?`,
      guidance:
        "Players must write words that could be said there, so each world needs a recognizable voice. An activity or a scene with no typical words scores low.",
    },
    criteria: VOICE_LEVELS,
  });
  const questions: Record<string, Question> = {
    clear_a: world("a"),
    clear_b: world("b"),
    voice_a: voice("a"),
    voice_b: voice("b"),
    distance: {
      type: "score",
      instructions: {
        question:
          "How different are the two situations in speaker, relationship, purpose, and tone?",
        guidance:
          "Players must write one line that belongs in both. Situations that are too close make that trivial.",
      },
      criteria: DISTANCE_LEVELS,
    },
    promise: {
      type: "score",
      instructions: {
        question:
          "In a party game where everyone writes one sentence that would be appropriate to say in both situations, how good a prompt is this pair?",
        guidance:
          "The best pairs are far apart yet share a hidden overlap (a promise, a warning, a goodbye, an instruction) that a clever line can exploit.",
      },
      criteria: PROMISE_LEVELS,
    },
    safe: {
      type: "choice",
      instructions: {
        question:
          "Is this pair fine as a prompt in a party game for a mixed group of adults and teenagers?",
        guidance:
          "Dark or dramatic themes played for fun are fine. Flag only real people, sexual content, graphic violence, self-harm, or anything that mocks a group of people.",
      },
      criteria: {
        ok: "Fine for a mixed group",
        harmful: "Not fine for a mixed group",
      },
    },
  };
  const context = (world: Pair["contextA"]) => ({
    name: world.name,
    label: world.label,
    setting: world.setting,
  });
  return {
    model,
    state: {
      context_a: context(pair.contextA),
      context_b: context(pair.contextB),
    },
    questions,
  };
}

/** One call, one question per probe line: does its meaning turn between worlds? */
function turnRequest(model: string, pair: Pair, lines: readonly string[]) {
  const questions: Record<string, Question> = {};
  const state: Record<string, unknown> = {
    context_a: { label: pair.contextA.label, setting: pair.contextA.setting },
    context_b: { label: pair.contextB.label, setting: pair.contextB.setting },
  };
  lines.forEach((line, index) => {
    state[`line_${index}`] = line;
    questions[`turn_${index}`] = {
      type: "score",
      instructions: {
        question: `Does \`line_${index}\` mean something different when said in \`context_a\` than when said in \`context_b\`?`,
        guidance:
          "Compare what the words do in each situation: comfort versus threat, promise versus warning, instruction versus confession. Judge the change in meaning, not how well the line fits.",
      },
      criteria: TURN_LEVELS,
    };
  });
  return { model, state, questions };
}

export type ProbeResult = {
  line: string;
  first: number;
  second: number;
  points: number;
  weaker: number;
  zero: string | null;
  /** How far the line's meaning turns between the worlds, 0 to 3. */
  turn: number;
};

export type BatteryReport = {
  key: string;
  battery: string;
  structure: StructureIssue[];
  review?: {
    clearA: number;
    clearB: number;
    voiceA: number;
    voiceB: number;
    distance: number;
    promise: number;
    safe: string;
  };
  probes?: ProbeResult[];
};

/** Run the Jev stages. Throws JudgeUnavailableError on an outage (never a pass). */
export async function runBattery(
  config: JudgeConfig,
  candidate: Candidate,
  known: readonly Pick<Pair, "key" | "contextA" | "contextB">[] = PAIRS,
): Promise<BatteryReport> {
  const report: BatteryReport = {
    key: candidate.key,
    battery: BATTERY_VERSION,
    structure: checkStructure(candidate, known),
  };
  if (report.structure.length > 0) return report;
  const pair = toPair(candidate);
  const [review, turns, ...drafts] = await Promise.all([
    requestDecision(config, reviewRequest(config.model, pair)),
    requestDecision(config, turnRequest(config.model, pair, candidate.probes)),
    ...candidate.probes.map((line) => runAdjudication(config, pair, line)),
  ]);
  const score = (key: string, levels: readonly string[]) =>
    parseScoreAnswer(review.answers[key], levels, key).score;
  const safe = review.answers.safe as { choice?: unknown } | undefined;
  report.review = {
    clearA: score("clear_a", CLARITY_LEVELS),
    clearB: score("clear_b", CLARITY_LEVELS),
    voiceA: score("voice_a", VOICE_LEVELS),
    voiceB: score("voice_b", VOICE_LEVELS),
    distance: score("distance", DISTANCE_LEVELS),
    promise: score("promise", PROMISE_LEVELS),
    safe: typeof safe?.choice === "string" ? safe.choice : "unknown",
  };
  report.probes = drafts.map((draft, index) => ({
    line: candidate.probes[index]!,
    first: draft.composed.first,
    second: draft.composed.second,
    points: draft.composed.points,
    weaker: draft.composed.weaker,
    zero: draft.composed.zero,
    turn: parseScoreAnswer(
      turns.answers[`turn_${index}`],
      TURN_LEVELS,
      `turn_${index}`,
    ).score,
  }));
  return report;
}

/** The line that best shows the pair working: fits both worlds, then turns most. */
function bestProbe(probes: readonly ProbeResult[]) {
  return [...probes].sort(
    (x, y) => y.points + y.turn - (x.points + x.turn) || y.weaker - x.weaker,
  )[0];
}

export type Verdict = { pass: boolean; reasons: string[]; quality: number };

/** Pass or fail with every reason, plus a quality number for ranking passes. */
export function verdict(report: BatteryReport): Verdict {
  const reasons = [...report.structure];
  const { review, probes } = report;
  if (!review || !probes) return { pass: false, reasons, quality: 0 };
  if (review.safe !== "ok") reasons.push("not safe for a mixed group");
  if (review.clearA < THRESHOLDS.clarity) reasons.push("world A is unclear");
  if (review.clearB < THRESHOLDS.clarity) reasons.push("world B is unclear");
  if (review.distance < THRESHOLDS.distance) reasons.push("worlds too close");
  if (review.promise < THRESHOLDS.promise) reasons.push("weak prompt");
  const bridges = probes.filter(
    (probe) => probe.points >= THRESHOLDS.bridgePoints,
  );
  const doubleTakes = bridges.filter((probe) => probe.turn >= THRESHOLDS.turn);
  if (bridges.length === 0) reasons.push("no probe line bridges both worlds");
  else if (doubleTakes.length === 0)
    reasons.push("no bridging line turns its meaning");
  if (
    probes.filter((probe) => probe.points > 0).length < THRESHOLDS.scoringProbes
  )
    reasons.push("only one way to score");
  const best = bestProbe(doubleTakes.length > 0 ? doubleTakes : probes);
  const quality =
    review.promise +
    review.distance / 2 +
    (review.clearA + review.clearB) / 4 +
    (review.voiceA + review.voiceB) / 4 +
    (best?.turn ?? 0) +
    (best?.points ?? 0) / 3;
  return {
    pass: reasons.length === 0,
    reasons,
    quality: Number(quality.toFixed(2)),
  };
}
