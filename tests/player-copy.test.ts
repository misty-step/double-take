import { describe, expect, it } from "vitest";
import {
  CONNECTION_UNAVAILABLE,
  SEAT_RECOVERY_UNAVAILABLE,
  SEAT_RESET_UNAVAILABLE,
  playerFailureCopy,
} from "../lib/player-copy";

describe("player-facing failure copy", () => {
  it("translates every room and game refusal into plain language", () => {
    const cases = {
      join: {
        INVALID_ROOM_CODE: "No game with that code. Check it and try again.",
        ROOM_NOT_OPEN: "No game with that code. Check it and try again.",
        ROOM_FULL: "That game is full.",
        INVALID_DISPLAY_NAME: "Add your name so everyone knows who wrote what.",
        ROOM_JOIN_RATE_LIMIT: "Too many tries. Wait a minute, then try again.",
        ROOM_DATA_INVALID: "That game isn't available. Ask for a new invite.",
      },
      start: {
        HOST_REQUIRED: "Only the host can start the game.",
        NOT_HOST: "Only the host can start the game.",
        ROOM_NOT_OPEN: "This game is no longer open.",
        NOT_ENOUGH_PLAYERS: "Wait for another player to join.",
        TOO_MANY_PLAYERS: "This game has room for eight players.",
        ROOM_FULL: "This game has room for eight players.",
        MATCH_ALREADY_ACTIVE: "The game has already started.",
        GAME_ALREADY_ACTIVE: "The game has already started.",
      },
      submit: {
        WRONG_PHASE: "This round is already over.",
        ALREADY_LOCKED: "Your line is already locked in.",
        NOT_SEATED:
          "You're watching this round. You can play in the next game.",
        SENTENCE_EMPTY: "Write one line before locking it in.",
        SENTENCE_TOO_LONG: "Keep your line under 160 characters.",
        TOO_MANY_WORDS: "One line, twelve words at most.",
        NO_LETTERS: "Use at least one letter or number.",
        SLOW_DOWN:
          "That's a lot of lines at once. Wait a minute, then try again.",
      },
      advance: {
        WRONG_PHASE: "This round has already moved on.",
        HOST_REQUIRED:
          "The host starts the next round. You can step in if they're away.",
        REVEAL_RUNNING: "Wait until every line has been shown.",
      },
    } as const;
    for (const action of Object.keys(cases) as (keyof typeof cases)[]) {
      for (const [code, sentence] of Object.entries(cases[action])) {
        expect(playerFailureCopy(action, code)).toBe(sentence);
      }
    }
  });

  it("uses one safe connection fallback for unknown and missing codes", () => {
    for (const action of ["join", "start", "submit", "advance"] as const) {
      expect(playerFailureCopy(action, "UNEXPECTED_PROVIDER_BODY")).toBe(
        CONNECTION_UNAVAILABLE,
      );
      expect(playerFailureCopy(action)).toBe(CONNECTION_UNAVAILABLE);
    }
    expect(SEAT_RECOVERY_UNAVAILABLE).toBe(
      "We couldn't restore your seat. Check your connection and try again.",
    );
    expect(SEAT_RESET_UNAVAILABLE).toBe(
      "We couldn't start a fresh seat. Check your connection and try again.",
    );
  });
});
