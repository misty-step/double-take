/**
 * Calibrate the pair battery: authored pairs should pass, planted failures
 * should fail for the reason they were planted.
 *
 *   pass-env run -e OPENROUTER_API_KEY=workstation/DOUBLETAKE_OPENROUTER_API_KEY -- \
 *     env JEV_MODEL=typesafe/jev-1.13 JEV_DECISIONS_URL=https://openrouter.ai/api/alpha/decisions \
 *     bun scripts/pairs/calibrate.ts
 */

import { AUTHORED_PAIRS, PALETTE, type Surface } from "../../convex/content";
import { readJudgeConfig } from "../../convex/judge";
import type { Context } from "../../convex/rubrics";
import { type Candidate, runBattery, verdict } from "./battery";

const config = readJudgeConfig(process.env);
if (!config)
  throw new Error("Set OPENROUTER_API_KEY, JEV_MODEL, JEV_DECISIONS_URL.");

const surfaceOf = (world: Context) =>
  (Object.entries(PALETTE).find(([, c]) => c.bg === world.bg)?.[0] ??
    "paper") as Surface;

/** Probe lines for the authored pairs: at least one real bridge each. */
const AUTHORED_PROBES: Record<string, string[]> = {
  "vow-villain": [
    "I have waited years for this moment",
    "You will never escape me now",
    "Everything I built was for this day",
  ],
  "bedtime-briefing": [
    "Nice and slow, you are almost down",
    "Stay calm and listen to my voice",
    "I will be right here the whole time",
  ],
  "vet-boss": [
    "This will be hard, but you will get through it",
    "I know this is scary, stay with me",
    "We need to talk about your behavior",
  ],
  "letter-fineprint": [
    "This binds me to you forever",
    "Some conditions apply to my heart",
    "Read this carefully before you sign",
  ],
  "coach-grief": [
    "It is okay to feel everything right now",
    "What we do next is what matters",
    "Take a breath, then we go again",
  ],
  "orbit-hold": [
    "Please stay on the line",
    "We are sorry we cannot reach you right now",
    "Your call is important to us",
  ],
  "menu-spell": [
    "Tonight something rare arrives from far away",
    "Fresh ingredients gathered at dawn",
    "Once it is served there is no going back",
  ],
  "valentine-ticket": [
    "I could not stop thinking about you",
    "Sorry for leaving my mark on you",
    "Call me, here is my number",
  ],
  "cookie-tos": [
    "You agree to accept whatever comes next",
    "Your future is not guaranteed",
    "What you share will follow you",
  ],
  "lighthouse-voicemail": [
    "Nobody out here but me and the storm",
    "Still awake, still keeping the light on",
    "I just wanted someone to know I am here",
  ],
};

const authored: Candidate[] = AUTHORED_PAIRS.map((pair) => ({
  key: `cal-${pair.key}`,
  a: { ...pair.contextA, surface: surfaceOf(pair.contextA) },
  b: { ...pair.contextB, surface: surfaceOf(pair.contextB) },
  probes: AUTHORED_PROBES[pair.key]!,
}));

/** Planted failures, each tagged with the reason it should fail. */
const planted: (Candidate & { expect: string })[] = [
  {
    key: "bad-toasts",
    expect: "worlds too close",
    a: {
      label: "Birthday toast",
      setting:
        "Glass raised at a friend's fortieth birthday dinner, everyone watching.",
      name: "A birthday toast",
      surface: "butter",
    },
    b: {
      label: "Anniversary toast",
      setting:
        "Glass raised at your parents' anniversary party, family all around.",
      name: "An anniversary toast",
      surface: "apricot",
    },
    probes: [
      "Here is to many more years",
      "Raise your glasses everyone",
      "We love you so much",
    ],
  },
  {
    key: "bad-vague",
    expect: "world unclear",
    a: {
      label: "A thing",
      setting: "Someone says something somewhere to someone else about stuff.",
      name: "The situation",
      surface: "fog",
    },
    b: {
      label: "Surgeon mid-operation",
      setting:
        "Masked surgeon asking the nurse for an instrument, monitors beeping.",
      name: "In surgery",
      surface: "sea",
    },
    probes: [
      "Hand me that please",
      "Stay focused, we are almost done",
      "Careful now",
    ],
  },
  {
    key: "bad-deadend",
    expect: "no bridge",
    a: {
      label: "Sheep counting to fall asleep",
      setting:
        "Silently counting sheep in bed, eyes closed, nothing said aloud.",
      name: "Counting sheep",
      surface: "lilac",
    },
    b: {
      label: "Stock ticker readout",
      setting: "Automated voice reading closing prices for a list of symbols.",
      name: "Closing prices",
      surface: "graphite",
    },
    probes: ["Seventy four", "Down three points today", "One more and I sleep"],
  },
  {
    key: "bad-flat",
    expect: "flat or same meaning",
    a: {
      label: "Barista calling an order",
      setting:
        "Busy coffee counter, calling out a finished drink to the waiting crowd.",
      name: "Order up",
      surface: "cream",
    },
    b: {
      label: "Deli counter calling a number",
      setting:
        "Supermarket deli, ticket numbers on a red display, calling the next customer.",
      name: "Now serving",
      surface: "rose",
    },
    probes: ["Next please", "Here you go", "Thank you for waiting"],
  },
];

const all = [...authored, ...planted];
const reports = await Promise.all(all.map((c) => runBattery(config, c, [])));
for (const [index, report] of reports.entries()) {
  const v = verdict(report);
  const r = report.review;
  const tag =
    "expect" in all[index]!
      ? ` (planted: ${(all[index] as { expect: string }).expect})`
      : "";
  console.log(
    `${v.pass ? "PASS" : "FAIL"} ${report.key}${tag} q=${v.quality}` +
      (r
        ? ` clear=${r.clearA.toFixed(1)}/${r.clearB.toFixed(1)} voice=${r.voiceA.toFixed(1)}/${r.voiceB.toFixed(1)} dist=${r.distance.toFixed(1)} promise=${r.promise.toFixed(1)} safe=${r.safe}`
        : "") +
      "",
  );
  for (const p of report.probes ?? [])
    console.log(
      `   ${p.points}pt ${p.first}+${p.second}${p.zero ? ` ${p.zero}` : ""} turn=${p.turn.toFixed(1)}  ${p.line}`,
    );
  if (v.reasons.length) console.log(`   reasons: ${v.reasons.join("; ")}`);
}
