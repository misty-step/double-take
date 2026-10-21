# Room lifecycle

The host can end a game or close a room. A guest can leave and rejoin; when the
host leaves, another guest inherits host controls. Closed invites are rejected.

## Sub-features

- `host-controls`: only the host sees End this game and Close the room.
- `game-end`: ending a running game returns both guests to the lobby.
- `leave-rejoin`: leaving updates the other roster; invitation joins again.
- `host-transfer`: a departing host hands controls to the remaining guest.
- `room-close`: closure returns home; the old code cannot be used again.

## How to get to it (user POV)

Choose Game menu (the logo) or Menu in a room. Choose End this game, Leave the
game, Close the room, or Keep playing. Rejoin using the invitation URL.

## Driving it with verify.mjs

Preconditions: baseline README.md, a fixture-backed match finished and replayed.

- **End:** run `scripts/verify.mjs run <new-evidence-directory>` relative to this
  skill. After replay, open the guest's Menu and require host controls absent;
  Keep playing. Open the host's Game menu and choose End this game. Both Players
  lists return.
- **Leave/rejoin:** guest chooses Leave the game, returns home, and disappears
  from the host's Players list. Visit the invitation URL and Join again.
- **Transfer/close:** original host leaves. Remaining guest's menu now offers
  Close the room. Close, return home, retry the old code and require No game with
  that code. Retain `closed-room-rejection.*`.

## Gotchas

- The logo (Game menu) and text Menu share the dialog; the run drives both.
- UI control visibility is not server-side denial proof; the existing backend
  tests cover denied mutations separately.
- All rooms here are disposable local data; no production room writes are allowed.
