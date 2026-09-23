"use client";

import { useMutation, useQuery } from "convex/react";
import {
  Component,
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type FormEvent,
  type ReactNode,
  type RefObject,
} from "react";
import { useHeartbeat } from "@parlor/react";
import { ROOM_CODE_ALPHABET, ROOM_CODE_LENGTH } from "@parlor/core";
import { api } from "../convex/_generated/api";
import type { Id } from "../convex/_generated/dataModel";
import type {
  GameView,
  PairView as Pair,
  RevealLine as Line,
  World,
} from "../convex/game";
import { AUTHORED_PAIRS } from "../convex/content";
import {
  ADVANCE_GRACE_MS,
  compareLines,
  MAX_PLAYERS,
  MAX_WORDS,
  MIN_PLAYERS,
  ROUNDS_PER_MATCH,
  wordCount,
} from "../convex/rules";
import { revealEndsAt, revealPosition, type RevealStep } from "../lib/reveal";
import { showsGameTable } from "../lib/room-view";
import {
  CONNECTION_UNAVAILABLE,
  SEAT_RECOVERY_UNAVAILABLE,
  SEAT_RESET_UNAVAILABLE,
  playerFailureCopy,
} from "../lib/player-copy";
import { resetIssuer, useGuest } from "../app/providers";

type RoomId = Id<"rooms">;
type GameId = Id<"games">;
type PlayerId = Id<"players">;
type Zero = Line["zero"];
type Player = GameView["players"][number];
/** Room codes use Parlor's alphabet (digits 2 to 9 and letters); anything else is dropped. */
const normalizeCode = (value: string) =>
  [...value.toUpperCase()]
    .filter((char) => ROOM_CODE_ALPHABET.includes(char))
    .join("")
    .slice(0, ROOM_CODE_LENGTH);
/**
 * Version 4 UUIDs for request and session ids. `crypto.randomUUID` only exists
 * on secure origins, and phones on a LAN reach the game over plain http;
 * `getRandomValues` works everywhere.
 */
const randomId = () => {
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  bytes[6] = (bytes[6]! & 0x0f) | 0x40;
  bytes[8] = (bytes[8]! & 0x3f) | 0x80;
  const hex = Array.from(bytes, (byte) =>
    byte.toString(16).padStart(2, "0"),
  ).join("");
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
};
type RoomState = {
  viewerPlayerId: PlayerId | null;
  room: { code: string; hostPlayerId: PlayerId };
  members: {
    playerId: PlayerId;
    displayName: string;
    seatIndex: number;
    isHost: boolean;
  }[];
};
function failureCode(cause: unknown): string | undefined {
  if (typeof cause !== "object" || cause === null || !("data" in cause))
    return undefined;
  const data = cause.data;
  if (typeof data === "string") return data;
  if (
    typeof data === "object" &&
    data !== null &&
    "code" in data &&
    typeof data.code === "string"
  )
    return data.code;
  return undefined;
}
const ROOM_KEY = "double-take:room";
const EXAMPLE = AUTHORED_PAIRS.find((pair) => pair.key === "vow-villain")!;
const EXAMPLE_PAIR: Pair = {
  key: EXAMPLE.key,
  a: EXAMPLE.contextA,
  b: EXAMPLE.contextB,
};
const EXAMPLE_LINE = "I will love you until death takes me";
/** Each world's rating, 0 to 3: would it be appropriate to say this here? */
const RATINGS = ["Wrong here", "Awkward", "Fits", "Perfect"] as const;
const ZERO_LABEL: Record<Exclude<Zero, null>, string> = {
  stitched: "Stitched",
  rejected: "One world said no",
};
const ZERO_REASON: Record<Exclude<Zero, null>, string> = {
  stitched: "That's two lines stitched together. Make it one.",
  rejected: "One world doesn't buy it.",
};
const worldStyle = (world: World) =>
  ({ "--bg": world.bg, "--wink": world.ink }) as CSSProperties;
const displayName = (name: string, id: PlayerId, me: PlayerId | null) =>
  id === me ? "You" : name;
const namesTogether = (names: string[]) =>
  names.length <= 2
    ? names.join(" and ")
    : `${names.slice(0, -1).join(", ")} and ${names.at(-1)}`;
const initial = (name: string) => name.charAt(0).toUpperCase();

