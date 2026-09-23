/**
 * Generate context pairs, run each through the Jev battery, and keep the passes.
 *
 *   pass-env run -e OPENROUTER_API_KEY=workstation/DOUBLETAKE_OPENROUTER_API_KEY -- \
 *     env JEV_MODEL=typesafe/jev-1.13 JEV_DECISIONS_URL=https://openrouter.ai/api/alpha/decisions \
 *     bun scripts/pairs/generate.ts --batches 10 --max-usd 0.25
 *
 * Every scored candidate (pass and fail) is appended to
 * evidence/pairs/reports.jsonl (override with PAIRS_STATE), so a run can be
 * stopped and resumed. convex/generatedPairs.ts is rebuilt from those records
 * alone after every batch: verdicts are recomputed from stored scores, so a
 * retuned threshold re-gates every pair, shipped ones included. `--batches 0`
 * only rebuilds. Nothing reaches players without passing.
 */

import {
  appendFile,
  mkdir,
  readFile,
  rename,
  writeFile,
} from "node:fs/promises";
import { dirname } from "node:path";
import { AUTHORED_PAIRS, SURFACES } from "../../convex/content";
import {
  GENERATED_PAIRS,
  type GeneratedPair,
} from "../../convex/generatedPairs";
import {
  type JudgeConfig,
  JudgeUnavailableError,
  readJudgeConfig,
} from "../../convex/judge";
import { normalizeSentence } from "../../convex/rules";
import {
  BATTERY_VERSION,
  type BatteryReport,
  type Candidate,
  runBattery,
  toPair,
  verdict,
} from "./battery";

const GENERATOR_MODEL =
  process.env.PAIR_GENERATOR_MODEL ?? "google/gemini-3.8-flash";
/** Gemini reasoning tokens are most of the generator cost; "low" disables them. */
const GENERATOR_REASONING = process.env.PAIR_GENERATOR_REASONING ?? "low";
const PAIRS_PER_BATCH = 8;
/** Candidates judged at once within a batch, and batches generated at once. */
const CONCURRENCY = 8;
const BATCH_CONCURRENCY = 4;
/** A world name may appear in at most this many pairs across the deck. */
const WORLD_REUSE = 2;

const DOMAINS = [
  "weddings and romance",
  "parenting and bedtime",
  "school and teachers",
  "hospitals and medicine",
  "pets and veterinarians",
  "sports and coaching",
  "the office and bosses",
  "customer service",
  "restaurants and chefs",
  "air travel and pilots",
  "trains and road trips",
  "the sea and sailors",
  "space missions",
  "fantasy quests and wizards",
  "horror movies",
  "heist movies",
  "courtrooms and lawyers",
  "police and detectives",
  "the military and drills",
  "religion and ceremonies",
  "funerals and grief",
  "birthday parties",
  "job interviews",
  "dating apps",
  "retail and shopping",
  "banking and money",
  "real estate and moving",
  "gardening and farming",
  "weather and storms",
  "camping and the wilderness",
  "museums and tour guides",
  "theater and backstage",
  "music concerts and bands",
  "radio and podcasts",
  "news anchors",
  "politics and speeches",
  "fitness and gyms",
  "yoga and meditation",
  "cooking shows",
  "game shows",
  "video games",
  "tech support",
  "smart home devices",
  "robots and AI",
  "pirates",
  "royalty and castles",
  "superheroes",
  "spies",
  "zoos and wildlife",
  "the circus",
  "haunted houses",
  "fairy tales",
  "wine tasting",
  "coffee shops",
  "hair salons",
  "dentists",
  "libraries",
  "archaeology digs",
  "mountaineering",
  "surfing",
  "scuba diving",
  "chess tournaments",
  "art galleries",
  "fashion shows",
  "auctions",
  "lotteries and casinos",
  "insurance claims",
  "self help books",
  "therapy sessions",
  "text messages",
  "wedding planning",
  "fortune tellers",
  "magicians",
  "ghost hunting",
  "treasure maps",
  "lost and found",
  "the post office",
  "elevators",
  "airplanes in turbulence",
  "submarines",
  "volcanoes",
  "bakeries",
  "ice cream trucks",
  "babysitting",
  "grandparents",
  "roommates",
  "neighbors",
  "HOA meetings",
  "town criers",
  "medieval knights",
  "ancient Rome",
  "the Wild West",
  "cavemen",
  "time travel",
] as const;

