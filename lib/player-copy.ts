export const CONNECTION_UNAVAILABLE =
  "That didn't go through. Check your connection and try again.";
export const SEAT_RECOVERY_UNAVAILABLE =
  "We couldn't restore your seat. Check your connection and try again.";
export const SEAT_RESET_UNAVAILABLE =
  "We couldn't start a fresh seat. Check your connection and try again.";

const FAILURE_COPY = {
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
    NOT_SEATED: "You're watching this round. You can play in the next game.",
    SENTENCE_EMPTY: "Write one line before locking it in.",
    SENTENCE_TOO_LONG: "Keep your line under 160 characters.",
    TOO_MANY_WORDS: "One line, twelve words at most.",
    NO_LETTERS: "Use at least one letter or number.",
    SLOW_DOWN: "That's a lot of lines at once. Wait a minute, then try again.",
  },
  advance: {
    WRONG_PHASE: "This round has already moved on.",
    HOST_REQUIRED:
      "The host starts the next round. You can step in if they're away.",
    REVEAL_RUNNING: "Wait until every line has been shown.",
  },
} as const;

/** Only stable codes are translated; never display a backend exception. */
export function playerFailureCopy(
  action: keyof typeof FAILURE_COPY,
  code?: string,
): string {
  if (!code) return CONNECTION_UNAVAILABLE;
  const entries: Record<string, string> = FAILURE_COPY[action];
  return entries[code] ?? CONNECTION_UNAVAILABLE;
}