function Mark({ size = 26 }: { size?: number }) {
  return (
    <img
      className="mark"
      src={
        size <= 32
          ? "/brand/double-take-mark-32.svg"
          : "/brand/double-take-mark.svg"
      }
      width={size}
      height={size}
      alt=""
    />
  );
}
/** In a room, the logo and the Menu button both open the room menu; nothing leaves in one tap. */
function Header({
  onHome,
  onHelp,
  onMenu,
  round,
}: {
  onHome?: () => void;
  onHelp: () => void;
  onMenu?: () => void;
  round?: number;
}) {
  return (
    <header className="bar">
      <button
        className="home"
        type="button"
        onClick={onMenu ?? onHome}
        aria-label={onMenu ? "Game menu" : "Double Take home"}
      >
        <Mark />
        <span>Double Take</span>
      </button>
      <div className="bar-right">
        {round && (
          <span className="bar-note">
            Round {round} of {ROUNDS_PER_MATCH}
          </span>
        )}
        {onMenu && (
          <button className="quiet" type="button" onClick={onMenu}>
            Menu
          </button>
        )}
        <button
          className="icon-btn"
          type="button"
          onClick={onHelp}
          aria-label="How to play"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="9.2" />
            <path
              d="M9.6 9.4a2.5 2.5 0 1 1 3.4 2.3c-.6.3-1 .8-1 1.5v.6"
              strokeLinecap="round"
            />
            <circle cx="12" cy="16.9" r=".6" fill="currentColor" />
          </svg>
        </button>
      </div>
    </header>
  );
}
function Home({
  onStart,
  onJoin,
  onHelp,
}: {
  onStart: () => void;
  onJoin: () => void;
  onHelp: () => void;
}) {
  return (
    <main className="splash">
      <div className="splash-inner">
        <Mark size={72} />
        <h1>Double Take</h1>
        <p className="lede">
          Everyone gets the same two worlds. Write the line that fits both best.
        </p>
        <div className="actions">
          <button className="btn primary wide" onClick={onStart}>
            Start a game
          </button>
          <button className="btn wide" onClick={onJoin}>
            Join a game
          </button>
          <button className="quiet" onClick={onHelp}>
            How to play
          </button>
        </div>
        <p className="meta">2 to 8 players, each on their own phone.</p>
      </div>
    </main>
  );
}
function NameForm({
  mode,
  initialCode,
  token,
  onRoom,
  onHome,
  onHelp,
}: {
  mode: "start" | "join";
  initialCode: string;
  token: string;
  onRoom: (id: RoomId) => void;
  onHome: () => void;
  onHelp: () => void;
}) {
  const create = useMutation(api.rooms.createRoom);
  const join = useMutation(api.rooms.joinRoom);
  const startSession = useMutation(api.productEvents.startSession);
  const [name, setName] = useState("");
  const [code, setCode] = useState(initialCode);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const enter = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const displayName = name.trim();
    if (!displayName) {
      setError("Add your name so everyone knows who wrote what.");
      return;
    }
    if (mode === "join" && code.length !== ROOM_CODE_LENGTH) {
      setError(playerFailureCopy("join", "INVALID_ROOM_CODE"));
      return;
    }
    setBusy(true);
    setError(null);
    try {
      let roomId: RoomId;
      if (mode === "start") {
        roomId = (await create({ displayName, guestToken: token })).roomId;
      } else {
        const joined = await join({ code, displayName, guestToken: token });
        if (!joined.ok) {
          setError(playerFailureCopy("join", joined.code));
          return;
        }
        roomId = joined.roomId;
      }
      let newVisitor = false;
      try {
        newVisitor = localStorage.getItem("double-take:visited") === null;
        localStorage.setItem("double-take:visited", "1");
      } catch {
        /* Storage can be unavailable without preventing play. */
      }
      void startSession({
        sessionId: randomId(),
        mode: "match",
        newVisitor,
        guestToken: token,
      }).catch(() => undefined);
      onRoom(roomId);
    } catch (cause) {
      setError(
        mode === "join"
          ? playerFailureCopy("join", failureCode(cause))
          : CONNECTION_UNAVAILABLE,
      );
    } finally {
      setBusy(false);
    }
  };
  return (
    <>
      <Header onHome={onHome} onHelp={onHelp} />
      <main>
        <form className="page center" onSubmit={enter} noValidate>
          <h1 className="title">
            {mode === "start" ? "Start a game" : "Join a game"}
          </h1>
          {mode === "join" && (
            <div className="field">
              <label htmlFor="code">Game code</label>
              <input
                id="code"
                className="code"
                value={code}
                maxLength={ROOM_CODE_LENGTH}
                autoComplete="off"
                autoCapitalize="characters"
                spellCheck={false}
                onChange={(e) => setCode(normalizeCode(e.target.value))}
              />
            </div>
          )}
          <div className="field">
            <label htmlFor="name">Your name</label>
            <input
              id="name"
              value={name}
              maxLength={16}
              autoComplete="nickname"
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          {error && (
            <p className="alert" role="alert">
              {error}
            </p>
          )}
          <button className="btn primary wide" type="submit" disabled={busy}>
            {mode === "start" ? "Start a game" : "Join"}
          </button>
        </form>
      </main>
    </>
  );
}
function Toast({ message }: { message: string | null }) {
  return (
    <div className={`toast${message ? " show" : ""}`} role="status">
      {message}
    </div>
  );
}
function HowTo({
  dialogRef,
}: {
  dialogRef: RefObject<HTMLDialogElement | null>;
}) {
  return (
    <dialog ref={dialogRef} aria-labelledby="howto-h">
      <div className="howto">
        <div className="howto-top">
          <h2 id="howto-h">How to play</h2>
          <button
            className="icon-btn"
            aria-label="Close"
            onClick={() => dialogRef.current?.close()}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              aria-hidden="true"
            >
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>
        <p className="lede">
          Everyone gets the same two worlds. Write the line that fits both best.
        </p>
        <WorldCard pair={EXAMPLE_PAIR} text={EXAMPLE_LINE} />
        <p className="caption">Same words. Tap to see the other world.</p>
        <ul>
          <li>
            Each world rates from 0 to 3 how right your line would be to say
            there. <b>Your points are both added together.</b> Six is a double
            take.
          </li>
          <li>
            One sentence, twelve words at most. Stitched halves, and lines that
            would be wrong to say in either world, score nothing.
          </li>
          <li>
            Lines are revealed without names. Most points takes the round. Three
            rounds.
          </li>
        </ul>
        <button
          className="btn primary"
          onClick={() => dialogRef.current?.close()}
        >
          Got it
        </button>
      </div>
    </dialog>
  );
}
function Pips({ value }: { value: number }) {
  return (
    <span className="pips" aria-hidden="true">
      {[0, 1, 2].map((i) => (
        <span key={i} className={`pip${i < value ? " on" : ""}`} />
      ))}
    </span>
  );
}
function Verdict({
  rating,
  zero,
  shown,
}: {
  rating: number;
  zero: Zero;
  shown: boolean;
}) {
  const gated = zero === "stitched";
  return (
    <div className={`v${shown ? " shown" : ""}`} aria-hidden={!shown}>
      <Pips value={gated ? 0 : rating} />
      <span className="word">
        {gated ? "Doesn't count" : (RATINGS[rating] ?? RATINGS[0])}
      </span>
    </div>
  );
}
function WorldLayer({
  world,
  text,
  count,
  rating,
  zero,
  verdictShown,
  score,
  active,
  side,
}: {
  world: World;
  text: string;
  count?: string;
  rating?: number;
  zero?: Zero;
  verdictShown?: boolean;
  score?: {
    points: number;
    first: number;
    second: number;
    name: string;
    zero: Zero;
    shown: boolean;
  };
  active: boolean;
  side: "a" | "b";
}) {
  return (
    <div
      className={`layer layer-${side}`}
      style={worldStyle(world)}
      aria-hidden={!active}
    >
      {count && <p className="count">{count}</p>}
      <p className="world-label">{world.name}</p>
      <p className="line">{text}</p>
      <div className="verdict">
        {rating !== undefined && (
          <Verdict rating={rating} zero={zero ?? null} shown={!!verdictShown} />
        )}
        {score && (
          <div
            className={`score${score.shown ? " shown" : ""}`}
            aria-hidden={!score.shown}
          >
            <b>{score.points}</b>
            <span className="unit">
              {score.zero === "rejected"
                ? `${score.first} + ${score.second}, so no points`
                : score.zero
                  ? "points"
                  : `${score.first} + ${score.second} points`}
            </span>
            {score.points === 6 && <p className="named">Double take</p>}
            <p className="by">{score.name}</p>
            {score.zero && <p className="why">{ZERO_REASON[score.zero]}</p>}
          </div>
        )}
      </div>
    </div>
  );
}
/**
 * One line shown in both worlds. Flips on tap by itself, or follows `side`
 * when a parent flips a group of cards together.
 */
