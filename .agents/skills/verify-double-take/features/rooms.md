# Create and join rooms

A host creates a room, shares its four-character code, and sees another guest
join the same roster. One player alone cannot start a match.

## Sub-features

- `room-create`: required name and a shareable code.
- `room-join`: code entry, required code length and shared roster.
- `room-invite`: invitation URL prefills the code.
- `room-solo`: start waits for another player.

## How to get to it (user POV)

Choose Start a game or Join a game on `/`. Join an invitation at `/?code=ABCD`
using the actual disposable room code.

## Driving it with verify.mjs

Preconditions: baseline README.md; two independent guest contexts.

- **Create:** run `scripts/verify.mjs run <new-evidence-directory>` relative to
  this skill. Submit an empty name and require Add your name; fill Your name
  with Verify Host and choose Start a game. Require a four-character Game code,
  one-player roster and no Start the game control. Retain `solo-host.*`.
- **Join:** choose Join a game in the second context, fill Your name with Verify
  Guest, submit code A and require the four character error. Fill the displayed
  host code and choose Join. Both Players lists show both guests; only the host
  can see Start the game. Retain `two-player-lobby.*`.
- **Invite:** during lifecycle cleanup, leave then navigate to `/?code=<code>`.
  Require the Game code value to match, fill Your name, Join and observe the roster.

## Gotchas

- Never create a production room for this verification scope.
- A room host is a guest; the app has no owner account.
- The fixed ports cannot isolate concurrent native backends on one host.
  Use the optional container wrapper for a separate network namespace.
- This two-player smoke does not prove the eight-player capacity limit.
