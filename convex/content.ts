/**
 * The color palette, hand-authored context pairs, and calibration examples.
 *
 * Generated pairs live in generatedPairs.ts; convex/deck.ts composes the live
 * deck. The in-game judge never generates prose; it only rates the player's
 * sentence against these contexts.
 */

import type { Pair } from "./rubrics";

/*
 * Colors: each world is a surface (`bg`) and its text (`ink`), drawn from
 * PALETTE so every world keeps text contrast at 7:1 or better
 * (tests/content.test.ts). Generated pairs name a surface; they never carry
 * raw colors.
 */
export const PALETTE = {
  blush: { bg: "#F8DCE1", ink: "#000000" },
  rose: { bg: "#FFD6E0", ink: "#000000" },
  peach: { bg: "#FFE3CC", ink: "#000000" },
  apricot: { bg: "#FFE0B3", ink: "#000000" },
  butter: { bg: "#FFE9A8", ink: "#000000" },
  cream: { bg: "#FFF0B8", ink: "#000000" },
  lime: { bg: "#E9F3D9", ink: "#000000" },
  mint: { bg: "#DDF1E4", ink: "#000000" },
  sea: { bg: "#D6ECF0", ink: "#000000" },
  sky: { bg: "#E3EDFF", ink: "#000000" },
  periwinkle: { bg: "#DDE4FF", ink: "#000000" },
  lilac: { bg: "#E7E1F5", ink: "#000000" },
  fog: { bg: "#E4E7EB", ink: "#000000" },
  paper: { bg: "#E6E6E6", ink: "#000000" },
  navy: { bg: "#16203A", ink: "#FFFFFF" },
  space: { bg: "#0B1026", ink: "#FFFFFF" },
  forest: { bg: "#0E2A22", ink: "#E9FFF4" },
  plum: { bg: "#1D1233", ink: "#F4EDFF" },
  graphite: { bg: "#262A33", ink: "#FFFFFF" },
  ink: { bg: "#1A1A1F", ink: "#FFFFFF" },
  oxblood: { bg: "#3A1016", ink: "#FFF1F1" },
  moss: { bg: "#23301A", ink: "#F3FBE8" },
} as const satisfies Record<string, { bg: string; ink: string }>;
export type Surface = keyof typeof PALETTE;
export const SURFACES = Object.keys(PALETTE) as Surface[];

/** Hand-authored pairs; they also anchor the calibration deck below. */
export const AUTHORED_PAIRS: Pair[] = [
  {
    key: "vow-villain",
    contextA: {
      label: "Wedding vow",
      setting:
        "Said aloud at the altar, holding your partner's hands, after ten years together.",
      name: "A wedding vow",
      bg: "#F8DCE1",
      ink: "#000000",
    },
    contextB: {
      label: "Villain monologue",
      setting:
        "Said to the hero you have finally cornered, cape settling, plan complete.",
      name: "A villain's gloat",
      bg: "#16203A",
      ink: "#FFFFFF",
    },
    note: "The canonical calibration pair.",
  },
  {
    key: "bedtime-briefing",
    contextA: {
      label: "Parent at bedtime",
      setting:
        "Whispered at the edge of a child's bed, lights low, third glass of water requested.",
      name: "Bedtime",
      bg: "#DDE4FF",
      ink: "#000000",
    },
    contextB: {
      label: "Flight controller",
      setting:
        "Spoken calmly over the radio to a pilot on final approach in bad weather.",
      name: "Air traffic control",
      bg: "#0E2A22",
      ink: "#E9FFF4",
    },
  },
  {
    key: "vet-boss",
    contextA: {
      label: "Veterinarian to a nervous dog",
      setting:
        "Low, calm voice in an exam room; the dog is shaking on the steel table.",
      name: "Calming a scared dog",
      bg: "#DDF1E4",
      ink: "#000000",
    },
    contextB: {
      label: "Manager in a review meeting",
      setting:
        "Serious voice across a conference table; the quarter did not go well.",
      name: "A bad performance review",
      bg: "#262A33",
      ink: "#FFFFFF",
    },
  },
  {
    key: "letter-fineprint",
    contextA: {
      label: "Love letter",
      setting: "Written by hand, sent by mail, kept in a drawer for years.",
      name: "A love letter",
      bg: "#FFE3CC",
      ink: "#000000",
    },
    contextB: {
      label: "Contract fine print",
      setting:
        "Grey text at the bottom of a long agreement, next to the signature line.",
      name: "The fine print",
      bg: "#E6E6E6",
      ink: "#000000",
    },
  },
  {
    key: "coach-grief",
    contextA: {
      label: "Coach before the final",
      setting:
        "Locker room at halftime, chalk dust in the air, a season on the line.",
      name: "A halftime speech",
      bg: "#FFE0B3",
      ink: "#000000",
    },
    contextB: {
      label: "Grief counselor",
      setting:
        "Quiet office, box of tissues on the side table, a long silence just ended.",
      name: "A grief counselor",
      bg: "#E7E1F5",
      ink: "#000000",
    },
  },
  {
    key: "orbit-hold",
    contextA: {
      label: "Last transmission from orbit",
      setting: "Static-edged voice from a failing capsule, oxygen running out.",
      name: "Last words from orbit",
      bg: "#0B1026",
      ink: "#FFFFFF",
    },
    contextB: {
      label: "Support line hold message",
      setting: "Cheerful recorded voice, looping, apologizing for the wait.",
      name: "Hold music",
      bg: "#E9F3D9",
      ink: "#000000",
    },
  },
  {
    key: "menu-spell",
    contextA: {
      label: "Chef's specials board",
      setting: "Chalk on slate by the kitchen door, market haul this morning.",
      name: "Tonight's specials",
      bg: "#FFE9A8",
      ink: "#000000",
    },
    contextB: {
      label: "Spoken incantation",
      setting:
        "Old words by candlelight, a circle of salt, something about to arrive.",
      name: "A summoning spell",
      bg: "#1D1233",
      ink: "#F4EDFF",
    },
  },
  {
    key: "valentine-ticket",
    contextA: {
      label: "Valentine's card",
      setting: "Red ink, pressed flowers, hidden under a pillow.",
      name: "A valentine",
      bg: "#FFD6E0",
      ink: "#000000",
    },
    contextB: {
      label: "Note under a windshield wiper",
      setting:
        "Rushed handwriting on a napkin, left after a parking-lot scrape.",
      name: "A windshield apology",
      bg: "#E4E7EB",
      ink: "#000000",
    },
  },
  {
    key: "cookie-tos",
    contextA: {
      label: "Fortune cookie slip",
      setting: "Folded in a cracker shell at the end of a long dinner.",
      name: "A fortune cookie",
      bg: "#FFF0B8",
      ink: "#000000",
    },
    contextB: {
      label: "Terms of service summary",
      setting: "The one sentence above the Accept button nobody reads.",
      name: "Terms of service",
      bg: "#E3EDFF",
      ink: "#000000",
    },
  },
  {
    key: "lighthouse-voicemail",
    contextA: {
      label: "Lighthouse keeper's log",
      setting:
        "Ink on a weather-stained page, storm season, nobody else for miles.",
      name: "A lighthouse log",
      bg: "#D6ECF0",
      ink: "#000000",
    },
    contextB: {
      label: "Late-night voicemail to an old friend",
      setting:
        "Talking to an answering machine because calling felt better than sleeping.",
      name: "A 3 a.m. voicemail",
      bg: "#1A1A1F",
      ink: "#FFFFFF",
    },
  },
];

