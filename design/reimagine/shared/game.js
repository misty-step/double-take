/*
 * Shared prototype content and the judge client for the Double Take
 * reimagining. Classic script; exposes window.DT.
 *
 * Play is scored by live Jev only: `judge()` posts to `/judge` on
 * design/reimagine/serve.ts, which runs the production adjudication in
 * convex/judge.ts against the authored pair in convex/content.ts. There is no
 * offline scorer; if the judge is unreachable the line is not scored.
 *
 * `fixture()` returns authored levels for known example lines. It exists only
 * to seed the #state= QA screens and is never called during play.
 */
(function () {
  "use strict";

  /** Per-side reading levels, weakest first. Same four levels as rubric@2. */
  const SIDE_WORDS = ["Doesn't fit", "A stretch", "Fits", "Perfect"];
  /** A line's rank is its weaker side. Level 3 is the game's name on purpose. */
  const RANKS = ["Miss", "Close", "Lands", "Double take"];
  const GATE_COPY = {
    stitched: "That's two lines stitched together. Make it one.",
    generic: "Too safe. That would fit anywhere.",
    rejected: "One world doesn't buy it.",
  };
  const MAX_WORDS = 12;
  const TRIES = 3;

  /*
   * Each world: a short label (the whole prompt a player reads), the judge-only
   * setting from convex/content.ts (the server sends the real one), a surface
   * color pair, and a share emoji. Examples carry authored levels for QA seeds.
   */
  const PAIRS = [
    {
      key: "vow-villain",
      no: 1,
      a: {
        label: "A wedding vow",
        setting: "Said aloud at the altar, holding your partner's hands, after ten years together.",
        bg: "#F8DCE1",
        ink: "#000000",
        emoji: "🟥",
      },
      b: {
        label: "A villain's gloat",
        setting: "Said to the hero you have finally cornered, cape settling, plan complete.",
        bg: "#16203A",
        ink: "#FFFFFF",
        emoji: "🟦",
      },
      examples: [
        { text: "You are mine, now and forever", a: 3, b: 3, coherence: 3, specificity: 2 },
        { text: "I will love you until death takes me", a: 3, b: 2, coherence: 3, specificity: 2 },
        { text: "You will never escape me now", a: 1, b: 3, coherence: 2, specificity: 2 },
        { text: "I promise to stay, and you will regret this", a: 2, b: 2, coherence: 0, specificity: 2 },
        { text: "I have waited my whole life for this moment", a: 3, b: 3, coherence: 3, specificity: 2 },
      ],
    },
    {
      key: "bedtime-briefing",
      no: 2,
      a: {
        label: "Bedtime",
        setting: "Whispered at the edge of a child's bed, lights low, third glass of water requested.",
        bg: "#DDE4FF",
        ink: "#000000",
        emoji: "🟪",
      },
      b: {
        label: "Air traffic control",
        setting: "Spoken calmly over the radio to a pilot on final approach in bad weather.",
        bg: "#0E2A22",
        ink: "#E9FFF4",
        emoji: "🟩",
      },
      examples: [
        { text: "Nice and easy now, you're almost down", a: 3, b: 3, coherence: 3, specificity: 2 },
        { text: "Close your eyes and dream of something nice", a: 3, b: 0, coherence: 3, specificity: 1 },
        { text: "Stay with me, we're nearly there", a: 2, b: 3, coherence: 3, specificity: 2 },
        { text: "Easy now, I've got you all the way down", a: 2, b: 3, coherence: 3, specificity: 2 },
      ],
    },
    {
      key: "letter-fineprint",
      no: 3,
      a: {
        label: "A love letter",
        setting: "Written by hand, sent by mail, kept in a drawer for years.",
        bg: "#FFE3CC",
        ink: "#000000",
        emoji: "🟧",
      },
      b: {
        label: "The fine print",
        setting: "Grey text at the bottom of a long agreement, next to the signature line.",
        bg: "#E6E6E6",
        ink: "#000000",
        emoji: "⬜",
      },
      examples: [
        { text: "You agree to everything the moment you open this", a: 1, b: 3, coherence: 2, specificity: 2 },
        { text: "This binds us both, with no end date", a: 3, b: 3, coherence: 3, specificity: 2 },
      ],
    },
    {
      key: "menu-spell",
      no: 4,
      a: {
        label: "Tonight's specials",
        setting: "Chalk on slate by the kitchen door, market haul this morning.",
        bg: "#FFE9A8",
        ink: "#000000",
        emoji: "🟨",
      },
      b: {
        label: "A summoning spell",
        setting: "Old words by candlelight, a circle of salt, something about to arrive.",
        bg: "#1D1233",
        ink: "#F4EDFF",
        emoji: "🟪",
      },
      examples: [
        { text: "Tonight we feast on what remains", a: 2, b: 2, coherence: 3, specificity: 2 },
        { text: "Something fresh rises from the deep tonight", a: 3, b: 3, coherence: 3, specificity: 2 },
        { text: "Come hungry, leave changed", a: 3, b: 2, coherence: 3, specificity: 2 },
        { text: "Fresh from the dark, served before midnight", a: 3, b: 3, coherence: 3, specificity: 2 },
      ],
    },
    {
      key: "cookie-tos",
      no: 5,
      a: {
        label: "A fortune cookie",
        setting: "Folded in a cracker shell at the end of a long dinner.",
        bg: "#FFF0B8",
        ink: "#000000",
        emoji: "🟨",
      },
      b: {
        label: "Terms of service",
        setting: "The one sentence above the Accept button nobody reads.",
        bg: "#E3EDFF",
        ink: "#000000",
        emoji: "🟦",
      },
      examples: [
        { text: "What you share today will follow you forever", a: 3, b: 3, coherence: 3, specificity: 2 },
      ],
    },
    {
      key: "lighthouse-voicemail",
      no: 6,
      a: {
        label: "A lighthouse log",
        setting: "Ink on a weather-stained page, storm season, nobody else for miles.",
        bg: "#D6ECF0",
        ink: "#000000",
        emoji: "🟦",
      },
      b: {
        label: "A 3 a.m. voicemail",
        setting: "Talking to an answering machine because calling felt better than sleeping.",
        bg: "#1A1A1F",
        ink: "#FFFFFF",
        emoji: "⬛",
      },
      examples: [
        { text: "Still up, still watching, still no one out there", a: 3, b: 3, coherence: 3, specificity: 2 },
      ],
    },
  ];

  /*
   * Group play: a line's points are both worlds added together (0 to 6), unless
   * it is stitched, generic, or one world rejects it outright (level 0), which
   * scores nothing. Ties go to the more balanced line (higher weaker world).
   */
  function groupPoints(r) {
    return zeroReason(r) ? 0 : r.a + r.b;
  }
  function zeroReason(r) {
    if (r.gate === "stitched" || r.gate === "generic") return r.gate;
    return Math.min(r.a, r.b) < 1 ? "rejected" : null;
  }

  /** Simulated tablemates for the group prototype, one authored line per round's pair. */
  const ROUND_PAIRS = ["vow-villain", "menu-spell", "bedtime-briefing"];
  const BOTS = [
    { id: "priya", name: "Priya", delay: 2600 },
    { id: "sam", name: "Sam", delay: 5200 },
    { id: "jo", name: "Jo", delay: 8400 },
  ];
  const BOT_LINES = {
    "vow-villain": { priya: "I have waited my whole life for this moment", sam: "You will never escape me now", jo: "I promise to stay, and you will regret this" },
    "menu-spell": { priya: "Tonight we feast on what remains", sam: "Something fresh rises from the deep tonight", jo: "Come hungry, leave changed" },
    "bedtime-briefing": { priya: "Close your eyes and dream of something nice", sam: "Stay with me, we're nearly there", jo: "Nice and easy now, you're almost down" },
  };

  /** Curated lines players see after they finish (editorial, never unmoderated). */
  const GALLERY = {
    "vow-villain": [
      { name: "Priya", text: "I have waited my whole life for this moment" },
      { name: "Sam", text: "You are mine, now and forever" },
      { name: "Jo", text: "There is no one left to stop us now" },
    ],
  };

  function normalize(text) {
    return text.toLowerCase().replace(/[^a-z0-9' ]+/g, " ").replace(/\s+/g, " ").trim();
  }

  function words(text) {
    const trimmed = text.trim();
    return trimmed ? trimmed.split(/\s+/).length : 0;
  }

  /** Mirrors convex/rules.ts composeResult: gates first, then the weaker side. */
  function compose(levels) {
    const weaker = Math.min(levels.a, levels.b);
    if (levels.coherence < 2) return { ...levels, gate: "stitched", rank: 0 };
    if (levels.specificity < 1) return { ...levels, gate: "generic", rank: 0 };
    return { ...levels, gate: "ok", rank: weaker };
  }

  /** QA seeds only: authored levels for a known example line. Throws for anything else. */
  function fixture(pair, text) {
    const authored = pair.examples.find((ex) => normalize(ex.text) === normalize(text));
    if (!authored) throw new Error(`No authored levels for "${text}" in ${pair.key}`);
    return compose(authored);
  }

  /**
   * Live Jev judgment through serve.ts. Rejects when the judge is unreachable or
   * refuses; callers must treat that as "not scored". `fail: true` rehearses the
   * failure path without calling the judge.
   */
  async function judge(pair, text, opts) {
    if (opts && opts.fail) throw new Error("rehearsed judge failure");
    const response = await fetch("/judge", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pairKey: pair.key, text }),
    });
    if (!response.ok) throw new Error(`judge ${response.status}`);
    const r = await response.json();
    return compose({ a: r.a, b: r.b, coherence: r.coherence, specificity: r.specificity });
  }

  /** Spoiler-free share text: one row per try, pips per side in that world's emoji. */
  function shareText(pair, tries) {
    const pip = (n, emoji) => emoji.repeat(n) + "⬜".repeat(3 - n);
    const rows = tries.map((t) =>
      t.gate === "stitched"
        ? "✂️ ✂️"
        : t.gate === "generic"
          ? `${pip(0, "")} ${pip(0, "")}`
          : `${pip(t.a, pair.a.emoji)} ${pip(t.b, pair.b.emoji)}`,
    );
    const best = Math.max(...tries.map((t) => t.rank));
    return [`Double Take No. ${pair.no}`, ...rows, RANKS[best]].join("\n");
  }

  window.DT = { PAIRS, GALLERY, SIDE_WORDS, RANKS, GATE_COPY, MAX_WORDS, TRIES, judge, fixture, words, shareText, groupPoints, zeroReason, ROUND_PAIRS, BOTS, BOT_LINES };
})();
