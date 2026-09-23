import { describe, expect, it } from "vitest";
import { CONNECTION_UNAVAILABLE, playerFailureCopy } from "../lib/player-copy";

/** Every refusal the backend can send for each action; each needs its own plain sentence. */
const KNOWN_CODES = {
  join: [
    "INVALID_ROOM_CODE",
    "ROOM_NOT_OPEN",
    "ROOM_FULL",
    "INVALID_DISPLAY_NAME",
    "ROOM_JOIN_RATE_LIMIT",
    "ROOM_DATA_INVALID",
  ],
  start: [
    "HOST_REQUIRED",
    "NOT_HOST",
    "ROOM_NOT_OPEN",
    "NOT_ENOUGH_PLAYERS",
    "TOO_MANY_PLAYERS",
    "ROOM_FULL",
    "MATCH_ALREADY_ACTIVE",
    "GAME_ALREADY_ACTIVE",
  ],
  submit: [
    "WRONG_PHASE",
    "ALREADY_LOCKED",
    "NOT_SEATED",
    "SENTENCE_EMPTY",
    "SENTENCE_TOO_LONG",
    "TOO_MANY_WORDS",
    "NO_LETTERS",
    "SLOW_DOWN",
  ],
  advance: ["WRONG_PHASE", "HOST_REQUIRED", "REVEAL_RUNNING"],
} as const;

describe("player-facing failure copy", () => {
  it("gives every known refusal its own sentence, never the fallback or the raw code", () => {
    for (const action of Object.keys(
      KNOWN_CODES,
    ) as (keyof typeof KNOWN_CODES)[])
      for (const code of KNOWN_CODES[action]) {
        const sentence = playerFailureCopy(action, code);
        expect(sentence, `${action} ${code}`).not.toBe(CONNECTION_UNAVAILABLE);
        expect(sentence, `${action} ${code}`).not.toContain(code);
        expect(sentence, `${action} ${code}`).toMatch(/[.!?]$/);
      }
  });

  it("uses one safe connection fallback for unknown and missing codes", () => {
    for (const action of Object.keys(
      KNOWN_CODES,
    ) as (keyof typeof KNOWN_CODES)[]) {
      expect(playerFailureCopy(action, "UNEXPECTED_PROVIDER_BODY")).toBe(
        CONNECTION_UNAVAILABLE,
      );
      expect(playerFailureCopy(action)).toBe(CONNECTION_UNAVAILABLE);
    }
  });
});
