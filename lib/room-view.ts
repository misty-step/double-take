/**
 * When does a room show the game table instead of the lobby?
 *
 * The platform completes its match in the same transaction that finishes the
 * game, so `activeMatch` goes null exactly when the standings should appear.
 * A finished game therefore keeps the table view alive on its own. An
 * abandoned match (no active match, unfinished game) falls back to the lobby
 * so a dead table never traps players in a stale round.
 */
export function showsGameTable(
  activeMatch: boolean,
  phase: string | null | undefined,
): boolean {
  return activeMatch || phase === "finished";
}
