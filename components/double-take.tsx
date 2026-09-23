"use client";

import { useMutation, useQuery } from "convex/react";
import {
  Component,
  useCallback,
  useEffect,
  useLayoutEffect,
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
  LAST_PLAYER_MS,
  MAX_WORDS,
  MIN_PLAYERS,
  ROUNDS_PER_MATCH,
  wordCount,
} from "../convex/rules";
import { revealEndsAt, revealPosition, type RevealStep } from "../lib/reveal";
import { showsGameTable } from "../lib/room-view";
import { MARK_SVG, svgDataUrl } from "../lib/brand";
import { curly } from "../lib/typeset";
import {
  CONNECTION_UNAVAILABLE,
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
/** World names as a typesetter would set them; the live deck is typeset on the server. */
const typesetWorld = <T extends { name: string }>(world: T): T => ({
  ...world,
  name: curly(world.name),
});
const authoredPair = (key: string) => {
  const pair = AUTHORED_PAIRS.find((candidate) => candidate.key === key)!;
  return { a: typesetWorld(pair.contextA), b: typesetWorld(pair.contextB) };
};
const EXAMPLE_PAIR: Pair = {
  key: "vow-villain",
  ...authoredPair("vow-villain"),
};
const EXAMPLE_LINE = "I will love you until death takes me.";
/** The home screen's example: authored pairs with lines and ratings from calibration runs. */
const HOME_EXAMPLES = [
  {
    key: "vow-villain",
    text: "I have waited years for this moment.",
    first: 2,
    second: 3,
  },
  { key: "orbit-hold", text: "Please stay on the line.", first: 2, second: 3 },
  {
    key: "coach-grief",
    text: "What we do next is what matters.",
    first: 3,
    second: 2,
  },
  {
    key: "letter-fineprint",
    text: "This binds me to you forever.",
    first: 3,
    second: 1,
  },
].map(({ key, ...line }) => ({ ...authoredPair(key), ...line }));
/** Each world's rating, 0 to 3: would it be appropriate to say this here? */
const RATINGS = ["Wrong here", "Awkward", "Fits", "Perfect"] as const;
/** Why a line scored nothing. One name per reason, everywhere it appears. */
const ZERO_LABEL: Record<Exclude<Zero, null>, string> = {
  stitched: "Stitched together",
  rejected: "One world said no",
};
const ZERO_REASON: Record<Exclude<Zero, null>, string> = {
  stitched: "Two lines stitched together. It has to be one line.",
  rejected: "One world said no, so it scores nothing.",
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

const MARK_SRC = svgDataUrl(MARK_SVG);
function Mark({ size = 26 }: { size?: number }) {
  return (
    // A data URL, so the mark never waits on a network request.
    <img className="mark" src={MARK_SRC} width={size} height={size} alt="" />
  );
}
/**
 * In a room, the logo and the Menu button both open the room menu; nothing
 * leaves in one tap. During a reveal the bar takes on the world's colors so
 * the world fills the whole screen.
 */
function Header({
  onHome,
  onHelp,
  onMenu,
  round,
  tone,
  helpText,
}: {
  onHome?: () => void;
  onHelp: () => void;
  onMenu?: () => void;
  round?: number;
  tone?: { world: World; side: "a" | "b" };
  helpText?: boolean;
}) {
  return (
    <header
      className={`bar${tone ? " toned" : ""}`}
      data-side={tone?.side}
      style={tone ? worldStyle(tone.world) : undefined}
    >
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
        {helpText ? (
          <button className="quiet" type="button" onClick={onHelp}>
            How to play
          </button>
        ) : (
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
        )}
      </div>
    </header>
  );
}
/** A world's swatch and its rating word, as in the ranked list. */
function Rating({ world, rating }: { world: World; rating: string }) {
  return (
    <span className="rating">
      <span className="swatch" style={worldStyle(world)} aria-hidden="true" />
      <span className="sr-only">{world.name}: </span>
      {rating}
    </span>
  );
}
/**
 * The home screen is the game in miniature: two worlds, and a real line that
 * fits both between them. It cycles through a few examples with the same wipe
 * as the reveal; with reduced motion it holds the first one.
 */
function Home({
  onStart,
  onJoin,
  onHelp,
}: {
  onStart: () => void;
  onJoin: () => void;
  onHelp: () => void;
}) {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(
      () => setIndex((i) => (i + 1) % HOME_EXAMPLES.length),
      5200,
    );
    return () => window.clearInterval(timer);
  }, []);
  const example = HOME_EXAMPLES[index]!;
  return (
    <>
      <Header onHelp={onHelp} helpText />
      <main className="home-screen">
        <h1 className="sr-only">Double Take</h1>
        <figure
          className="home-hero"
          key={index}
          aria-label={`Example: “${example.text}” is ${RATINGS[example.first]} as ${example.a.name} and ${RATINGS[example.second]} as ${example.b.name}.`}
        >
          <div className="world world-a" style={worldStyle(example.a)}>
            <p className="world-label">{example.a.name}</p>
          </div>
          <figcaption className="band home-band" aria-hidden="true">
            <p className="home-line">{example.text}</p>
            <p className="home-ratings">
              <Rating world={example.a} rating={RATINGS[example.first]} />
              <Rating world={example.b} rating={RATINGS[example.second]} />
              <b>{example.first + example.second} points</b>
            </p>
          </figcaption>
          <div className="world world-b" style={worldStyle(example.b)}>
            <p className="world-label">{example.b.name}</p>
          </div>
        </figure>
        <div className="home-foot">
          <p className="lede">
            Two worlds, one line that fits both. A party game for 2 to 8 phones.
          </p>
          <button className="btn primary" onClick={onStart}>
            Start a game
          </button>
          <button className="btn" onClick={onJoin}>
            Join a game
          </button>
        </div>
      </main>
    </>
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
  const [error, setError] = useState<{
    field: "code" | "name" | null;
    message: string;
  } | null>(null);
  const fail = (field: "code" | "name" | null, message: string) =>
    setError({ field, message });
  const enter = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const displayName = name.trim();
    if (mode === "join" && code.length !== ROOM_CODE_LENGTH) {
      fail("code", "Enter the four character code from the host’s screen.");
      return;
    }
    if (!displayName) {
      fail("name", "Add your name so everyone knows who wrote what.");
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
          fail(
            joined.code === "INVALID_DISPLAY_NAME" ? "name" : "code",
            playerFailureCopy("join", joined.code),
          );
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
      fail(
        null,
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
        <form className="page form" onSubmit={enter} noValidate>
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
                autoFocus={!initialCode}
                spellCheck={false}
                enterKeyHint="next"
                aria-invalid={error?.field === "code" || undefined}
                aria-describedby={
                  error?.field === "code" ? "form-error" : "code-hint"
                }
                onChange={(e) => setCode(normalizeCode(e.target.value))}
              />
              <p className="hint" id="code-hint">
                Four characters, on the host’s screen.
              </p>
            </div>
          )}
          <div className="field">
            <label htmlFor="name">Your name</label>
            <input
              id="name"
              value={name}
              maxLength={16}
              autoComplete="nickname"
              autoFocus={mode === "start" || !!initialCode}
              enterKeyHint="go"
              aria-invalid={error?.field === "name" || undefined}
              aria-describedby={
                error?.field === "name" ? "form-error" : undefined
              }
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          {error && (
            <p className="alert" id="form-error" role="alert">
              {error.message}
            </p>
          )}
          <button className="btn primary" type="submit" disabled={busy}>
            {busy
              ? mode === "start"
                ? "Starting…"
                : "Joining…"
              : mode === "start"
                ? "Start a game"
                : "Join"}
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
        <WorldCard pair={EXAMPLE_PAIR} text={EXAMPLE_LINE} />
        <p className="caption">Same line, two worlds. Tap to flip.</p>
        <ol className="steps">
          <li>Everyone sees the same two worlds.</li>
          <li>Write one line you could say in both, twelve words at most.</li>
          <li>
            Each world rates it: Wrong here, Awkward, Fits, or Perfect.{" "}
            <b>Your points are the two ratings added up</b>, six at best.
          </li>
          <li>
            If one world says no, or it is two lines stitched together, it
            scores nothing.
          </li>
          <li>
            Lines are revealed without names. Most points takes the round; three
            rounds make a game.
          </li>
        </ol>
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
        {gated ? "Doesn’t count" : (RATINGS[rating] ?? RATINGS[0])}
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
      <p className="line">{curly(text)}</p>
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
      aria-label={`${curly(text)}. Read as ${pair[side].name}. Flip to ${pair[side === "a" ? "b" : "a"].name}.`}
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
  const code = state.room.code;
  /** The share sheet on phones; otherwise the same message on the clipboard. */
  const invite = async () => {
    const link = `${location.origin}/?code=${code}`;
    const text = `Play Double Take with me. Game code ${code}.`;
    if (navigator.share) {
      try {
        await navigator.share({ title: "Double Take", text, url: link });
        return;
      } catch (cause) {
        if (cause instanceof DOMException && cause.name === "AbortError")
          return;
      }
    }
    try {
      await navigator.clipboard.writeText(`${text} ${link}`);
      toast("Invite copied. Paste it to your friends.");
    } catch {
      toast(`Couldn’t copy. Tell your friends the code: ${code}.`);
    }
  };
  const startGame = async () => {
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
      <Header onMenu={onMenu} onHelp={onHelp} />
      <main>
        <div className="page center">
          <div className="code-block">
            <h1 className="meta">Game code</h1>
            <p
              className="code"
              aria-label={`Game code ${code.split("").join(" ")}`}
            >
              {code}
            </p>
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
                {members.length === 1
                  ? "Waiting for friends to join"
                  : `Room for ${MAX_PLAYERS - members.length} more`}
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
          <div className="actions">
            {isHost && enough && (
              <button
                className="btn primary"
                disabled={busy}
                onClick={startGame}
              >
                {busy ? "Starting…" : "Start the game"}
              </button>
            )}
            <button
              className={`btn${isHost && !enough ? " primary" : ""}`}
              onClick={invite}
            >
              Invite friends
            </button>
            {isHost && !enough && (
              <p className="wait-note">You can start once someone joins.</p>
            )}
            {!isHost && (
              <p className="wait-note">
                {host} starts the game when everyone is here.
              </p>
            )}
          </div>
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
  const fieldRef = useRef<HTMLTextAreaElement>(null);
  // The field grows with the line (CSS caps it at three lines), so nothing scrolls out of view.
  useLayoutEffect(() => {
    const field = fieldRef.current;
    if (!field) return;
    field.style.height = "auto";
    field.style.height = `${field.scrollHeight}px`;
  }, [text]);
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
    status = "You’re watching this round. You can play in the next game.";
  else if (locked)
    status =
      missing.length === 0
        ? "Everyone’s in. Here come the lines."
        : seconds !== null
          ? `Waiting on ${waiting}. ${seconds} seconds.`
          : `Locked in. Waiting on ${waiting}.`;
  else if (
    seconds !== null &&
    missing.some((p) => p.playerId === game.me.playerId)
  )
    status = `You’re the last one. ${seconds} seconds.`;
  else if (left < 0) status = `${-left} ${-left === 1 ? "word" : "words"} over`;
  else if (left <= 3) status = `${left} ${left === 1 ? "word" : "words"} left`;
  else if (missing.length < game.players.length)
    status = `${game.players.length - missing.length} of ${game.players.length} locked in.`;
  /** The last player's clock, drained as a bar across the band. */
  const clockLeft =
    game.lastDeadline === null
      ? null
      : Math.max(0, Math.min(1, (game.lastDeadline - now) / LAST_PLAYER_MS));
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
        {clockLeft !== null && (
          <div
            className="clock"
            aria-hidden="true"
            style={{ "--left": clockLeft } as CSSProperties}
          />
        )}
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
              ref={fieldRef}
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
        {locked && (
          <p className="locked-line">{curly(game.me.line?.text ?? "")}</p>
        )}
        {(failed || notice) && (
          <p className="alert" role="alert">
            {notice ?? "Your line didn’t go through. Lock it in again."}
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
            {busy ? "Locking in…" : "Lock it in"}
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
      ? `${curly(line.text)}. ${game.pair.a.name}: ${line.zero === "stitched" ? "Doesn’t count" : RATINGS[line.first]}.`
      : step === "verdictB"
        ? `${game.pair.b.name}: ${line.zero === "stitched" ? "Doesn’t count" : RATINGS[line.second]}.`
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
  const winner = winners.length === 1 ? winners[0] : undefined;
  return (
    <main>
      <div className="page">
        <div className="center heading">
          <p className="meta">
            Round {game.round} of {game.rounds}
          </p>
          <h1 className="title">{title}</h1>
        </div>
        {winner && (
          <figure className="winner">
            <WorldCard
              pair={game.pair}
              text={winner.text}
              first={winner.first}
              second={winner.second}
              zero={winner.zero}
            />
            <figcaption className="caption">
              Tap to see the other world.
            </figcaption>
          </figure>
        )}
        <ol className="ranked" aria-label="Every line this round">
          {ranked.map((line) => (
            <li key={line.playerId}>
              <span className="pts">{line.points}</span>
              <div className="row-body">
                <p className="row-line">{curly(line.text)}</p>
                <p className="row-meta">
                  <b>
                    {displayName(line.name, line.playerId, game.me.playerId)}
                  </b>
                  {line.zero !== "stitched" && (
                    <>
                      <Rating
                        world={game.pair.a}
                        rating={RATINGS[line.first]}
                      />
                      <Rating
                        world={game.pair.b}
                        rating={RATINGS[line.second]}
                      />
                    </>
                  )}
                  {line.zero && (
                    <span className="reason">{ZERO_LABEL[line.zero]}</span>
                  )}
                </p>
              </div>
            </li>
          ))}
          {game.players
            .filter((p) => !lines.some((line) => line.playerId === p.playerId))
            .map((p) => (
              <li key={p.playerId}>
                <span className="pts">0</span>
                <div className="row-body">
                  <p className="row-meta">
                    <b>{displayName(p.name, p.playerId, game.me.playerId)}</b>
                    <span className="reason">No line this round</span>
                  </p>
                </div>
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
  hostName,
  onAgain,
  onLobby,
  busy,
  notice,
}: {
  game: GameView;
  hostName: string;
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
    top === 0
      ? "Nobody scored"
      : winners.length > 1
        ? `${namesTogether(winners)} tie`
        : `${winners[0]} ${winners[0] === "You" ? "win" : "wins"}`;
  const best = game.bestLine;
  return (
    <main>
      <div className="page">
        <div className="center heading final-heading">
          <p className="meta">Final scores</p>
          <h1 className="title final-title">{title}</h1>
          {top > 0 && (
            <p className="lede">
              {top} {top === 1 ? "point" : "points"} over {game.rounds} rounds.
            </p>
          )}
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
              {best.name}, {best.points}{" "}
              {best.points === 1 ? "point" : "points"}. Tap to see the other
              world.
            </p>
          </section>
        )}
        <div className="actions">
          {game.isHost ? (
            <button
              className="btn primary wide"
              disabled={busy}
              onClick={onAgain}
            >
              {busy ? "Starting…" : "Play again"}
            </button>
          ) : (
            <p className="wait-note">{hostName} can start another game.</p>
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
  const flooding =
    view.phase === "reveal" &&
    !!view.reveal &&
    now < view.reveal.startedAt + 460;
  const revealSide: "a" | "b" | null =
    position && !position.done
      ? position.step === "line" || position.step === "verdictA"
        ? "a"
        : "b"
      : null;
  // The bar takes the world's colors while the room watches the lines.
  const tone = flooding
    ? { world: view.pair.a, side: "a" as const }
    : revealSide
      ? { world: view.pair[revealSide], side: revealSide }
      : undefined;
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
        tone={tone}
      />
      {view.phase === "writing" ? (
        <Seam
          key={`${gameId}-${view.round}`}
          game={view}
          token={token}
          now={now}
        />
      ) : flooding ? (
        <Flood pair={view.pair} round={view.round} />
      ) : view.phase === "reveal" && position && !position.done ? (
        <Reveal game={view} now={now} />
      ) : view.phase === "reveal" ? (
        <RoundResult game={view} token={token} hostName={hostName} now={now} />
      ) : (
        <Final
          game={view}
          hostName={hostName}
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
          <h1 className="title">We couldn’t restore your seat</h1>
          <p className="meta">
            Check your connection and reload the page. Or start fresh with a new
            seat; your old game and points stay behind.
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
        onError={() => gone("That game isn’t available anymore.")}
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
