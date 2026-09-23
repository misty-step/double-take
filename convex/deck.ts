/**
 * The live deck: authored pairs first, then every generated pair that passed
 * the Jev pair battery. Server only: the browser never needs the whole deck,
 * because each round's pair travels with the game view.
 */

import { curly } from "../lib/typeset";
import { AUTHORED_PAIRS, PALETTE } from "./content";
import { GENERATED_PAIRS, type GeneratedWorld } from "./generatedPairs";
import type { Context, Pair } from "./rubrics";

/** Player-facing names get typographic quotes; the judge's label and setting stay as authored. */
const typeset = (world: Context): Context => ({
  ...world,
  name: curly(world.name),
});

function world({ label, setting, name, surface }: GeneratedWorld) {
  return typeset({ label, setting, name, ...PALETTE[surface] });
}

export const PAIRS: Pair[] = [
  ...AUTHORED_PAIRS.map((pair) => ({
    ...pair,
    contextA: typeset(pair.contextA),
    contextB: typeset(pair.contextB),
  })),
  ...GENERATED_PAIRS.map((pair) => ({
    key: pair.key,
    contextA: world(pair.a),
    contextB: world(pair.b),
  })),
];

const BY_KEY = new Map(PAIRS.map((pair) => [pair.key, pair]));

export function pairByKey(key: string): Pair | undefined {
  return BY_KEY.get(key);
}
