import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { PALETTE } from "../convex/content";
import { PAIRS } from "../convex/deck";
import { GENERATED_PAIRS } from "../convex/generatedPairs";
import {
  BATTERY_VERSION,
  type BatteryReport,
  type Candidate,
  verdict,
} from "../scripts/pairs/battery";

// US-001: no generated pair reaches players without a passing, current-battery record.
describe("generated deck provenance", () => {
  const records = readFileSync("evidence/pairs/reports.jsonl", "utf8")
    .trim()
    .split("\n")
    .map(
      (line) =>
        JSON.parse(line) as { candidate: Candidate; report: BatteryReport },
    );

  it("backs every generated pair with a passing record whose worlds match", () => {
    expect(PAIRS.length).toBeGreaterThanOrEqual(500);
    for (const pair of GENERATED_PAIRS) {
      const record = records.find(
        (row) =>
          row.candidate.key === pair.key &&
          row.report.battery === BATTERY_VERSION &&
          verdict(row.report).pass,
      );
      expect(record, pair.key).toBeDefined();
      for (const side of ["a", "b"] as const) {
        const { label, setting, name, surface } = record!.candidate[side];
        expect({ label, setting, name, surface }, pair.key).toEqual(pair[side]);
      }
    }
  });
});

function luminance(hex: string): number {
  const [r, g, b] = hex
    .slice(1)
    .match(/../g)!
    .map((part) => {
      const value = parseInt(part, 16) / 255;
      return value <= 0.03928
        ? value / 12.92
        : ((value + 0.055) / 1.055) ** 2.4;
    }) as [number, number, number];
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrast(background: string, text: string): number {
  const [light, dark] = [luminance(background), luminance(text)].sort(
    (x, y) => y - x,
  ) as [number, number];
  return (light + 0.05) / (dark + 0.05);
}

describe("deck worlds", () => {
  it("keeps every palette surface and every world's text at 7:1 contrast or better", () => {
    for (const [surface, { bg, ink }] of Object.entries(PALETTE))
      expect(contrast(bg, ink), surface).toBeGreaterThanOrEqual(7);
    for (const pair of PAIRS)
      for (const world of [pair.contextA, pair.contextB])
        expect(
          contrast(world.bg, world.ink),
          `${pair.key}: ${world.name}`,
        ).toBeGreaterThanOrEqual(7);
  });

  it("gives players a name of four words or fewer for every world, distinct within its pair", () => {
    for (const pair of PAIRS) {
      expect(pair.contextA.name).not.toBe(pair.contextB.name);
      for (const world of [pair.contextA, pair.contextB])
        expect(world.name.split(/\s+/).length, world.name).toBeLessThanOrEqual(
          4,
        );
    }
  });
});