function WorldCard({
  pair,
  text,
  first,
  second,
  zero,
  side: sharedSide,
  onFlip,
}: {
  pair: Pair;
  text: string;
  first?: number;
  second?: number;
  zero?: Zero;
  side?: "a" | "b";
  onFlip?: () => void;
}) {
  const [ownSide, setOwnSide] = useState<"a" | "b">("a");
  const side = sharedSide ?? ownSide;
  return (
    <button
      type="button"
      className="card stage"
      data-side={side}
      onClick={onFlip ?? (() => setOwnSide((s) => (s === "a" ? "b" : "a")))}
      aria-label={`${text}. Read as ${pair[side].name}. Flip to ${pair[side === "a" ? "b" : "a"].name}.`}
    >
      <WorldLayer
        side="a"
        world={pair.a}
        text={text}
        rating={first}
        zero={zero}
        verdictShown
        active={side === "a"}
      />
      <WorldLayer
        side="b"
        world={pair.b}
        text={text}
        rating={second}
        zero={zero}
        verdictShown
        active={side === "b"}
      />
    </button>
  );
}
function Lobby({
  roomId,
  token,
  state,
  onMenu,
  onHelp,
  toast,
}: {
  roomId: RoomId;
  token: string;
  state: RoomState;
  onMenu: () => void;
  onHelp: () => void;
  toast: (message: string) => void;
}) {
  const start = useMutation(api.game.start);
  const requestRef = useRef<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const members = [...state.members].sort((a, b) => a.seatIndex - b.seatIndex);
  const isHost = state.room.hostPlayerId === state.viewerPlayerId;
  const host =
    members.find((m) => m.playerId === state.room.hostPlayerId)?.displayName ??
    "The host";
  const enough = members.length >= MIN_PLAYERS && members.length <= MAX_PLAYERS;
  return (
    <>
      <Header onMenu={onMenu} onHelp={onHelp} />
      <main>
        <div className="page center">
          <div className="code-block">
            <h1 className="meta">Game code</h1>
            <p
              className="code"
              aria-label={`Game code ${state.room.code.split("").join(" ")}`}
            >
              {state.room.code}
            </p>
            <button
              className="quiet"
              onClick={async () => {
                try {
                  await navigator.clipboard.writeText(
                    `${location.origin}/?code=${state.room.code}`,
                  );
                  toast("Invite link copied.");
                } catch {
                  toast("Couldn't copy. Share the code instead.");
                }
              }}
            >
              Copy invite link
            </button>
          </div>
          <ul className="roster" aria-label="Players">
            {members.map((member) => (
              <li key={member.playerId}>
                <span className="avatar" aria-hidden="true">
                  {initial(member.displayName)}
                </span>
                {displayName(
                  member.displayName,
                  member.playerId,
                  state.viewerPlayerId,
                )}
                {member.isHost && <span className="tag">Host</span>}
              </li>
            ))}
            {members.length < MAX_PLAYERS && (
              <li className="joining">
                <span className="avatar" aria-hidden="true" />
                Waiting for friends to join
              </li>
            )}
          </ul>
          <p className="meta">
            {members.length} {members.length === 1 ? "player" : "players"}.
            Three rounds, about five minutes.
          </p>
          {notice && (
            <p className="alert" role="alert">
              {notice}
            </p>
          )}
          {isHost ? (
            <button
              className="btn primary wide"
              disabled={!enough || busy}
              onClick={async () => {
                setBusy(true);
                setNotice(null);
                requestRef.current ??= randomId();
                try {
                  await start({
                    roomId,
                    requestId: requestRef.current,
                    guestToken: token,
                  });
                } catch (cause) {
                  setNotice(playerFailureCopy("start", failureCode(cause)));
                } finally {
                  setBusy(false);
                }
              }}
            >
              {enough ? "Start the game" : "Waiting for another player"}
            </button>
          ) : (
            <p className="wait-note">
              {host} starts the game when everyone is here.
            </p>
          )}
          <button className="quiet" onClick={onMenu}>
            Leave the game
          </button>
        </div>
      </main>
    </>
  );
}
function useClock(interval: number) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), interval);
    return () => window.clearInterval(timer);
  }, [interval]);
  return now;
}
function Seam({
  game,
  token,
  now,
}: {
  game: GameView;
  token: string;
  now: number;
}) {
  const seamRef = useRef<HTMLElement>(null);
  useEffect(() => {
    const viewport = window.visualViewport;
    if (!viewport) return;
    const resize = () => {
      if (seamRef.current)
        seamRef.current.style.setProperty(
          "--stage-height",
          `${Math.max(0, viewport.height - 56)}px`,
        );
    };
    resize();
    viewport.addEventListener("resize", resize);
    return () => viewport.removeEventListener("resize", resize);
  }, []);
  const submit = useMutation(api.game.submit);
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const failed = game.me.line?.status === "failed";
  useEffect(() => {
    if (failed && game.me.line) setText(game.me.line.text);
  }, [failed, game.me.line?.text]);
  const locked = game.me.line !== null && !failed;
  const missing = game.players.filter((p) => !p.locked);
  const words = wordCount(text);
  const left = MAX_WORDS - words;
  const seconds =
    game.lastDeadline === null
      ? null
      : Math.max(0, Math.ceil((game.lastDeadline - now) / 1000));
  const waiting = namesTogether(
    missing.map((p) => displayName(p.name, p.playerId, game.me.playerId)),
  );
  let status = "Nobody has locked in yet.";
  if (!game.me.seated)
    status = "You're watching this round. You can play in the next game.";
  else if (locked)
    status =
      missing.length === 0
        ? "Everyone's in. Here come the lines."
        : seconds !== null
          ? `Waiting on ${waiting}. ${seconds} seconds.`
          : `Locked in. Waiting on ${waiting}.`;
  else if (
    seconds !== null &&
    missing.some((p) => p.playerId === game.me.playerId)
  )
    status = `You're the last one. ${seconds} seconds.`;
  else if (left < 0)
    status = `${-left} ${-left === -1 ? "word" : "words"} over`;
  else if (left <= 3) status = `${left} ${left === 1 ? "word" : "words"} left`;
  else if (missing.length < game.players.length)
    status = `${game.players.length - missing.length} of ${game.players.length} locked in.`;
  const lock = async (event: FormEvent) => {
    event.preventDefault();
    if (
      busy ||
      locked ||
      !game.me.seated ||
      words === 0 ||
      left < 0 ||
      seconds === 0 ||
      text.length > 160
    )
      return;
    setBusy(true);
    setNotice(null);
    try {
      const result = await submit({
        gameId: game.gameId,
        text: text.trim().replace(/\s+/g, " "),
        guestToken: token,
      });
      if (!result.ok) setNotice(playerFailureCopy("submit", result.code));
    } catch (cause) {
      setNotice(playerFailureCopy("submit", failureCode(cause)));
    } finally {
      setBusy(false);
    }
  };
  return (
    <main ref={seamRef} className="seam" aria-labelledby="write-h">
      <h1 className="sr-only" id="write-h">
        Round {game.round}: {game.pair.a.name} and {game.pair.b.name}
      </h1>
      <div className="world world-a" style={worldStyle(game.pair.a)}>
        <p className="world-label">{game.pair.a.name}</p>
      </div>
      <form className="band" onSubmit={lock} noValidate>
        <ul className="table" aria-label="Who has locked in">
          {game.players.map((p) => (
            <li className={`seat${p.locked ? " in" : ""}`} key={p.playerId}>
              <span className="avatar" aria-hidden="true">
                {initial(p.name)}
              </span>
              <span>{displayName(p.name, p.playerId, game.me.playerId)}</span>
              <span className="sr-only">
                {p.locked ? "locked in" : "writing"}
              </span>
            </li>
          ))}
        </ul>
        {game.me.seated && !locked && (
          <>
            <label className="sr-only" htmlFor="line">
              Your line, one sentence, twelve words at most
            </label>
            <textarea
              id="line"
              rows={1}
              maxLength={160}
              value={text}
              placeholder="Write one line for both."
              autoComplete="off"
              autoCapitalize="sentences"
              enterKeyHint="done"
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  e.currentTarget.form?.requestSubmit();
                }
              }}
            />
          </>
        )}
        {locked && <p className="locked-line">{game.me.line?.text}</p>}
        {(failed || notice) && (
          <p className="alert" role="alert">
            {notice ?? "Your line didn't go through. Lock it in again."}
          </p>
        )}
        <p
          className={`status${seconds !== null && !locked ? " strong" : ""}`}
          aria-live="polite"
        >
          {status}
        </p>
        {game.me.seated && !locked && (
          <button
            className="btn primary wide"
            type="submit"
            disabled={
              busy ||
              words === 0 ||
              left < 0 ||
              text.length > 160 ||
              seconds === 0
            }
          >
            Lock it in
          </button>
        )}
      </form>
      <div className="world world-b" style={worldStyle(game.pair.b)}>
        <p className="world-label">{game.pair.b.name}</p>
      </div>
    </main>
  );
}
function Flood({ pair, round }: { pair: Pair; round: number }) {
  return (
    <main className="seam flooding" aria-labelledby="flood-h">
      <h1 className="sr-only" id="flood-h">
        Round {round} reveal
      </h1>
      <div className="world world-a" style={worldStyle(pair.a)}>
        <p className="world-label">{pair.a.name}</p>
      </div>
      <div className="band" aria-hidden="true" />
      <div className="world world-b" style={worldStyle(pair.b)}>
        <p className="world-label">{pair.b.name}</p>
      </div>
    </main>
  );
}
function Reveal({ game, now }: { game: GameView; now: number }) {
  const reveal = game.reveal!;
  const position = revealPosition(reveal.startedAt, reveal.lines.length, now);
  const line = position.done ? null : reveal.lines[position.index];
  const step: RevealStep = position.done ? "line" : position.step;
  const side = step === "line" || step === "verdictA" ? "a" : "b";
  const announced = line
    ? step === "verdictA"
      ? `${line.text}. ${game.pair.a.name}: ${line.zero === "stitched" ? "Doesn't count" : RATINGS[line.first]}.`
      : step === "verdictB"
        ? `${game.pair.b.name}: ${line.zero === "stitched" ? "Doesn't count" : RATINGS[line.second]}.`
        : step === "score"
          ? `${line.points} points. ${displayName(line.name, line.playerId, game.me.playerId)}.`
          : ""
    : "";
  useEffect(() => {
    if (line)
      document
        .querySelector<HTMLMetaElement>('meta[name="theme-color"]')
        ?.setAttribute("content", game.pair[side].bg);
    return () => {
      document
        .querySelector<HTMLMetaElement>('meta[name="theme-color"]')
        ?.setAttribute("content", "#ffffff");
    };
  }, [line, side, game.pair]);
  if (!line)
    return (
      <main className="reveal">
        <h1 className="sr-only">Round {game.round} reveal</h1>
      </main>
    );
  const score = {
    points: line.points,
    first: line.first,
    second: line.second,
    name: displayName(line.name, line.playerId, game.me.playerId),
    zero: line.zero,
    shown: step === "score",
  };
  const index = position.done ? 0 : position.index;
  return (
    <main className="reveal" aria-labelledby="reveal-h">
      <h1 className="sr-only" id="reveal-h">
        Round {game.round} reveal
      </h1>
      <div className="stage" data-side={side} key={index}>
        <WorldLayer
          side="a"
          world={game.pair.a}
          text={line.text}
          count={`Line ${index + 1} of ${reveal.lines.length}`}
          rating={line.first}
          zero={line.zero}
          verdictShown={step !== "line"}
          active={side === "a"}
        />
        <WorldLayer
          side="b"
          world={game.pair.b}
          text={line.text}
          count={`Line ${index + 1} of ${reveal.lines.length}`}
          rating={line.second}
          zero={line.zero}
          verdictShown={step === "verdictB" || step === "score"}
          score={score}
          active={side === "b"}
        />
      </div>
      <p className="sr-only" aria-live="polite" aria-atomic="true">
        {announced}
      </p>
    </main>
  );
}
function Standings({
  players,
  me,
  gain,
}: {
  players: Player[];
  me: PlayerId;
  gain: boolean;
}) {
  const sorted = [...players].sort(
    (a, b) => b.score - a.score || a.seatIndex - b.seatIndex,
  );
  const top = sorted[0]?.score ?? 0;
  return (
    <ol className="standings">
      {sorted.map((p) => (
        <li
          className={top > 0 && p.score === top ? "lead" : ""}
          key={p.playerId}
        >
          <span className="pos">
            {1 + sorted.filter((other) => other.score > p.score).length}
          </span>
          <span>{displayName(p.name, p.playerId, me)}</span>
          <span className="gain">
            {gain && p.roundPoints > 0 ? `+${p.roundPoints}` : ""}
          </span>
          <span className="total">{p.score}</span>
        </li>
      ))}
    </ol>
  );
}
function RoundResult({
  game,
  token,
  hostName,
  now,
}: {
  game: GameView;
  token: string;
  hostName: string;
  now: number;
}) {
  const advance = useMutation(api.game.advance);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [side, setSide] = useState<"a" | "b">("a");
  const flip = () => setSide((s) => (s === "a" ? "b" : "a"));
  const lines = game.reveal?.lines ?? [];
  const ranked = [...lines].sort(compareLines);
  const best = ranked[0];
  const winners =
    best && best.points > 0
      ? ranked.filter((line) => compareLines(line, best) === 0)
      : [];
  const winningNames = winners
    .map((line) => displayName(line.name, line.playerId, game.me.playerId))
    .sort((a, b) => (a === "You" ? -1 : b === "You" ? 1 : 0));
  const title =
    winners.length === 0
      ? "Nobody scored this round"
      : winners.length > 1
        ? `${namesTogether(winningNames)} tie`
        : `${winningNames[0]} ${winningNames[0] === "You" ? "take" : "takes"} the round`;
  const canAdvance =
    game.isHost ||
    (game.me.seated &&
      !!game.reveal &&
      now >=
        revealEndsAt(game.reveal.startedAt, lines.length) + ADVANCE_GRACE_MS);
  const last = game.round === game.rounds;
  return (
    <main>
      <div className="page">
        <div className="center heading">
          <p className="meta">
            Round {game.round} of {game.rounds}
          </p>
          <h1 className="title">{title}</h1>
        </div>
        {lines.length > 0 && (
          <div
            className="world-toggle"
            role="radiogroup"
            aria-label="Read every line as"
          >
            {(["a", "b"] as const).map((key) => (
              <button
                key={key}
                type="button"
                role="radio"
                aria-checked={side === key}
                onClick={() => setSide(key)}
              >
                {game.pair[key].name}
              </button>
            ))}
          </div>
        )}
        <ol className="lines" aria-label="Every line this round">
          {ranked.map((line) => (
            <li key={line.playerId}>
              <WorldCard
                pair={game.pair}
                text={line.text}
                first={line.first}
                second={line.second}
                zero={line.zero}
                side={side}
                onFlip={flip}
              />
              <p className="line-by">
                <span className="pts">{line.points}</span>
                <b>{displayName(line.name, line.playerId, game.me.playerId)}</b>
                <span className="reason">
                  {line.zero
                    ? ZERO_LABEL[line.zero]
                    : `${line.first} + ${line.second} points`}
                </span>
              </p>
            </li>
          ))}
          {game.players
            .filter((p) => !lines.some((line) => line.playerId === p.playerId))
            .map((p) => (
              <li key={p.playerId}>
                <p className="line-by">
                  <span className="pts">0</span>
                  <b>{displayName(p.name, p.playerId, game.me.playerId)}</b>
                  <span className="reason">No line</span>
                </p>
              </li>
            ))}
        </ol>
        <section className="scores-section" aria-labelledby="scores-h">
          <h2 className="sec" id="scores-h">
            Scores
          </h2>
          <Standings players={game.players} me={game.me.playerId} gain />
        </section>
        <div className="actions">
          {canAdvance ? (
            <button
              className="btn primary wide"
              disabled={busy}
              onClick={async () => {
                setBusy(true);
                setNotice(null);
                try {
                  const result = await advance({
                    gameId: game.gameId,
                    guestToken: token,
                  });
                  if (!result.ok)
                    setNotice(playerFailureCopy("advance", result.code));
                } catch (cause) {
                  setNotice(playerFailureCopy("advance", failureCode(cause)));
                } finally {
                  setBusy(false);
                }
              }}
            >
              {last ? "See who won" : "Next round"}
            </button>
          ) : (
            <p className="wait-note">
              {last
                ? `${hostName} will show the final scores.`
                : `${hostName} starts the next round.`}
            </p>
          )}
          {notice && (
            <p className="alert" role="alert">
              {notice}
            </p>
          )}
        </div>
      </div>
    </main>
  );
}
function Final({
  game,
  onAgain,
  onLobby,
  busy,
  notice,
}: {
  game: GameView;
  onAgain: () => void;
  onLobby: () => void;
  busy: boolean;
  notice: string | null;
}) {
  const top = Math.max(...game.players.map((p) => p.score));
  const winners = game.players
    .filter((p) => p.score === top)
    .map((p) => displayName(p.name, p.playerId, game.me.playerId))
    .sort((a, b) => (a === "You" ? -1 : b === "You" ? 1 : 0));
  const title =
    winners.length > 1
      ? `${namesTogether(winners)} tie`
      : `${winners[0]} ${winners[0] === "You" ? "win" : "wins"}`;
  const best = game.bestLine;
  return (
    <main>
      <div className="page">
        <div className="center heading">
          <p className="meta">Final scores</p>
          <h1 className="title">{title}</h1>
        </div>
        <Standings players={game.players} me={game.me.playerId} gain={false} />
        {best && (
          <section className="best-section" aria-labelledby="best-h">
            <h2 className="sec" id="best-h">
              Line of the game
            </h2>
            <WorldCard
              pair={best.pair}
              text={best.text}
              first={best.first}
              second={best.second}
              zero={best.zero}
            />
            <p className="caption">
              {best.name}, {best.points} points. Tap to flip.
            </p>
          </section>
        )}
        <div className="actions">
          {game.isHost && (
            <button
              className="btn primary wide"
              disabled={busy}
              onClick={onAgain}
            >
              Play again
            </button>
          )}
          <button className="btn wide" onClick={onLobby}>
            Back to lobby
          </button>
          {notice && (
            <p className="alert" role="alert">
              {notice}
            </p>
          )}
        </div>
      </div>
    </main>
  );
}
function Game({
  gameId,
  roomId,
  token,
  onMenu,
  onLobby,
  onHelp,
}: {
  gameId: GameId;
  roomId: RoomId;
  token: string;
  onMenu: () => void;
  onLobby: () => void;
  onHelp: () => void;
}) {
  const view = useQuery(api.game.view, { gameId, guestToken: token });
  const start = useMutation(api.game.start);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const requestRef = useRef<string | null>(null);
  const now = useClock(view?.phase === "reveal" ? 100 : 1000);
  if (!view)
    return (
      <>
        <Header onMenu={onMenu} onHelp={onHelp} />
        <main className="page">
          <h1 className="title">Finding your game…</h1>
        </main>
      </>
    );
  const hostName =
    view.players.find((p) => p.playerId === view.hostPlayerId)?.name ??
    "The host";
  const position =
    view.phase === "reveal" && view.reveal
      ? revealPosition(view.reveal.startedAt, view.reveal.lines.length, now)
      : null;
  const playAgain = async () => {
    setBusy(true);
    setNotice(null);
    requestRef.current ??= randomId();
    try {
      await start({ roomId, requestId: requestRef.current, guestToken: token });
    } catch (cause) {
      setNotice(playerFailureCopy("start", failureCode(cause)));
    } finally {
      setBusy(false);
    }
  };
  return (
    <>
      <Header
        onMenu={onMenu}
        onHelp={onHelp}
        round={view.phase === "finished" ? undefined : view.round}
      />
      {view.phase === "writing" ? (
        <Seam
          key={`${gameId}-${view.round}`}
          game={view}
          token={token}
          now={now}
        />
      ) : view.phase === "reveal" &&
        view.reveal &&
        now < view.reveal.startedAt + 460 ? (
        <Flood pair={view.pair} round={view.round} />
      ) : view.phase === "reveal" && position && !position.done ? (
        <Reveal game={view} now={now} />
      ) : view.phase === "reveal" ? (
        <RoundResult game={view} token={token} hostName={hostName} now={now} />
      ) : (
        <Final
          game={view}
          onAgain={playAgain}
          onLobby={onLobby}
          busy={busy}
          notice={notice}
        />
      )}
    </>
  );
}

