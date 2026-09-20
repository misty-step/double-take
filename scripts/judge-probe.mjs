#!/usr/bin/env node
/**
 * Live judge probe: runs the full CALIBRATION deck (convex/content.ts) through
 * the real decisions endpoint, using the exact production request built by
 * convex/rubrics.ts and the exact composition from convex/rules.ts — the probe
 * cannot drift from what production sends. Prints only non-secret results
 * (HTTP status, levels, confidences, composed points, expected-vs-live
 * verdicts). Requires OPENROUTER_API_KEY, JEV_MODEL, and JEV_DECISIONS_URL in
 * the environment. Never prints the key.
 *
 *   OPENROUTER_API_KEY=$(pass show workstation/DOUBLETAKE_OPENROUTER_API_KEY) \
 *   JEV_DECISIONS_URL=https://openrouter.ai/api/alpha/decisions \
 *   JEV_MODEL=typesafe/jev-1.13 node scripts/judge-probe.mjs
 *
 * Set PROBE_REPEATS=N (default 1) to judge each entry N times and observe
 * variance on low-confidence sides. Deck expectations are authored intent, not
 * verified outputs; DIVERGE lines are diagnostic signal, not failures.
 *
 * Requires Node 23.6+ for native TypeScript stripping (the probe imports
 * convex modules directly); on Node 22 pass --experimental-strip-types.
 */

import { CALIBRATION, pairByKey } from "../convex/content.ts";
import { buildJudgeRequest, RUBRIC_VERSION } from "../convex/rubrics.ts";
import {
  composeResult,
  levelIndexFromProbabilities,
  levelIndexFromScore,
} from "../convex/rules.ts";

const url = process.env.JEV_DECISIONS_URL;
const model = process.env.JEV_MODEL;
const apiKey = process.env.OPENROUTER_API_KEY;
const repeats = Math.max(1, Number.parseInt(process.env.PROBE_REPEATS ?? "1", 10) || 1);
if (!url || !model || !apiKey) {
  console.error("Missing JEV_DECISIONS_URL / JEV_MODEL / OPENROUTER_API_KEY in the environment.");
  process.exit(2);
}

const LEVELS = 4;
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/** Mirrors convex/judge.ts: argmax over probabilities, then rounded score. */
function levelFrom(answer) {
  if (!answer || answer.type !== "score") return null;
  let level = levelIndexFromProbabilities(answer.probabilities ?? {}, LEVELS);
  if (level === null) level = levelIndexFromScore(answer.score ?? 0, LEVELS);
  return level;
}

function confidenceOf(answer) {
  return typeof answer?.confidence === "number" ? answer.confidence : null;
}

const results = [];

for (const [index, example] of CALIBRATION.entries()) {
  const pair = pairByKey(example.pairKey);
  if (!pair) {
    console.log(`#${index + 1} ${example.pairKey}: no such pair in PAIRS — skipped`);
    continue;
  }
  const expected = example.expected;
  const expectedComposed = composeResult({
    plausibilityA: expected.plausibilityA,
    plausibilityB: expected.plausibilityB,
    coherence: expected.coherence,
    specificity: expected.specificity,
  });
  const live = [];
  for (let repeat = 1; repeat <= repeats; repeat += 1) {
    const body = buildJudgeRequest(model, pair, example.sentence);
    const started = Date.now();
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
        body: JSON.stringify(body),
        signal: AbortSignal.timeout(15000),
      });
      const ms = Date.now() - started;
      const text = await response.text();
      if (!response.ok) {
        console.log(
          `#${index + 1} "${example.sentence}" [${repeat}/${repeats}]: HTTP ${response.status} (${ms}ms) — body omitted`,
        );
        live.push(null);
        continue;
      }
      const parsed = JSON.parse(text);
      const answers = parsed.answers ?? {};
      const levels = {
        plausibilityA: levelFrom(answers.plausibility_a),
        plausibilityB: levelFrom(answers.plausibility_b),
        coherence: levelFrom(answers.coherence),
        specificity: levelFrom(answers.specificity),
      };
      const composed =
        levels.plausibilityA === null || levels.plausibilityB === null ||
        levels.coherence === null || levels.specificity === null
          ? null
          : composeResult(levels);
      const confidences = {
        a: confidenceOf(answers.plausibility_a),
        b: confidenceOf(answers.plausibility_b),
        coherence: confidenceOf(answers.coherence),
        specificity: confidenceOf(answers.specificity),
      };
      console.log(
        `#${index + 1} ${example.pairKey} "${example.sentence}" [${repeat}/${repeats}]: ` +
        `HTTP 200 (${ms}ms) model=${parsed.model} rubric=${RUBRIC_VERSION} ` +
        `levels=A${levels.plausibilityA}/B${levels.plausibilityB}/coh${levels.coherence}/spec${levels.specificity} ` +
        (composed
          ? `-> ${composed.points} pts (${composed.gate})`
          : `-> unscorable`) +
        ` conf=[a:${confidences.a} b:${confidences.b} coh:${confidences.coherence} spec:${confidences.specificity}]`,
      );
      live.push({ levels, composed, confidences, model: parsed.model });
    } catch (error) {
      console.log(
        `#${index + 1} ${example.pairKey} "${example.sentence}" [${repeat}/${repeats}]: FAILED — ${error.name ?? "error"}`,
      );
      live.push(null);
    }
    if (repeat < repeats) await sleep(250);
  }
  const scored = live.filter(Boolean);
  results.push({ index: index + 1, example, expectedComposed, scored });
}

console.log("\n=== Expected (authored intent) vs live — per entry ===");
for (const { index, example, expectedComposed, scored } of results) {
  const expectedLevels = example.expected;
  const expectedText =
    `A${expectedLevels.plausibilityA}/B${expectedLevels.plausibilityB}/coh${expectedLevels.coherence}/spec${expectedLevels.specificity} ` +
    `-> ${expectedComposed.points} pts (${expectedComposed.gate})`;
  if (scored.length === 0) {
    console.log(`#${index} ${example.pairKey}: no usable live runs; expected ${expectedText}`);
    continue;
  }
  const levelsMatch = scored.every(({ levels }) =>
    levels.plausibilityA === expectedLevels.plausibilityA &&
    levels.plausibilityB === expectedLevels.plausibilityB &&
    levels.coherence === expectedLevels.coherence &&
    levels.specificity === expectedLevels.specificity,
  );
  const pointsMatch = scored.every(({ composed }) =>
    composed.points === expectedComposed.points,
  );
  const gatesMatch = scored.every(({ composed }) => composed.gate === expectedComposed.gate);
  const verdict =
    levelsMatch && pointsMatch && gatesMatch
      ? "MATCH"
      : `DIVERGE (levels ${levelsMatch ? "match" : "differ"}; points ${pointsMatch ? "match" : "differ"}; gate ${gatesMatch ? "match" : "differ"})`;
  const liveText = scored
    .map(({ levels, composed }) =>
      `A${levels.plausibilityA}/B${levels.plausibilityB}/coh${levels.coherence}/spec${levels.specificity} -> ${composed.points} pts (${composed.gate})`,
    )
    .join(" | ");
  console.log(
    `#${index} ${example.pairKey} "${example.sentence}": ${verdict} — ` +
    `expected ${expectedText}; live: ${liveText}`,
  );
}
