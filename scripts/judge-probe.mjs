#!/usr/bin/env node
/**
 * Live judge probe: runs the CALIBRATION deck (convex/content.ts) through the
 * real decisions endpoint with the production judge client
 * (convex/judge.ts runAdjudication), so the request, parsing, and composition
 * are exactly what the game uses. Prints only non-secret results: weighted fit
 * per world, ratings, points, and expected-versus-live verdicts. Requires
 * OPENROUTER_API_KEY, JEV_MODEL, and JEV_DECISIONS_URL in the environment.
 * Never prints the key.
 *
 *   JEV_DECISIONS_URL=https://openrouter.ai/api/alpha/decisions \
 *   JEV_MODEL=typesafe/jev-1.13 \
 *   pass-env run -e OPENROUTER_API_KEY=workstation/DOUBLETAKE_OPENROUTER_API_KEY -- \
 *   pnpm judge:probe
 *
 * Set PROBE_REPEATS=N (default 1) to judge each entry N times and observe
 * variance. Deck expectations are authored intent, not verified outputs;
 * DIVERGE lines are diagnostic signal, not failures.
 *
 * Runs under Bun (the package script judge:probe), which resolves the
 * extensionless TypeScript imports Convex modules use.
 */

import { CALIBRATION } from "../convex/content.ts";
import { pairByKey } from "../convex/deck.ts";
import { readJudgeConfig, runAdjudication } from "../convex/judge.ts";
import { RUBRIC_VERSION } from "../convex/rubrics.ts";
import { composeResult } from "../convex/rules.ts";

const config = readJudgeConfig(process.env);
const repeats = Math.max(
  1,
  Number.parseInt(process.env.PROBE_REPEATS ?? "1", 10) || 1,
);
if (!config) {
  console.error(
    "Missing JEV_DECISIONS_URL / JEV_MODEL / OPENROUTER_API_KEY in the environment.",
  );
  process.exit(2);
}

const describe = (composed) =>
  `${composed.first}+${composed.second} -> ${composed.points} pts (${composed.zero ?? "ok"})`;

console.log(
  `rubric=${RUBRIC_VERSION} model=${config.model} repeats=${repeats}`,
);
for (const [index, example] of CALIBRATION.entries()) {
  const pair = pairByKey(example.pairKey);
  if (!pair) {
    console.log(`#${index + 1} ${example.pairKey}: no such pair, skipped`);
    continue;
  }
  const expected = composeResult(example.expected);
  const live = [];
  for (let repeat = 1; repeat <= repeats; repeat += 1) {
    try {
      const draft = await runAdjudication(config, pair, example.sentence);
      live.push(draft);
    } catch (error) {
      console.log(
        `#${index + 1} "${example.sentence}" [${repeat}/${repeats}]: FAILED ${error.code ?? error.name}`,
      );
    }
  }
  const matches = live.every(
    (draft) =>
      draft.composed.first === expected.first &&
      draft.composed.second === expected.second &&
      draft.composed.zero === expected.zero,
  );
  const liveText = live
    .map(
      (draft) =>
        `fit ${draft.levels.a.toFixed(2)}/${draft.levels.b.toFixed(2)} coh${draft.levels.coherence} ${describe(draft.composed)}`,
    )
    .join(" | ");
  console.log(
    `#${index + 1} ${example.pairKey} "${example.sentence}": ${live.length === 0 ? "NO RUNS" : matches ? "MATCH" : "DIVERGE"}; expected ${describe(expected)}; live ${liveText}`,
  );
}