/**
 * Every way out of a room, in one place. Opening it is the confirmation step:
 * nothing here happens on the first tap of the header.
 */
function RoomMenu({
  dialogRef,
  roomId,
  token,
  gameId,
  isHost,
  gameRunning,
  onLeave,
}: {
  dialogRef: RefObject<HTMLDialogElement | null>;
  roomId: RoomId;
  token: string;
  gameId: GameId | null;
  isHost: boolean;
  gameRunning: boolean;
  onLeave: () => void;
}) {
  const endGame = useMutation(api.game.endGame);
  const closeRoom = useMutation(api.rooms.closeRoom);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const close = () => dialogRef.current?.close();
  const run = async (action: () => Promise<unknown>) => {
    setBusy(true);
    setNotice(null);
    try {
      await action();
      close();
    } catch {
      setNotice(CONNECTION_UNAVAILABLE);
    } finally {
      setBusy(false);
    }
  };
  return (
    <dialog ref={dialogRef} aria-labelledby="menu-h">
      <div className="howto menu">
        <h2 id="menu-h">Game menu</h2>
        {isHost && gameRunning && gameId && (
          <div className="menu-item">
            <button
              className="btn wide"
              disabled={busy}
              onClick={() => run(() => endGame({ gameId, guestToken: token }))}
            >
              End this game
            </button>
            <p className="meta">Everyone goes back to the lobby.</p>
          </div>
        )}
        {isHost && (
          <div className="menu-item">
            <button
              className="btn wide"
              disabled={busy}
              onClick={() =>
                run(() => closeRoom({ roomId, guestToken: token }))
              }
            >
              Close the room
            </button>
            <p className="meta">Ends the game for everyone.</p>
          </div>
        )}
        <div className="menu-item">
          <button
            className="btn wide"
            disabled={busy}
            onClick={() => {
              close();
              onLeave();
            }}
          >
            Leave the game
          </button>
          <p className="meta">
            {isHost
              ? "Someone else becomes host."
              : "The others can keep playing."}
          </p>
        </div>
        {notice && (
          <p className="alert" role="alert">
            {notice}
          </p>
        )}
        <button className="btn primary wide" data-safe onClick={close}>
          Keep playing
        </button>
      </div>
    </dialog>
  );
}