const argv = process.argv.slice(2);
const arg = (name: string, fallback: number) => {
  const index = argv.indexOf(`--${name}`);
  return index >= 0 ? Number(argv[index + 1]) : fallback;
};
const batches = arg("batches", 1);
const maxUsd = arg("max-usd", 0.1);
/** Starting a fresh records file is explicit; otherwise a missing file is an error. */
const startNew = argv.includes("--new");
/** Writing a deck with fewer pairs than the current one is explicit too. */
const allowShrink = argv.includes("--allow-shrink");

const judgeConfig = readJudgeConfig(process.env);
const openRouterKey = process.env.OPENROUTER_API_KEY;
if (!judgeConfig || !openRouterKey)
  throw new Error("Set OPENROUTER_API_KEY, JEV_MODEL, and JEV_DECISIONS_URL.");
const config: JudgeConfig = judgeConfig;
const apiKey: string = openRouterKey;

/** The scored records are the deck's source of truth and its audit trail. */
const statePath =
  process.env.PAIRS_STATE ??
  new URL("../../evidence/pairs/reports.jsonl", import.meta.url).pathname;
const deckPath = new URL("../../convex/generatedPairs.ts", import.meta.url)
  .pathname;

/**
 * One judged candidate. Only raw scores are stored: the verdict is recomputed
 * on load, so retuning a threshold re-applies to every past candidate free.
 */
type Record_ = { candidate: Candidate; report: BatteryReport };

/**
 * Load every record. Fails closed: the records are the deck's only source, so a
 * missing (without --new), unreadable, or malformed file must never read as an
 * empty history and wipe the deck.
 */
async function loadState(): Promise<Record_[]> {
  let text: string;
  try {
    text = await readFile(statePath, "utf8");
  } catch (error) {
    if (startNew && (error as NodeJS.ErrnoException).code === "ENOENT")
      return [];
    throw new Error(
      `Cannot read ${statePath} (${(error as Error).message}). Pass --new only to start a fresh records file.`,
    );
  }
  return (
    text
      .split("\n")
      .filter(Boolean)
      .map((line, index) => {
        try {
          return JSON.parse(line) as Record_;
        } catch {
          throw new Error(`${statePath}:${index + 1} is not valid JSON.`);
        }
      })
      // Reports from another battery version have a different shape; skip them.
      .filter((record) => record.report.battery === BATTERY_VERSION)
  );
}

const EXAMPLES = AUTHORED_PAIRS.slice(0, 4)
  .map(
    (pair) =>
      `- "${pair.contextA.name}" (${pair.contextA.setting}) / "${pair.contextB.name}" (${pair.contextB.setting})`,
  )
  .join("\n");

const WORLD_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: ["label", "setting", "name", "surface"],
  properties: {
    label: {
      type: "string",
      description: "Who is speaking or writing, in a few words.",
    },
    setting: {
      type: "string",
      description:
        "One sentence under 150 characters: speaker, listener, and the moment.",
    },
    name: {
      type: "string",
      description:
        'What players see: 1 to 4 words, instantly recognizable, like "A villain\'s gloat".',
    },
    surface: { type: "string", enum: SURFACES },
  },
};

const RESPONSE_FORMAT = {
  type: "json_schema",
  json_schema: {
    name: "pairs",
    strict: true,
    schema: {
      type: "object",
      additionalProperties: false,
      required: ["pairs"],
      properties: {
        pairs: {
          type: "array",
          items: {
            type: "object",
            additionalProperties: false,
            required: ["key", "a", "b", "probes"],
            properties: {
              key: {
                type: "string",
                description: "Two or three lowercase words joined by hyphens.",
              },
              a: WORLD_SCHEMA,
              b: WORLD_SCHEMA,
              probes: {
                type: "array",
                description:
                  "Three different sentences, each under 12 words, that would be appropriate to say in both worlds.",
                items: { type: "string" },
              },
            },
          },
        },
      },
    },
  },
};