/** Authored intent: appropriateness per world (0 to 3) and the coherence level. */
export type CalibrationExample = {
  pairKey: string;
  sentence: string;
  expected: { a: number; b: number; coherence: number };
  note: string;
};

/**
 * Curated calibration examples. Each expected level is the authored intent for
 * rubric@4 (would it be appropriate to say this here); `scripts/judge-probe.mjs`
 * compares a live judge against these when a server key is available, and
 * tests pin the deck's shape offline. Decisions and probe evidence:
 * docs/calibration.md.
 */
export const CALIBRATION: CalibrationExample[] = [
  {
    pairKey: "vow-villain",
    sentence: "You are mine, now and forever",
    expected: { a: 3, b: 3, coherence: 3 },
    note: "The target double take: devotion at the altar, possession from the villain, same words. Appropriate in both.",
  },
  {
    pairKey: "vow-villain",
    sentence: "I will love you until death takes me",
    expected: { a: 3, b: 0, coherence: 3 },
    note: "Exactly right as a vow; a declaration of love to the hero you just cornered makes no sense. One world rejects it.",
  },
  {
    pairKey: "vow-villain",
    sentence: "You will never escape me now",
    expected: { a: 1, b: 3, coherence: 3 },
    note: "Exactly right in the gloat; as a vow it is an awkward, possessive thing to say.",
  },
  {
    pairKey: "vow-villain",
    sentence: "I promise to stay, and you will regret this",
    expected: { a: 1, b: 2, coherence: 0 },
    note: "Two stitched halves; the comma cannot hide two different speakers. The stitching check must zero it.",
  },
  {
    pairKey: "vet-boss",
    sentence: "This will only hurt for a moment",
    expected: { a: 3, b: 1, coherence: 3 },
    note: "Exactly right to a scared dog; from a manager in a review it is a cold, awkward thing to say.",
  },
  {
    pairKey: "vet-boss",
    sentence: "We need to talk",
    expected: { a: 1, b: 3, coherence: 3 },
    note: "The stock opener of a bad review, so exactly right there; odd to say to a dog. Common phrasing is not penalized.",
  },
  {
    pairKey: "coach-grief",
    sentence: "that'll just about do it",
    expected: { a: 2, b: 1, coherence: 3 },
    note: "Operator playtest 2026-09-23. A fine thing for a coach to say to wrap up; dismissive with a grieving person.",
  },
  {
    pairKey: "coach-grief",
    sentence: "Nobody gets through this part alone",
    expected: { a: 3, b: 3, coherence: 3 },
    note: "Rallies the team at halftime and comforts in the counselor's office. The shape of a winning line.",
  },
  {
    pairKey: "menu-spell",
    sentence: "Tonight we feast on what remains",
    expected: { a: 2, b: 2, coherence: 3 },
    note: "Fits the specials board and the circle of salt; native to neither.",
  },
  {
    pairKey: "letter-fineprint",
    sentence: "You agree to everything the moment you open this",
    expected: { a: 1, b: 3, coherence: 3 },
    note: "Exactly right as fine print; an awkward, presumptuous thing to put in a love letter.",
  },
];
