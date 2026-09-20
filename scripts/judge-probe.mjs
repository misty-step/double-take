#!/usr/bin/env node
/**
 * Live judge probe: runs the curated calibration examples through the real
 * decisions endpoint and prints only non-secret results (HTTP status, levels,
 * composed points). Requires OPENROUTER_API_KEY, JEV_MODEL, and
 * JEV_DECISIONS_URL in the environment. Never prints the key.
 *
 *   OPENROUTER_API_KEY=$(pass show ...) node scripts/judge-probe.mjs
 */

const url = process.env.JEV_DECISIONS_URL;
const model = process.env.JEV_MODEL;
const apiKey = process.env.OPENROUTER_API_KEY;
if (!url || !model || !apiKey) {
  console.error("Missing JEV_DECISIONS_URL / JEV_MODEL / OPENROUTER_API_KEY in the environment.");
  process.exit(2);
}

const PLAUSIBILITY = 4;
const LEVELS = 4;

const examples = [
  {
    name: "vow-villain / strong",
    pair: {
      contextA: { label: "Wedding vow", setting: "Said aloud at the altar, holding your partner's hands." },
      contextB: { label: "Villain monologue", setting: "Said to the hero you have finally cornered." },
    },
    sentence: "I will love you until death takes me",
  },
  {
    name: "vow-villain / stitched",
    pair: {
      contextA: { label: "Wedding vow", setting: "Said aloud at the altar, holding your partner's hands." },
      contextB: { label: "Villain monologue", setting: "Said to the hero you have finally cornered." },
    },
    sentence: "I promise to stay, and you will regret this",
  },
  {
    name: "vet-boss / generic",
    pair: {
      contextA: { label: "Veterinarian to a nervous dog", setting: "Low, calm voice in an exam room." },
      contextB: { label: "Manager in a review meeting", setting: "Serious voice across a conference table." },
    },
    sentence: "We need to talk",
  },
];

function question(kind, contextKey, label) {
  return {
    type: "score",
    instructions: {
      question:
        kind === "plausibility"
          ? `Read \`sentence\` as if the only context that existed were \`${contextKey}\`. How plausible is it as something said or written in that context?`
          : kind === "coherence"
            ? "Is `sentence` one coherent sentence, or two independent clauses stitched together?"
            : "How much does `sentence` commit to concrete meaning?",
      guidance:
        kind === "plausibility"
          ? `Judge this reading alone; the context is ${label}.`
          : kind === "coherence"
            ? "Stitched: each half only works in one context."
            : "A generic line fits every context and means nothing.",
    },
    criteria:
      kind === "plausibility"
        ? [
            "Impossible or contradictory here",
            "Strained",
            "Natural",
            "Idiomatic",
          ]
        : kind === "coherence"
          ? ["Two stitched fragments", "Fragmentary", "One coherent sentence", "A single sentence with natural voice"]
          : ["Empty", "Vague", "Concrete", "Vivid"],
  };
}

function levelFrom(answer) {
  if (!answer || answer.type !== "score") return null;
  const probabilities = answer.probabilities ?? {};
  let best = null;
  let bestValue = -1;
  for (let level = 0; level < LEVELS; level += 1) {
    const value = probabilities[String(level)] ?? 0;
    if (value > bestValue) {
      bestValue = value;
      best = level;
    }
  }
  if (best === null && typeof answer.score === "number") best = Math.round(answer.score);
  return best;
}

for (const example of examples) {
  const body = {
    model,
    state: {
      sentence: example.sentence,
      context_a: example.pair.contextA,
      context_b: example.pair.contextB,
    },
    questions: {
      plausibility_a: question("plausibility", "context_a", example.pair.contextA.label),
      plausibility_b: question("plausibility", "context_b", example.pair.contextB.label),
      coherence: question("coherence"),
      specificity: question("specificity"),
    },
  };
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
      console.log(`${example.name}: HTTP ${response.status} (${ms}ms) — body omitted`);
      continue;
    }
    const parsed = JSON.parse(text);
    const levels = {
      a: levelFrom(parsed.answers?.plausibility_a),
      b: levelFrom(parsed.answers?.plausibility_b),
      coherence: levelFrom(parsed.answers?.coherence),
      specificity: levelFrom(parsed.answers?.specificity),
    };
    console.log(
      `${example.name}: HTTP 200 (${ms}ms) model=${parsed.model} levels=${JSON.stringify(levels)}`,
    );
  } catch (error) {
    console.log(`${example.name}: FAILED — ${error.name ?? "error"}`);
  }
}
