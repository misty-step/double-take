/**
 * Local seed step: validates the authored deck instead of copying it into the
 * database. Content is versioned in git (convex/content.ts), not seeded rows.
 */

import { v } from "convex/values";
import { internalMutation } from "./_generated/server";
import { CALIBRATION, PAIRS } from "./content";

export const run = internalMutation({
  args: {},
  returns: v.object({ pairs: v.number(), calibrations: v.number() }),
  handler: async () => {
    const keys = new Set(PAIRS.map((pair) => pair.key));
    if (keys.size !== PAIRS.length)
      throw new Error("Duplicate pair keys in the deck");
    for (const example of CALIBRATION) {
      if (!keys.has(example.pairKey))
        throw new Error(
          `Calibration references a missing pair: ${example.pairKey}`,
        );
      for (const level of Object.values(example.expected)) {
        if (!Number.isInteger(level) || level < 0 || level > 3)
          throw new Error(
            `Calibration level out of range in ${example.pairKey}`,
          );
      }
    }
    return { pairs: PAIRS.length, calibrations: CALIBRATION.length };
  },
});
