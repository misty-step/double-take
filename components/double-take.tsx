"use client";

import { useAction, useMutation, useQuery } from "convex/react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useHeartbeat } from "@parlor/react";
import { api } from "../convex/_generated/api";
import type { Id } from "../convex/_generated/dataModel";
import { INSTRUCTIONS, PAIRS, pairByKey } from "../convex/content";
import { MAX_SUBMISSIONS_PER_ROUND, MAX_WORDS, wordCount } from "../convex/rules";
import { useGuest, resetIssuer } from "../app/providers";

type RoomId = Id<"rooms">;
type GameId = Id<"games">;

const LEVEL_NAMES = {
  plausibility: [
    "Impossible here",
    "Strained here",
    "Natural here",
    "Unmistakable here",
  ],
  coherence: [
    "Two stitched halves",
    "Fragmentary",
    "One coherent sentence",
    "A voice, not a puzzle",
  ],
  specificity: ["Empty", "Vague", "Concrete", "Vivid"],
} as const;

function formatPoints(points: number): string {
  return `${points} ${points === 1 ? "pt" : "pts"}`;
}

function useSound() {
  const [enabled, setEnabled] = useState(false);
  useEffect(() => {
    setEnabled(window.localStorage.getItem("double-take:sound") === "on");
  }, []);
  const toggle = useCallback(() => {
    setEnabled((current) => {
      const next = !current;
      window.localStorage.setItem("double-take:sound", next ? "on" : "off");
      return next;
    });
  }, []);
  const chime = useCallback(
    (high: boolean) => {
      if (!enabled) return;
      try {
        const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
        if (!Ctor) return;
        const ctx = new Ctor();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.frequency.value = high ? 523 : 262;
        gain.gain.value = 0.04;
        osc.connect(gain).connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.18);
        osc.onended = () => void ctx.close();
      } catch {
        /* Sound is optional; failure is fine. */
      }
    },
    [enabled],
  );
  return { enabled, toggle, chime };
}

/** One sentence, shown under one named framing, then the other. */
function RevealStage({
  text,
  label,
  setting,
  stage,
}: {
  text: string;
  label: string;
  setting?: string;
  stage: "a" | "b";
}) {
  return (
    <div className={stage === "a" ? "atmosphere-a fade-in" : "atmosphere-b fade-in"}>
      <div className="reading-context">
        {stage === "a" ? "First reading" : "Second reading"} — <strong>{label}</strong>
      </div>
      <div className="reading">{text}</div>
      {setting && <div className="small muted">{setting}</div>}
    </div>
  );
}

function ScoreSummary({
  adjudication,
}: {
  adjudication: {
    levels: { plausibilityA: number; plausibilityB: number; coherence: number; specificity: number };
    weaker: number;
    points: number;
    gate: string;
    gateMessage: string;
    confidenceMin: number;
    rubricVersion: string;
  };
}) {
  const { levels } = adjudication;
  return (
    <div className="small">
      <div className="score-line">
        <span>
          reading A: <strong>{LEVEL_NAMES.plausibility[levels.plausibilityA]}</strong>
        </span>
        <span>
          reading B: <strong>{LEVEL_NAMES.plausibility[levels.plausibilityB]}</strong>
        </span>
      </div>
      <div className="score-line">
        <span>
          coherence: <strong>{LEVEL_NAMES.coherence[levels.coherence]}</strong>
        </span>
        <span>
          specificity: <strong>{LEVEL_NAMES.specificity[levels.specificity]}</strong>
        </span>
      </div>
      <div className="score-line">
        <span className="points">{formatPoints(adjudication.points)}</span>
        <span>{adjudication.gateMessage}</span>
      </div>
      <details className="score-details">
        <summary className="small muted">Scoring details</summary>
        <div className="score-line muted small">
          <span>weaker reading sets the points</span>
          <span>
            judge confidence {Math.round(adjudication.confidenceMin * 100)}% · {adjudication.rubricVersion}
          </span>
        </div>
      </details>
    </div>
  );
}