function Room({
  roomId,
  token,
  onLeave,
  onGone,
  onHelp,
  toast,
}: {
  roomId: RoomId;
  token: string;
  onLeave: () => void;
  /** The room is gone for this player (closed by the host, or unreachable). */
  onGone: (message: string) => void;
  onHelp: () => void;
  toast: (message: string) => void;
}) {
  const state = useQuery(api.rooms.getRoomState, { roomId, guestToken: token });
  const brief = useQuery(api.game.forRoom, { roomId, guestToken: token });
  const heartbeat = useMutation(api.rooms.heartbeat);
  const menuRef = useRef<HTMLDialogElement>(null);
  // A finished game stays on screen until each player chooses Back to lobby.
  const [dismissed, setDismissed] = useState<GameId | null>(null);
  const closed = brief?.closed === true || state?.room.closedAt !== undefined;
  useHeartbeat({
    enabled: !closed,
    send: async () => {
      try {
        await heartbeat({ roomId, guestToken: token });
      } catch {
        /* A closed or missing room surfaces through the queries. */
      }
    },
  });
  useEffect(() => {
    if (closed) onGone("The host closed the room.");
  }, [closed, onGone]);
  const openMenu = () => {
    const menu = menuRef.current;
    menu?.showModal();
    // The safe choice takes focus, so Enter never ends a game by accident.
    menu?.querySelector<HTMLButtonElement>("[data-safe]")?.focus();
  };
  if (!state || !brief || closed)
    return (
      <>
        <Header onMenu={openMenu} onHelp={onHelp} />
        <main className="page">
          <h1 className="title">Finding your game…</h1>
        </main>
      </>
    );
  const isHost = state.room.hostPlayerId === state.viewerPlayerId;
  const showGame =
    brief.gameId !== null &&
    brief.gameId !== dismissed &&
    showsGameTable(state.activeMatch !== null, brief.phase);
  return (
    <>
      {showGame ? (
        <Game
          key={brief.gameId}
          gameId={brief.gameId!}
          roomId={roomId}
          token={token}
          onMenu={openMenu}
          onLobby={() => setDismissed(brief.gameId)}
          onHelp={onHelp}
        />
      ) : (
        <Lobby
          roomId={roomId}
          token={token}
          state={state}
          onMenu={openMenu}
          onHelp={onHelp}
          toast={toast}
        />
      )}
      <RoomMenu
        dialogRef={menuRef}
        roomId={roomId}
        token={token}
        gameId={brief.gameId}
        isHost={isHost}
        gameRunning={state.activeMatch !== null}
        onLeave={onLeave}
      />
    </>
  );
}