function prompt(domains: readonly string[], avoid: readonly string[]) {
  return `You write prompts for Double Take, a party game. Each round shows two situations ("worlds"). Every player writes one sentence that would be appropriate to say in both. A judge scores how well it fits each world.

Great pairs:
- Are far apart in speaker, relationship, purpose, and tone, so no bland sentence fits both.
- Share a hidden overlap a clever line can exploit (a promise, a warning, an instruction, a goodbye, a confession), so the same words mean something different in each.
- Make each world a recognizable KIND of thing people say or write, a genre of speech everyone has heard: a wedding vow, a villain's gloat, hold music, the fine print, a fortune cookie, a eulogy, a ransom note, a pilot's announcement, a pep talk, a breakup text, a museum audio guide. Not an activity or a scene ("a surf lesson", "moving a sofa"): the words themselves must have a familiar voice.
- The name is that genre in 1 to 4 plain words, recognizable at a glance with no context.
- Are fun for a mixed group: no real people, nothing sexual, no graphic violence or self-harm.

Examples of the style:
${EXAMPLES}

Write ${PAIRS_PER_BATCH} new pairs. Give each pair a different area. Draw at least one world of each pair from these areas, and cross it with anything: ${domains.join("; ")}.
Vary the tone: tender, silly, eerie, formal, urgent. Pick each world's surface color to match its mood, and give the two worlds clearly different colors (often one light, one dark).
For each pair, also write three probe sentences, each under 12 words, that honestly belong in both worlds.
Do not reuse these worlds: ${avoid.slice(-120).join("; ") || "none yet"}.`;
}

type GeneratorResult = { candidates: Candidate[] };

/** Spend so far on this key, as OpenRouter bills it (lags a few seconds). */
async function keyUsage(): Promise<number> {
  const response = await fetch("https://openrouter.ai/api/v1/key", {
    headers: { Authorization: `Bearer ${apiKey}` },
  });
  if (!response.ok) throw new Error(`key usage HTTP ${response.status}`);
  const body = (await response.json()) as { data: { usage: number } };
  return body.data.usage;
}

async function generateBatch(
  avoid: readonly string[],
): Promise<GeneratorResult> {
  const shuffled = [...DOMAINS].sort(() => Math.random() - 0.5);
  const response = await fetch(
    "https://openrouter.ai/api/v1/chat/completions",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: GENERATOR_MODEL,
        temperature: 1,
        reasoning: { effort: GENERATOR_REASONING },
        messages: [
          { role: "user", content: prompt(shuffled.slice(0, 6), avoid) },
        ],
        response_format: RESPONSE_FORMAT,
      }),
      signal: AbortSignal.timeout(120_000),
    },
  );
  if (!response.ok)
    throw new Error(
      `generator HTTP ${response.status}: ${await response.text()}`,
    );
  const body = (await response.json()) as {
    choices: { message: { content: string } }[];
  };
  const parsed = JSON.parse(body.choices[0]!.message.content) as {
    pairs: Candidate[];
  };
  return { candidates: parsed.pairs };
}

async function pool<T>(
  items: T[],
  limit: number,
  work: (item: T) => Promise<void>,
) {
  const queue = [...items];
  await Promise.all(
    Array.from({ length: limit }, async () => {
      for (let item = queue.shift(); item !== undefined; item = queue.shift())
        await work(item);
    }),
  );
}

const state = await loadState();
await mkdir(dirname(statePath), { recursive: true });

// The deck is rebuilt from scored records alone, never seeded from the old
// deck file, so a retuned threshold re-gates every shipped pair too.
const deckPasses: GeneratedPair[] = [];
const keys = new Set(AUTHORED_PAIRS.map((p) => p.key));
const worldUse = new Map<string, number>();
const useWorld = (name: string) =>
  worldUse.set(
    normalizeSentence(name),
    (worldUse.get(normalizeSentence(name)) ?? 0) + 1,
  );
for (const pair of AUTHORED_PAIRS)
  [pair.contextA.name, pair.contextB.name].forEach(useWorld);
for (const record of state) {
  const v = verdict(record.report);
  const reused = [record.candidate.a.name, record.candidate.b.name].some(
    (name) => (worldUse.get(normalizeSentence(name)) ?? 0) >= WORLD_REUSE,
  );
  if (!v.pass || reused || keys.has(record.candidate.key)) continue;
  deckPasses.push(fromRecord(record, v.quality));
  keys.add(record.candidate.key);
  [record.candidate.a.name, record.candidate.b.name].forEach(useWorld);
}

/** Refuse to publish a smaller deck (a lost or version-skipped history) unless asked. */
function assertNoShrink() {
  if (!allowShrink && deckPasses.length < GENERATED_PAIRS.length)
    throw new Error(
      `Rebuilt deck has ${deckPasses.length} pairs; the current deck has ${GENERATED_PAIRS.length}. Nothing written. Pass --allow-shrink if dropping pairs is intended.`,
    );
}
assertNoShrink();

function fromRecord(record: Record_, quality: number): GeneratedPair {
  const { key, a, b } = record.candidate;
  const strip = ({ label, setting, name, surface }: Candidate["a"]) => ({
    label,
    setting,
    name,
    surface,
  });
  return {
    key,
    a: strip(a),
    b: strip(b),
    quality,
    battery: record.report.battery,
  };
}

