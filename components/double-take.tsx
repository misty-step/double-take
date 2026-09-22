"use client";

import { useAction, useMutation, useQuery } from "convex/react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useHeartbeat } from "@parlor/react";
import { api } from "../convex/_generated/api";
import type { Id } from "../convex/_generated/dataModel";
import { PAIRS, pairByKey } from "../convex/content";
import { MAX_SUBMISSIONS_PER_ROUND, MAX_WORDS, wordCount } from "../convex/rules";
import type { PlayerAdjudication } from "../lib/player-adjudication";
import { showsGameTable } from "../lib/room-view";
import { useGuest, resetIssuer } from "../app/providers";

type RoomId = Id<"rooms">;
type GameId = Id<"games">;

const READING_NAMES = ["Doesn’t land", "A stretch", "Reads naturally", "Lands perfectly"] as const;

function formatPoints(points: number): string {
  return `${points} ${points === 1 ? "pt" : "pts"}`;
}

export function ImpressionMark({ size = "small" }: { size?: "small" | "large" }) {
  return (
    <img
      className={`impression-mark impression-mark-${size}`}
      src={size === "small" ? "/brand/double-take-mark-32.svg" : "/brand/double-take-mark.svg"}
      width={size === "small" ? 32 : 128}
      height={size === "small" ? 32 : 128}
      alt=""
    />
  );
}

