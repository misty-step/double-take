# Double Take

This is the migration verification baseline for the existing party game, not a
product redesign. The shipped rules and journey are recorded in
[the design reference](design/reimagine/DESIGN.md#rules-the-game-contract).
[US-001](USER_STORIES.md) remains an explicitly proposed deck expansion; this
migration neither approves it nor treats its 500-pair target as shipped behavior.

## Player stories

1. Guests start a room, share its four-character code, and join with a name on
   their own phone. The creator hosts. Two to eight players can start a game;
   an invalid code/name, full or closed room, and unauthorized operation are
   rejected without creating a seat. Leaving and host transfer preserve the
   remaining room.
2. Every seated player sees the same two worlds and locks in one sentence per
   round: one to twelve words, at most 160 characters. Accepted lines stay private
   until the reveal. Another player's identity, another room, an invalid token,
   an internal function call, and an invalid or duplicate submission confer no
   extra access or points.
3. The server judges each accepted line. Each world rates it zero to three;
   points are the sum, zero for a stitched line or one rejected by either world.
   A failed/unavailable judge invents no score: the player can retry and the
   rate-limit charge is refunded. Retained judgments are reused by the current
   rubric. No judge or signing secret reaches the browser.
4. There is no general writing clock. When all but one player have locked in,
   the last has thirty seconds. Once judgments finish and everyone is in or that
   deadline expires, every phone sees the same reveal order and clock. Lines run
   lowest to highest, first world then second, with points and authors last.
   Points apply once despite concurrent requests or reconnects.
5. The host advances after the reveal; another seated player can advance after
   the existing host grace. Three rounds use distinct pairs. Most points wins;
   round ties favor the more balanced line, exact ties are shared. Players can
   play again or return to the lobby. Late joiners wait for the next match cycle.
6. Refresh/reconnect restores the same guest seat using the signed continuity
   cookie. Explicit recovery starts a new identity rather than stealing a seat.
   A temporary transport failure does not duplicate a committed operation.
7. Unattended matches are swept by the existing minute cron, in bounded pages.
   Stored rooms, accepted lines, relationships, judgments, and scores survive a
   backend restart. Failures and maintenance refuse new writes rather than
   acknowledging writes that will be discarded.

## Backend migration and recovery

Players keep the public domain and accountless contract. Operator/machine
surfaces are private; they are not a reason to put public players behind Access.
The replacement backend must run the existing game protocol and rules without
requiring new player identities.

A cutover has one writer. A consistent encrypted snapshot is hash-verified in
private storage and restored in isolation before import. Canonical records,
IDs, creation times, references, and table mappings reconcile, not database-file
bytes. A final paused-source snapshot includes every accepted source write.
Rollback freezes and quiesces the new writer, exports one consistent timestamp,
restores and reconciles it before the old writer resumes. Accepted writes after
cutover may not be lost. The old backend stays intact/recoverable until parity
and recovery have been proven; retirement needs the owner's custody decision.

## Questions, not invented intent

- The approved lifetime and recovery objective for ephemeral game content are
  still open in Powder's accepted-data recovery item. This migration does not
  establish indefinite retention or silently add a purge policy.
- The proposed deck story and additional proposed design stories still need
  their recorded operator intent review. Migration checks use the existing core
  paths above, not an invented product approval.