function PairCards({
  pair,
}: {
  pair: { title: string; contextA: { label: string; setting: string }; contextB: { label: string; setting: string } };
}) {
  return (
    <div className="card card-soft">
      <div className="row">
        <h2>{pair.title}</h2>
        <span className="pill">one line, two readings</span>
      </div>
      <div className="context">
        <strong>{pair.contextA.label}</strong>
        <p className="small muted">{pair.contextA.setting}</p>
      </div>
      <div className="context b">
        <strong>{pair.contextB.label}</strong>
        <p className="small muted">{pair.contextB.setting}</p>
      </div>
    </div>
  );
}

function Writer({
  pairKey,
  onSubmit,
  disabled,
  busy,
  hint,
  initialText = "",
  submitLabel = "Submit the line",
}: {
  pairKey: string;
  onSubmit: (text: string) => Promise<{ ok: boolean; code?: string; message?: string }>;
  disabled: boolean;
  busy: boolean;
  hint?: string;
  initialText?: string;
  submitLabel?: string;
}) {
  const [text, setText] = useState(initialText);
  const [error, setError] = useState<string | null>(null);
  const words = wordCount(text);
  const tooLong = words > MAX_WORDS;
  return (
    <form
      className="card"
      onSubmit={async (event) => {
        event.preventDefault();
        setError(null);
        const result = await onSubmit(text);
        if (!result.ok) setError(result.message ?? result.code ?? "That did not land.");
      }}
    >
      <label htmlFor="line" className="small muted">
        Your line for both contexts. {hint ?? ""}
      </label>
      <textarea
        id="line"
        value={text}
        maxLength={160}
        disabled={disabled || busy}
        placeholder="Write one sentence that means something in both."
        onChange={(event) => setText(event.target.value)}
      />
      <div className="row" style={{ marginTop: "0.5rem" }}>
        <span className={tooLong ? "small points" : "small muted"}>
          {words}/{MAX_WORDS} words
        </span>
        <button
          className="button primary"
          type="submit"
          disabled={disabled || busy || tooLong || words === 0}
        >
          {busy ? "Sending…" : submitLabel}
        </button>
      </div>
      {error && <div className="error">{error}</div>}
    </form>
  );
}

function SoloPractice({ onExit }: { onExit: () => void }) {
  const guest = useGuest();
  const judge = useAction(api.solo.judge);
  const sound = useSound();
  const [pairIndex, setPairIndex] = useState(() => Math.floor(Math.random() * PAIRS.length));
  const pair = PAIRS[pairIndex]!;
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<null | {
    text: string;
    levels: { plausibilityA: number; plausibilityB: number; coherence: number; specificity: number };
    weaker: number;
    points: number;
    gate: string;
    gateMessage: string;
    confidenceMin: number;
    rubricVersion: string;
  }>(null);
  const [failure, setFailure] = useState<null | { code: string; message: string }>(null);
  const [stage, setStage] = useState<"a" | "b">("a");

  if (!guest.credential) return <div className="card">Setting up your seat…</div>;
  const token = guest.credential;

  return (
    <div>
      <div className="row">
        <h2>Practice alone</h2>
        <button className="button ghost small" onClick={onExit}>
          Back
        </button>
      </div>
      <PairCards pair={pair} />
      {!result && (
        <Writer
          pairKey={pair.key}
          busy={busy}
          disabled={false}
          onSubmit={async (text) => {
            setBusy(true);
            setFailure(null);
            try {
              const response = await judge({
                sentence: text,
                pairKey: pair.key,
                guestToken: token,
              });
              if (response.ok && response.result) {
                setResult(response.result);
                setStage("a");
                sound.chime(true);
                return { ok: true };
              }
              setFailure({ code: response.code ?? "JUDGE_UNAVAILABLE", message: response.message ?? "Nothing was scored." });
              return { ok: false, code: response.code, message: response.message };
            } finally {
              setBusy(false);
            }
          }}
        />
      )}
      {failure && (
        <div className="error">
          {failure.message} Nothing was scored, and the retry is free. ({failure.code})
        </div>
      )}
      {result && (
        <div className="card">
          <h2>Reveal</h2>
          <RevealStage
            text={result.text}
            stage={stage}
            label={stage === "a" ? pair.contextA.label : pair.contextB.label}
            setting={stage === "a" ? pair.contextA.setting : pair.contextB.setting}
          />
          <div className="button-row" style={{ marginTop: "0.75rem" }}>
            {stage === "a" ? (
              <button
                className="button primary"
                onClick={() => {
                  setStage("b");
                  sound.chime(false);
                }}
              >
                Read it the other way
              </button>
            ) : (
              <button
                className="button"
                onClick={() => {
                  setStage("a");
                }}
              >
                Back to the first reading
              </button>
            )}
            <button
              className="button ghost"
              onClick={() => {
                setResult(null);
                setStage("a");
              }}
            >
              Another line, same pair
            </button>
            <button
              className="button ghost"
              onClick={() => {
                setPairIndex((index) => (index + 1) % PAIRS.length);
                setResult(null);
                setStage("a");
              }}
            >
              New pair
            </button>
            <button className="button ghost" onClick={sound.toggle}>
              {sound.enabled ? "Sound on" : "Sound off"}
            </button>
          </div>
          <div style={{ marginTop: "1rem" }}>
            <ScoreSummary adjudication={result} />
          </div>
        </div>
      )}
    </div>
  );
}