export function BrandHeader() {
  return (
    <header className="brand-header" aria-label="Double Take">
      <ImpressionMark />
      <span>Double Take</span>
      <span className="brand-header-rule" aria-hidden="true" />
      <span className="brand-header-note">Two impressions</span>
    </header>
  );
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
export function RevealStage({
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
    <div className={stage === "a" ? "impression first fade-in" : "impression second fade-in"}>
      <div className="reading-context">
        <span>{stage === "a" ? "First impression" : "Second impression"}</span>
        <strong>{label}</strong>
      </div>
      <blockquote className="reading">“{text}”</blockquote>
      {setting && <p className="reading-setting">{setting}</p>}
    </div>
  );
}

export function ScoreSummary({ adjudication }: { adjudication: PlayerAdjudication }) {
  return (
    <div className="score-summary">
      <div className="reading-scores">
        <span>
          <i className="ink-dot red" />First <strong>{READING_NAMES[adjudication.readings.first]}</strong>
        </span>
        <span>
          <i className="ink-dot blue" />Second <strong>{READING_NAMES[adjudication.readings.second]}</strong>
        </span>
      </div>
      <div className="score-verdict">
        <span className="points">{formatPoints(adjudication.points)}</span>
        <span>{adjudication.note}</span>
      </div>
    </div>
  );
}

export function PairCards({
  pair,
}: {
  pair: { title: string; contextA: { label: string; setting: string }; contextB: { label: string; setting: string } };
}) {
  return (
    <section className="card pair-card">
      <div className="row">
        <h2>{pair.title}</h2>
        <span className="pill">one line · two scenes</span>
      </div>
      <div className="context-grid">
        <div className="context first-context">
          <span className="impression-number">01</span>
          <strong>{pair.contextA.label}</strong>
          <p>{pair.contextA.setting}</p>
        </div>
        <div className="context second-context">
          <span className="impression-number">02</span>
          <strong>{pair.contextB.label}</strong>
          <p>{pair.contextB.setting}</p>
        </div>
      </div>
    </section>
  );
}

function Writer({
  pairKey,
  onSubmit,
  disabled,
  busy,
  hint,
  initialText = "",
  submitLabel = "Print my line",
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
        One line for both scenes. {hint ?? ""}
      </label>
      <textarea
        id="line"
        value={text}
        maxLength={160}
        disabled={disabled || busy}
        placeholder="Write the line that lands twice…"
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
          {busy ? "Printing…" : submitLabel}
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
  const [result, setResult] = useState<null | (PlayerAdjudication & { text: string })>(null);
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
        <div className="error">{failure.message} Nothing was scored. Try again when the press is ready.</div>
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
                Second impression
              </button>
            ) : (
              <button
                className="button"
                onClick={() => {
                  setStage("a");
                }}
              >
                First impression
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
              {sound.enabled ? "Sound: on" : "Sound: off"}
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
        <div className="error">{notice.message} Nothing was scored. Try again when the press is ready.</div>
      )}
      {game.phase === "writing" && (
        <>
          <PairCards pair={pair} />
          {game.me.seated ? (
            <Writer
              key={mine?.revision ?? 0}
              pairKey={pair.key}
              busy={busy}
              disabled={timeUp || revisionsLeft === 0}
              initialText={mine?.text ?? ""}
              submitLabel={mine ? "Reprint my line" : "Print my line"}
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
          ) : (
            <div className="card">
              <p className="small muted">
                You joined while this match was running. Watch the round — you are dealt in
                when the next match starts.
              </p>
            </div>
          )}
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
                  // Ending the round early must still score what was submitted:
                  // one judge pass for pending lines, then the forced reveal.
                  if (game.players.some((player) => player.submitted && !player.judged)) {
                    await judge({ gameId, guestToken: token });
                  }
                  const response = await beginReveal({ gameId, guestToken: token, force: true });
                  if (!response.ok && response.code !== "WRONG_PHASE")
                    setNotice({ code: response.code ?? "REVEAL_FAILED", message: response.message ?? "" });
                }}
              >
                Reveal now (host)
              </button>
              <button className="button ghost" onClick={sound.toggle}>
                {sound.enabled ? "Sound: on" : "Sound: off"}
              </button>
            </div>
          </div>
        </>
      )}
      {game.phase === "finished" && (
        <div className="card card-soft">
          <h2>Final scores</h2>
          <div className="players">
            {[...game.players]
              .sort((a, b) => b.score - a.score || a.seatIndex - b.seatIndex)
              .map((player) => (
                <div key={player.playerId} className="row">
                  <span>
                    {player.name}
                    {player.seatIndex === 0 ? " · host" : ""}
                  </span>
                  <span className="points">{formatPoints(player.score)}</span>
                </div>
              ))}
          </div>
        </div>
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
                    Second impression
                  </button>
                ) : (
                  <button className="button" onClick={() => setStage("a")}>
                    First impression
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
                <p className="submission-line">
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
                disabled={(!game.host && !allJudged) || !game.me.seated}
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
                disabled={!game.host || busy}
                onClick={async () => {
                  setBusy(true);
                  try {
                    requestRef.current = crypto.randomUUID();
                    await start({ roomId, requestId: requestRef.current, guestToken: token });
                  } catch (error) {
                    setNotice({
                      code: "START_FAILED",
                      message:
                        error instanceof Error ? error.message : "The table did not start.",
                    });
                  } finally {
                    setBusy(false);
                  }
                }}
              >
                {busy ? "Setting the press…" : "Play again"}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function Room({ roomId, token, onExit }: { roomId: RoomId; token: string; onExit: () => void }) {
  const state = useQuery(api.rooms.getRoomState, { roomId, guestToken: token });
  const brief = useQuery(api.game.forRoom, { roomId, guestToken: token });
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
  const gameId = brief?.gameId ?? null;

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
      {gameId !== null && showsGameTable(active !== null, brief?.phase ?? null) ? (
        <RoomGame key={gameId} roomId={roomId} gameId={gameId} token={token} onExit={onExit} />
      ) : (
        <div className="card">
          <h2>Ready when you are</h2>
          <p className="small muted">
            Two to twelve players · three rounds · the weaker impression sets the score.
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
                : "Start printing"
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
    <div className="entrance">
      <section className="entrance-sheet">
        <div className="hero-copy">
          <div className="section-kicker">A two-reading party game</div>
          <h1>
            One line.<br />
            <span>Two impressions.</span>
          </h1>
          <p className="hero-lede">
            Make the same words read true in two completely different scenes.
          </p>
          <div className="button-row entrance-actions">
            <button className="button primary" onClick={() => setMode("solo")}>
              Practice
            </button>
            <button className="button" onClick={() => setMode("create")}>
              Open a table
            </button>
            <button className="button ghost" onClick={() => setMode("join")}>
              Join a table
            </button>
          </div>
        </div>
        <div className="hero-mark" aria-hidden="true">
          <ImpressionMark size="large" />
          <span className="registration-note">MISREGISTERED ON PURPOSE</span>
        </div>
      </section>
      <details className="rule-card" open={mode === "none"}>
        <summary>
          Say it twice <span>How to play</span>
        </summary>
        <div className="rule-steps">
          <p><b>01</b><span>Read the two scenes.</span></p>
          <p><b>02</b><span>Write one sentence that belongs in both.</span></p>
          <p><b>03</b><span>Reveal both impressions. The weaker one sets the score.</span></p>
        </div>
      </details>
      {mode !== "none" && (
        <section className="card press-form fade-in">
          <div className="section-kicker">
            {mode === "create" ? "Open a table" : "Join the press run"}
          </div>
          <h2>{mode === "create" ? "Name your seat" : "Bring your table code"}</h2>
          <label htmlFor="name">Your name</label>
          <input
            id="name"
            value={name}
            maxLength={24}
            onChange={(event) => setName(event.target.value)}
            placeholder="Ada"
          />
          {mode === "join" && (
            <>
              <label htmlFor="code">Table code</label>
              <input
                id="code"
                value={code}
                maxLength={8}
                onChange={(event) => setCode(event.target.value.toUpperCase())}
                placeholder="ABC123"
              />
            </>
          )}
          <div className="button-row form-actions">
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
                      setError("That table wasn’t found. Check the code and try again.");
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
              {busy ? "Setting the press…" : mode === "create" ? "Open the table" : "Take my seat"}
            </button>
            <button className="button ghost" onClick={() => setMode("none")}>
              Cancel
            </button>
          </div>
          {error && <div className="error">{error}</div>}
        </section>
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
        <BrandHeader />
        <div className="card loading-card">
          <span className="loading-impressions" aria-hidden="true" />
          Setting the press…
        </div>
      </main>
    );

  if (!guest.credential) {
    const message =
      guest.error instanceof Error
        ? guest.error.message
        : "Your seat could not be restored. Start as a new guest below.";
    return (
      <main className="stage">
        <BrandHeader />
        <div className="card">
          <div className="section-kicker">Fresh sheet needed</div>
          <h2>We couldn’t restore your previous seat.</h2>
          <p className="small muted">{message}</p>
          <p className="small muted">
            Starting fresh makes a new seat. It won’t restore the old table or its scores.
          </p>
          <button className="button primary" onClick={startFresh} disabled={resetting}>
            {resetting ? "Preparing a fresh sheet…" : "Start fresh"}
          </button>
          {resetError && <div className="error">{resetError}</div>}
        </div>
      </main>
    );
  }

  return (
    <main className="stage">
      <BrandHeader />
      {roomId ? (
        <Room roomId={roomId} token={guest.credential} onExit={() => setRoomId(null)} />
      ) : (
        <Entrance token={guest.credential} onRoom={setRoomId} />
      )}
    </main>
  );
}