/** Any failure inside a room (missing, reset, unreachable) returns the player home. */
class RoomBoundary extends Component<
  { onError: () => void; children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch() {
    this.props.onError();
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}
export function DoubleTake() {
  const guest = useGuest();
  const [mounted, setMounted] = useState(false);
  const [roomId, setRoomId] = useState<RoomId | null>(null);
  const [mode, setMode] = useState<"home" | "start" | "join">("home");
  const [code, setCode] = useState("");
  const [resetting, setResetting] = useState(false);
  const [resetError, setResetError] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const leaveRoom = useMutation(api.rooms.leaveRoom);
  const rememberRoom = useCallback((id: RoomId | null) => {
    setRoomId(id);
    try {
      if (id) localStorage.setItem(ROOM_KEY, id);
      else localStorage.removeItem(ROOM_KEY);
    } catch {
      /* Play continues when storage is blocked. */
    }
  }, []);
  useEffect(() => {
    try {
      const saved = localStorage.getItem(ROOM_KEY);
      if (saved) setRoomId(saved as RoomId);
    } catch {
      /* No saved seat. */
    }
    const invite = new URLSearchParams(location.search).get("code");
    if (invite) {
      setCode(normalizeCode(invite));
      setMode("join");
    }
    setMounted(true);
  }, []);
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 2600);
    return () => clearTimeout(timer);
  }, [toast]);
  const leave = async () => {
    if (roomId && guest.credential) {
      try {
        await leaveRoom({ roomId, guestToken: guest.credential });
      } catch {
        setToast(CONNECTION_UNAVAILABLE);
        return;
      }
    }
    rememberRoom(null);
    setMode("home");
    if (location.search) history.replaceState(null, "", location.pathname);
  };
  /** The room ended without this player choosing to leave; go home and say why. */
  const gone = useCallback(
    (message: string) => {
      rememberRoom(null);
      setMode("home");
      setToast(message);
    },
    [rememberRoom],
  );
  const home = () => {
    setMode("home");
    if (location.search) history.replaceState(null, "", location.pathname);
  };
  const fresh = async () => {
    if (resetting) return;
    setResetting(true);
    setResetError(null);
    try {
      rememberRoom(null);
      guest.clear();
      await guest.acquire(resetIssuer);
    } catch {
      setResetError(SEAT_RESET_UNAVAILABLE);
    } finally {
      setResetting(false);
    }
  };
  const help = () => dialogRef.current?.showModal();
  let screen;
  if (!mounted || (!guest.credential && (guest.loading || !guest.error))) {
    screen = (
      <main className="splash">
        <div className="splash-inner">
          <Mark size={72} />
          <h1>Double Take</h1>
          <p className="lede">Finding your seat…</p>
        </div>
      </main>
    );
  } else if (!guest.credential) {
    screen = (
      <>
        <Header onHome={home} onHelp={help} />
        <main className="page center">
          <h1 className="title">We couldn't restore your seat.</h1>
          <p className="meta">{SEAT_RECOVERY_UNAVAILABLE}</p>
          <p className="meta">
            Starting fresh makes a new seat. It won't restore your old game or
            points.
          </p>
          <button
            className="btn primary wide"
            disabled={resetting}
            onClick={fresh}
          >
            Start fresh
          </button>
          {resetError && (
            <p className="alert" role="alert">
              {resetError}
            </p>
          )}
        </main>
      </>
    );
  } else if (roomId) {
    screen = (
      <RoomBoundary
        key={roomId}
        onError={() => gone("That game isn't available anymore.")}
      >
        <Room
          roomId={roomId}
          token={guest.credential}
          onLeave={() => void leave()}
          onGone={gone}
          onHelp={help}
          toast={setToast}
        />
      </RoomBoundary>
    );
  } else if (mode !== "home") {
    screen = (
      <NameForm
        key={mode}
        mode={mode}
        initialCode={code}
        token={guest.credential}
        onRoom={rememberRoom}
        onHome={home}
        onHelp={help}
      />
    );
  } else {
    screen = (
      <Home
        onStart={() => setMode("start")}
        onJoin={() => setMode("join")}
        onHelp={help}
      />
    );
  }
  return (
    <>
      {screen}
      <HowTo dialogRef={dialogRef} />
      <Toast message={toast} />
    </>
  );
}