function RoomGame({
  roomId,
  gameId,
  token,
  onExit,
}: {
  roomId: RoomId;
  gameId: GameId;
  token: string;
  onExit: () => void;
}) {
  const view = useQuery(api.game.view, { gameId, guestToken: token });
  const submit = useMutation(api.game.submit);
  const judge = useAction(api.game.judge);
  const beginReveal = useMutation(api.game.beginReveal);
  const advance = useMutation(api.game.advance);
  const start = useMutation(api.game.start);
  const sound = useSound();
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<null | { code: string; message: string }>(null);
  const [stage, setStage] = useState<"a" | "b">("a");
  const requestRef = useRef(crypto.randomUUID());
  const judgeRef = useRef(false);
  const [, setClock] = useState(0);

  // Keep the countdown and the deadline flow honest while the round runs.
  useEffect(() => {
    const timer = window.setInterval(() => setClock((tick) => tick + 1), 1000);
    return () => window.clearInterval(timer);
  }, []);

  const game = view;
  const pair = useMemo(() => (game ? pairByKey(game.pair.key) : undefined), [game]);

  const runJudgeFlow = useCallback(async () => {
    if (!game || game.phase !== "writing" || judgeRef.current) return;
    const deadlinePassed = Date.now() > game.deadline;
    const allSubmitted = game.players.every((player) => player.submitted);
    const allJudged = game.players.every((player) => player.judged);
    const pendingJudgable = game.players.some((player) => player.submitted && !player.judged);
    if (pendingJudgable && (allSubmitted || deadlinePassed)) {
      judgeRef.current = true;
      try {
        const response = await judge({ gameId, guestToken: token });
        if (!response.ok && response.code !== "JUDGE_UNCONFIGURED")
          setNotice({ code: response.code ?? "JUDGE_UNAVAILABLE", message: response.message ?? "Nothing was scored." });
        else if (response.ok) setNotice(null);
      } finally {
        judgeRef.current = false;
      }
    } else if ((allSubmitted && allJudged) || (deadlinePassed && !pendingJudgable)) {
      // The round closes on its own clock: no-shows cannot hold the table.
      judgeRef.current = true;
      try {
        const response = await beginReveal({ gameId, guestToken: token });
        if (!response.ok && response.code !== "WRONG_PHASE" && response.code !== "NOT_READY")
          setNotice({ code: response.code ?? "REVEAL_FAILED", message: response.message ?? "" });
      } finally {
        judgeRef.current = false;
      }
    }
  }, [game, judge, beginReveal, gameId, token]);

  useEffect(() => {
    void runJudgeFlow();
  }, [runJudgeFlow]);

  useEffect(() => {
    if (!game) return;
    const timer = window.setInterval(() => void runJudgeFlow(), 4000);
    return () => window.clearInterval(timer);
  }, [game, runJudgeFlow]);

  useEffect(() => {
    setStage("a");
  }, [game?.round, game?.phase]);

  if (!game || !pair) return <div className="card">Dealing you in…</div>;

  const mine = game.me.submission;
  const secondsLeft = Math.max(0, Math.ceil((game.deadline - Date.now()) / 1000));
  const timeUp = secondsLeft === 0;
  const revisionsLeft = MAX_SUBMISSIONS_PER_ROUND - (mine?.revision ?? 0);
  const allJudged = game.players.every((player) => player.judged);

  return (
    <div>
      <div className="row">
        <h2>
          Round {game.round} of {game.rounds}
        </h2>
        <button className="button ghost small" onClick={onExit}>
          Leave table
        </button>
      </div>
      {notice && (
        <div className="error">
          {notice.message} Nothing was scored, and the retry is free. ({notice.code})
        </div>
      )}
      {game.phase === "writing" && (
        <>
          <PairCards pair={pair} />
          <Writer
            key={mine?.revision ?? 0}
            pairKey={pair.key}
            busy={busy}
            disabled={timeUp || revisionsLeft === 0}
            initialText={mine?.text ?? ""}
            submitLabel={mine ? "Revise the line" : "Submit the line"}
            hint={
              timeUp
                ? "The writing window closed. The reveal comes next."
                : mine
                  ? revisionsLeft > 0
                    ? `Submitted: “${mine.text}”. You can revise below while the round is open — ${revisionsLeft} ${revisionsLeft === 1 ? "change" : "changes"} left.`
                    : `Submitted: “${mine.text}”. That was the last change for this round.`
                  : `About ${secondsLeft}s left in this round.`
            }
            onSubmit={async (text) => {
              setBusy(true);
              try {
                const response = await submit({ gameId, text, guestToken: token });
                return response;
              } finally {
                setBusy(false);
              }
            }}
          />
          <div className="card card-soft">
            <div className="players">
              {game.players.map((player) => (
                <div key={player.playerId} className="row">
                  <span>
                    {player.name}
                    {player.seatIndex === 0 ? " · host" : ""}
                  </span>
                  <span className="pill">
                    {player.judged
                      ? "judged"
                      : player.submitted
                        ? timeUp
                          ? "judging…"
                          : "in"
                        : timeUp
                          ? "no line"
                          : "writing…"}
                  </span>
                </div>
              ))}
            </div>
            <p className="small muted">
              Other lines stay hidden until the reveal. {timeUp ? "Time is up — the round is closing." : ""}
            </p>
            <div className="button-row">
              <button
                className="button"
                disabled={!game.host}
                onClick={async () => {
                  await runJudgeFlow();
                  const response = await beginReveal({ gameId, guestToken: token, force: true });
                  if (!response.ok && response.code !== "WRONG_PHASE")
                    setNotice({ code: response.code ?? "REVEAL_FAILED", message: response.message ?? "" });
                }}
              >
                Reveal now (host)
              </button>
              <button className="button ghost" onClick={sound.toggle}>
                {sound.enabled ? "Sound on" : "Sound off"}
              </button>
            </div>
          </div>
        </>
      )}
      {game.phase !== "writing" && game.reveal && (
        <div className="card">
          <h2>The reveal</h2>
          {mine && (
            <>
              <RevealStage
                text={mine.text}
                stage={stage}
                label={stage === "a" ? pair.contextA.label : pair.contextB.label}
                setting={stage === "a" ? pair.contextA.setting : pair.contextB.setting}
              />
              <div className="button-row" style={{ marginTop: "0.5rem" }}>
                {stage === "a" ? (
                  <button
                    className="button primary"
                    onClick={() => {
                      setStage("b");
                      sound.chime(false);
                    }}
                  >
                    Same words, the other reading
                  </button>
                ) : (
                  <button className="button" onClick={() => setStage("a")}>
                    Back to the first reading
                  </button>
                )}
              </div>
            </>
          )}
          <div className="players" style={{ marginTop: "1rem" }}>
            {game.reveal.submissions.map((item) => (
              <div key={item.playerId} className="card card-soft">
                <div className="row">
                  <strong>{item.name}</strong>
                  {item.adjudication && (
                    <span className="points">{formatPoints(item.adjudication.points)}</span>
                  )}
                </div>
                <p className="reading" style={{ fontSize: "1.2rem" }}>
                  “{item.text}”
                </p>
                {item.adjudication ? (
                  <ScoreSummary adjudication={item.adjudication} />
                ) : (
                  <p className="small muted">Not judged — no score is shown for a missing judgment.</p>
                )}
              </div>
            ))}
          </div>
          <div className="button-row" style={{ marginTop: "1rem" }}>
            {game.phase === "reveal" && (
              <button
                className="button primary"
                disabled={!game.host && !allJudged}
                onClick={async () => {
                  const response = await advance({ gameId, guestToken: token });
                  if (!response.ok)
                    setNotice({ code: response.code ?? "ADVANCE_FAILED", message: response.message ?? "" });
                }}
              >
                {game.round >= game.rounds ? "Finish the table" : "Next round"}
              </button>
            )}
            {game.phase === "finished" && (
              <button
                className="button primary"
                disabled={!game.host}
                onClick={async () => {
                  requestRef.current = crypto.randomUUID();
                  await start({ roomId, requestId: requestRef.current, guestToken: token });
                }}
              >
                Play again (host)
              </button>
            )}
          </div>
        </div>
      )}
      {game.phase === "finished" && (
        <div className="card card-soft">
          <h2>Final scores</h2>
          <div className="players">
            {[...game.players]
              .sort((a, b) => b.score - a.score)
              .map((player) => (
                <div key={player.playerId} className="row">
                  <span>{player.name}</span>
                  <span className="points">{player.score}</span>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}

function Room({ roomId, token, onExit }: { roomId: RoomId; token: string; onExit: () => void }) {
  const state = useQuery(api.rooms.getRoomState, { roomId, guestToken: token });
  const gameId = useQuery(api.game.forRoom, { roomId, guestToken: token });
  const start = useMutation(api.game.start);
  const heartbeatMutation = useMutation(api.rooms.heartbeat);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const requestRef = useRef(crypto.randomUUID());

  useHeartbeat({
    enabled: true,
    send: async () => {
      await heartbeatMutation({ roomId, guestToken: token });
    },
  });

  if (!state) return <div className="card">Finding your table…</div>;

  const isHost = state.room.hostPlayerId === state.viewerPlayerId;
  const active = state.activeMatch;

  return (
    <div>
      <div className="row">
        <h2>Table {state.room.code}</h2>
        <button className="button ghost small" onClick={onExit}>
          Back
        </button>
      </div>
      <div className="card card-soft">
        <div className="players">
          {state.members.map((member) => (
            <div key={member.playerId} className="row">
              <span>
                {member.displayName}
                {member.playerId === state.room.hostPlayerId ? " · host" : ""}
              </span>
              {member.playerId === state.viewerPlayerId && <span className="pill">you</span>}
            </div>
          ))}
        </div>
        <p className="small muted">
          Share the code <strong>{state.room.code}</strong>. Everyone plays on their own phone.
        </p>
      </div>
      {notice && <div className="error">{notice}</div>}
      {active && gameId ? (
        <RoomGame roomId={roomId} gameId={gameId} token={token} onExit={onExit} />
      ) : (
        <div className="card">
          <h2>Ready when you are</h2>
          <p className="small muted">
            Two to twelve players. Three rounds. The weaker reading of each line wins the round.
          </p>
          <button
            className="button primary"
            disabled={!isHost || busy || state.members.length < 2}
            onClick={async () => {
              setBusy(true);
              setNotice(null);
              try {
                await start({ roomId, requestId: requestRef.current, guestToken: token });
              } catch (error) {
                setNotice(error instanceof Error ? error.message : "The table did not start.");
              } finally {
                setBusy(false);
              }
            }}
          >
            {isHost
              ? state.members.length < 2
                ? "Waiting for one more player"
                : "Start the table"
              : "Waiting for the host"}
          </button>
        </div>
      )}
    </div>
  );
}

function Entrance({
  token,
  onRoom,
}: {
  token: string;
  onRoom: (roomId: RoomId) => void;
}) {
  const create = useMutation(api.rooms.createRoom);
  const join = useMutation(api.rooms.joinRoom);
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [mode, setMode] = useState<"none" | "create" | "join" | "solo">("none");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (mode === "solo") return <SoloPractice onExit={() => setMode("none")} />;

  return (
    <div>
      <div className="card">
        <h1>Double Take</h1>
        <p>{INSTRUCTIONS.premise}</p>
        <ul className="small muted">
          {INSTRUCTIONS.steps.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ul>
        <div className="button-row">
          <button className="button primary" onClick={() => setMode("solo")}>
            Practice alone
          </button>
          <button className="button" onClick={() => setMode("create")}>
            Create a table
          </button>
          <button className="button" onClick={() => setMode("join")}>
            Join a table
          </button>
        </div>
      </div>
      {mode !== "none" && (
        <div className="card">
          <label className="small muted" htmlFor="name">
            Your name at the table
          </label>
          <input
            id="name"
            value={name}
            maxLength={24}
            onChange={(event) => setName(event.target.value)}
            placeholder="Ada"
          />
          {mode === "join" && (
            <>
              <label className="small muted" htmlFor="code" style={{ display: "block", marginTop: "0.75rem" }}>
                Table code
              </label>
              <input
                id="code"
                value={code}
                maxLength={8}
                onChange={(event) => setCode(event.target.value.toUpperCase())}
                placeholder="ABC123"
              />
            </>
          )}
          <div className="button-row" style={{ marginTop: "0.75rem" }}>
            <button
              className="button primary"
              disabled={busy || name.trim().length === 0}
              onClick={async () => {
                setBusy(true);
                setError(null);
                try {
                  if (mode === "create") {
                    const result = await create({ displayName: name.trim(), guestToken: token });
                    onRoom(result.roomId);
                  } else {
                    const result = await join({ displayName: name.trim(), code, guestToken: token });
                    if (!result.ok) {
                      setError(`Could not join: ${result.code}.`);
                    } else {
                      onRoom(result.roomId);
                    }
                  }
                } catch (joinError) {
                  setError(joinError instanceof Error ? joinError.message : "That did not work.");
                } finally {
                  setBusy(false);
                }
              }}
            >
              {busy ? "Working…" : mode === "create" ? "Open the table" : "Join"}
            </button>
            <button className="button ghost" onClick={() => setMode("none")}>
              Cancel
            </button>
          </div>
          {error && <div className="error">{error}</div>}
        </div>
      )}
    </div>
  );
}

export function DoubleTake() {
  const guest = useGuest();
  const [roomId, setRoomId] = useState<RoomId | null>(null);
  const [mounted, setMounted] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [resetError, setResetError] = useState<string | null>(null);
  useEffect(() => setMounted(true), []);

  const startFresh = useCallback(async () => {
    if (resetting) return;
    setResetting(true);
    setResetError(null);
    try {
      // Drop the stranded local proof, then deliberately reset the server-side
      // continuity: this starts a NEW guest identity, it does not recover the old one.
      guest.clear();
      await guest.acquire(resetIssuer);
    } catch (error) {
      setResetError(error instanceof Error ? error.message : "Guest access failed. Try again.");
    } finally {
      setResetting(false);
    }
  }, [guest, resetting]);

  if (!mounted || (!guest.credential && (guest.loading || !guest.error)))
    return (
      <main className="stage">
        <div className="card">Setting the table…</div>
      </main>
    );

  if (!guest.credential) {
    const message =
      guest.error instanceof Error
        ? guest.error.message
        : "Your seat could not be restored. Start as a new guest below.";
    return (
      <main className="stage">
        <div className="card">
          <h2>Your previous seat could not be restored.</h2>
          <p className="small muted">{message}</p>
          <p className="small muted">
            Starting fresh creates a new guest identity. Your previous seat, room seats, and
            scores cannot be recovered.
          </p>
          <button className="button primary" onClick={startFresh} disabled={resetting}>
            {resetting ? "Setting a fresh table…" : "Start as a new guest"}
          </button>
          {resetError && <div className="error">{resetError}</div>}
        </div>
      </main>
    );
  }

  return (
    <main className="stage">
      {roomId ? (
        <Room roomId={roomId} token={guest.credential} onExit={() => setRoomId(null)} />
      ) : (
        <Entrance token={guest.credential} onRoom={setRoomId} />
      )}
    </main>
  );
}
