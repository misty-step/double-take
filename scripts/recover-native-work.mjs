// Rollback-only, after canonical import and source resume with the CF writer
// still frozen. Uses functions ALREADY present on the old native deployment;
// it neither deploys a rescue module nor invents source scheduler rows.
import { makeFunctionReference } from "convex/server";
import { setTimeout as delay } from "node:timers/promises";

export async function recoverNativeWork(client, snapshot) {
  const games = new Map(snapshot.documents.games.map((row) => [row._id, row]));
  const matches = new Map(
    snapshot.documents.matches.map((row) => [row._id, row]),
  );
  const writing = (row) => {
    const game = games.get(row.gameId);
    return (
      game?.phase === "writing" &&
      game.round === row.round &&
      matches.get(game.matchId)?.status === "active"
    );
  };
  let judgments = 0;
  for (const row of snapshot.documents.submissions) {
    if (row.status !== "pending" || !writing(row)) continue;
    await client.action(makeFunctionReference("game:judgeSubmission"), {
      submissionId: row._id,
    });
    judgments++;
  }
  let deadlines = 0;
  const rounds = snapshot.documents.rounds
    .filter(
      (row) =>
        writing(row) &&
        row.lastDeadline !== undefined &&
        row.revealStartedAt === undefined,
    )
    .sort((a, b) => a.lastDeadline - b.lastDeadline);
  for (const row of rounds) {
    // The existing game creates a 30-second final-player deadline. Refuse a
    // corrupt far-future fixture instead of leaving an unbounded operator wait.
    if (
      !Number.isFinite(row.lastDeadline) ||
      row.lastDeadline > Date.now() + 31_000
    )
      throw new Error("Native recovery deadline exceeds the game clock bound");
    await delay(Math.max(0, row.lastDeadline - Date.now()));
    await client.mutation(makeFunctionReference("game:closeWriting"), {
      gameId: row.gameId,
      round: row.round,
    });
    deadlines++;
  }
  return { judgmentsInvoked: judgments, deadlinesInvoked: deadlines };
}
