/**
 * Curated context pairs and calibration examples.
 *
 * Authoring lives here, versioned in git. The judge never generates prose;
 * it only rates the player's sentence against these authored contexts.
 */

import type { Pair } from "./rubrics";

export const PAIRS: Pair[] = [
  {
    key: "vow-villain",
    title: "Vow or threat",
    contextA: {
      label: "Wedding vow",
      setting: "Said aloud at the altar, holding your partner's hands, after ten years together.",
    },
    contextB: {
      label: "Villain monologue",
      setting: "Said to the hero you have finally cornered, cape settling, plan complete.",
    },
    note: "The canonical calibration pair.",
  },
  {
    key: "bedtime-briefing",
    title: "Goodnight, over",
    contextA: {
      label: "Parent at bedtime",
      setting: "Whispered at the edge of a child's bed, lights low, third glass of water requested.",
    },
    contextB: {
      label: "Flight controller",
      setting: "Spoken calmly over the radio to a pilot on final approach in bad weather.",
    },
  },
  {
    key: "vet-boss",
    title: "Hard news",
    contextA: {
      label: "Veterinarian to a nervous dog",
      setting: "Low, calm voice in an exam room; the dog is shaking on the steel table.",
    },
    contextB: {
      label: "Manager in a review meeting",
      setting: "Serious voice across a conference table; the quarter did not go well.",
    },
  },
  {
    key: "letter-fineprint",
    title: "Yours sincerely",
    contextA: {
      label: "Love letter",
      setting: "Written by hand, sent by mail, kept in a drawer for years.",
    },
    contextB: {
      label: "Contract fine print",
      setting: "Grey text at the bottom of a long agreement, next to the signature line.",
    },
  },
  {
    key: "coach-grief",
    title: "Locker room, quiet room",
    contextA: {
      label: "Coach before the final",
      setting: "Locker room at halftime, chalk dust in the air, a season on the line.",
    },
    contextB: {
      label: "Grief counselor",
      setting: "Quiet office, box of tissues on the side table, a long silence just ended.",
    },
  },
  {
    key: "orbit-hold",
    title: "Signal",
    contextA: {
      label: "Last transmission from orbit",
      setting: "Static-edged voice from a failing capsule, oxygen running out.",
    },
    contextB: {
      label: "Support line hold message",
      setting: "Cheerful recorded voice, looping, apologizing for the wait.",
    },
  },
  {
    key: "menu-spell",
    title: "What we serve",
    contextA: {
      label: "Chef's specials board",
      setting: "Chalk on slate by the kitchen door, market haul this morning.",
    },
    contextB: {
      label: "Spoken incantation",
      setting: "Old words by candlelight, a circle of salt, something about to arrive.",
    },
  },
  {
    key: "valentine-ticket",
    title: "Left where you'll find it",
    contextA: {
      label: "Valentine's card",
      setting: "Red ink, pressed flowers, hidden under a pillow.",
    },
    contextB: {
      label: "Note under a windshield wiper",
      setting: "Rushed handwriting on a napkin, left after a parking-lot scrape.",
    },
  },
  {
    key: "cookie-tos",
    title: "A promise on paper",
    contextA: {
      label: "Fortune cookie slip",
      setting: "Folded in a cracker shell at the end of a long dinner.",
    },
    contextB: {
      label: "Terms of service summary",
      setting: "The one sentence above the Accept button nobody reads.",
    },
  },
  {
    key: "lighthouse-voicemail",
    title: "Still here",
    contextA: {
      label: "Lighthouse keeper's log",
      setting: "Ink on a weather-stained page, storm season, nobody else for miles.",
    },
    contextB: {
      label: "Late-night voicemail to an old friend",
      setting: "Talking to an answering machine because calling felt better than sleeping.",
    },
  },
];

export function pairByKey(key: string): Pair | undefined {
  return PAIRS.find((pair) => pair.key === key);
}

export type CalibrationExample = {
  pairKey: string;
  sentence: string;
  expected: {
    plausibilityA: number;
    plausibilityB: number;
    coherence: number;
    specificity: number;
  };
  note: string;
};

/**
 * Curated calibration examples. Each expected level is the authored intent for
 * the rubric; `scripts/judge-probe.mjs` can compare a live judge against these
 * when a server key is available, and tests pin the deck's shape offline.
 */
export const CALIBRATION: CalibrationExample[] = [
  {
    pairKey: "vow-villain",
    sentence: "I will love you until death takes me",
    expected: { plausibilityA: 3, plausibilityB: 3, coherence: 3, specificity: 2 },
    note: "Classic double reading; both framings hold without changing a word.",
  },
  {
    pairKey: "vow-villain",
    sentence: "You will never escape me now",
    expected: { plausibilityA: 0, plausibilityB: 3, coherence: 2, specificity: 2 },
    note: "Collapses under the vow; the weaker reading must sink it.",
  },
  {
    pairKey: "vow-villain",
    sentence: "I promise to stay, and you will regret this",
    expected: { plausibilityA: 2, plausibilityB: 2, coherence: 0, specificity: 2 },
    note: "Two stitched halves; the comma cannot hide two different speakers.",
  },
  {
    pairKey: "vet-boss",
    sentence: "This will only hurt for a moment",
    expected: { plausibilityA: 3, plausibilityB: 2, coherence: 3, specificity: 2 },
    note: "Kind to a dog, cold from a manager; earns the weaker reading.",
  },
  {
    pairKey: "vet-boss",
    sentence: "We need to talk",
    expected: { plausibilityA: 2, plausibilityB: 2, coherence: 3, specificity: 0 },
    note: "Fits everything; the specificity gate must zero it.",
  },
  {
    pairKey: "orbit-hold",
    sentence: "Please hold, your call matters to us",
    expected: { plausibilityA: 0, plausibilityB: 3, coherence: 3, specificity: 1 },
    note: "A perfect hold message that nobody would transmit from a dying capsule.",
  },
  {
    pairKey: "menu-spell",
    sentence: "Tonight we feast on what remains",
    expected: { plausibilityA: 3, plausibilityB: 3, coherence: 3, specificity: 2 },
    note: "Works as a harvest menu and as an incantation; same words, colder in the circle.",
  },
  {
    pairKey: "letter-fineprint",
    sentence: "By the time you read this, it will be too late to refuse",
    expected: { plausibilityA: 1, plausibilityB: 3, coherence: 2, specificity: 3 },
    note: "Fine print at home; a love letter struggles — one point survives.",
  },
];

export const INSTRUCTIONS = {
  premise: "One sentence. Two contexts. The weaker reading wins.",
  steps: [
    "You get two contexts: the same line has to work in both.",
    "Write one coherent sentence of twelve words or less.",
    "The judge scores each reading separately, then checks coherence and specificity.",
    "Stitched clauses and generic filler score nothing, however balanced they look.",
    "Points come from the weaker reading: the floor, not the ceiling.",
  ],
} as const;