const startUsage = await keyUsage();
let spent = 0;
let generated = 0;
let passed = 0;
const reasons = new Map<string, number>();

let nextBatch = 0;

async function runBatch(batch: number) {
  const avoid = [...worldUse.keys()];
  let result: GeneratorResult;
  try {
    result = await generateBatch(avoid);
  } catch (error) {
    console.error(`batch ${batch + 1}: ${(error as Error).message}`);
    return;
  }
  const fresh = result.candidates.filter((candidate) => {
    const reused = [candidate.a.name, candidate.b.name].some(
      (name) => (worldUse.get(normalizeSentence(name)) ?? 0) >= WORLD_REUSE,
    );
    if (reused) {
      reasons.set("world reused", (reasons.get("world reused") ?? 0) + 1);
      return false;
    }
    // Reserve the key now: concurrent batches may propose the same one.
    if (keys.has(candidate.key))
      candidate.key = `${candidate.key}-${keys.size}`;
    keys.add(candidate.key);
    return true;
  });
  const known = [
    ...AUTHORED_PAIRS,
    ...deckPasses.map((p) => toPair({ ...p, probes: [] })),
  ];
  await pool(fresh, CONCURRENCY, async (candidate) => {
    let report: BatteryReport;
    try {
      report = await runBattery(config, candidate, known);
    } catch (error) {
      if (error instanceof JudgeUnavailableError) {
        console.error(
          `${candidate.key}: judge unavailable (${error.code}); skipped`,
        );
        return;
      }
      throw error;
    }
    generated += 1;
    const record: Record_ = { candidate, report };
    await appendFile(statePath, `${JSON.stringify(record)}\n`);
    const v = verdict(report);
    for (const reason of v.reasons) {
      const bucket = reason.startsWith("probe not playable")
        ? "probe not playable"
        : reason;
      reasons.set(bucket, (reasons.get(bucket) ?? 0) + 1);
    }
    if (!v.pass) return;
    passed += 1;
    [candidate.a.name, candidate.b.name].forEach(useWorld);
    deckPasses.push(fromRecord(record, v.quality));
    console.log(
      `PASS q=${v.quality} ${candidate.a.name} / ${candidate.b.name}`,
    );
  });
  spent = (await keyUsage()) - startUsage;
  console.log(
    `batch ${batch + 1}/${batches}: ${passed}/${generated} passed so far, ~$${spent.toFixed(4)} spent`,
  );
}

/**
 * Rewrite the deck from memory: temp file, then rename, so a killed run leaves
 * a whole file. Batch workers run concurrently, so every write goes through one
 * serial chain; two writers never share the temp file.
 */
let deckWrites: Promise<void> = Promise.resolve();
function writeDeck(): Promise<void> {
  deckWrites = deckWrites.then(writeDeckNow);
  return deckWrites;
}

async function writeDeckNow() {
  const sorted = [...deckPasses].sort(
    (x, y) => y.quality - x.quality || x.key.localeCompare(y.key),
  );
  assertNoShrink();
  const temp = `${deckPath}.${process.pid}.tmp`;
  await writeFile(
    temp,
    `/**
 * Generated context pairs. Written by scripts/pairs/generate.ts; every entry
 * passed the Jev pair battery (${BATTERY_VERSION}, see docs/pairs.md).
 * Do not edit by hand: it is rebuilt from evidence/pairs/reports.jsonl. To drop
 * a pair, delete its record there (or tighten the battery) and rebuild.
 */

import type { Surface } from "./content";

export type GeneratedWorld = {
  label: string;
  setting: string;
  name: string;
  surface: Surface;
};
export type GeneratedPair = {
  key: string;
  a: GeneratedWorld;
  b: GeneratedWorld;
  /** Battery quality at generation time; higher is better. */
  quality: number;
  battery: string;
};

export const GENERATED_PAIRS: GeneratedPair[] = ${JSON.stringify(sorted, null, 2)};
`,
  );
  await rename(temp, deckPath);
}

await Promise.all(
  Array.from({ length: BATCH_CONCURRENCY }, async () => {
    while (nextBatch < batches && spent < maxUsd) {
      await runBatch(nextBatch++);
      await writeDeck();
    }
  }),
);
await writeDeck();
console.log(
  `\n${passed}/${generated} new passes; deck now ${deckPasses.length} generated pairs.`,
);
console.log("Failure reasons:", Object.fromEntries(reasons));
