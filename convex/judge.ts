/**
 * Server-side Jev adjudication client.
 *
 * Speaks the documented TypeSafe HTTP contract
 * (https://docs.typesafe.ai/api): POST {state, model, questions} ->
 * {model, answers}. Production route is the OpenRouter decisions endpoint
 * (per the platform receipt): JEV_DECISIONS_URL, JEV_MODEL, OPENROUTER_API_KEY
 * live only in Convex's server environment, never in client bundles.
 *
 * Fail closed: any unreadable answer, HTTP error, timeout, or network failure
 * raises JudgeUnavailableError. No caller may fabricate a score on failure.
 */

import {
  composeResult,
  JUDGE_TIMEOUT_MS,
  levelIndexFromProbabilities,
  levelIndexFromScore,
  MAX_JUDGE_ATTEMPTS,
  type ComposedResult,
  type JudgedLevels,
} from "./rules";
import {
  buildJudgeRequest,
  COHERENCE_LEVELS,
  APPROPRIATE_LEVELS,
  RUBRIC_VERSION,
  type Pair,
} from "./rubrics";

export type JudgeConfig = {
  readonly url: string;
  readonly apiKey: string;
  readonly model: string;
};

export class JudgeUnavailableError extends Error {
  readonly code: string;
  constructor(code: string, message: string) {
    super(message);
    this.code = code;
    this.name = "JudgeUnavailableError";
  }
}

export function readJudgeConfig(
  env: Record<string, string | undefined>,
): JudgeConfig | null {
  const url = env.JEV_DECISIONS_URL;
  const apiKey = env.OPENROUTER_API_KEY;
  const model = env.JEV_MODEL;
  if (!url || !apiKey || !model) return null;
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return null;
  }
  if (parsed.protocol !== "https:" && parsed.protocol !== "http:") return null;
  if (apiKey.length < 8 || model.trim().length === 0) return null;
  return { url: parsed.toString(), apiKey, model: model.trim() };
}

type FetchLike = typeof fetch;

const MAX_RESPONSE_CHARS = 64 * 1024;

export type ScoreAnswer = { level: number; score: number; confidence: number };

export function parseScoreAnswer(
  value: unknown,
  levels: readonly string[],
  question: string,
): ScoreAnswer {
  if (typeof value !== "object" || value === null || Array.isArray(value))
    throw new JudgeUnavailableError(
      "JUDGE_BAD_RESPONSE",
      `The judge did not answer "${question}". Nothing was scored.`,
    );
  const answer = value as Record<string, unknown>;
  if (answer.type !== "score")
    throw new JudgeUnavailableError(
      "JUDGE_BAD_RESPONSE",
      `The judge answered "${question}" with an unexpected type. Nothing was scored.`,
    );
  const score = answer.score;
  if (typeof score !== "number" || !Number.isFinite(score))
    throw new JudgeUnavailableError(
      "JUDGE_BAD_RESPONSE",
      `The judge returned no usable score for "${question}". Nothing was scored.`,
    );
  const confidenceRaw = answer.confidence;
  const confidence =
    typeof confidenceRaw === "number" && Number.isFinite(confidenceRaw)
      ? Math.min(1, Math.max(0, confidenceRaw))
      : 0;
  let level: number | null = null;
  const probabilities = answer.probabilities;
  if (
    typeof probabilities === "object" &&
    probabilities !== null &&
    !Array.isArray(probabilities)
  ) {
    level = levelIndexFromProbabilities(
      probabilities as Record<string, number>,
      levels.length,
    );
  }
  if (level === null) level = levelIndexFromScore(score, levels.length);
  return {
    level,
    score: Math.min(levels.length - 1, Math.max(0, score)),
    confidence,
  };
}

const sleep = (ms: number) =>
  new Promise<void>((resolve) => setTimeout(resolve, ms));

export type AdjudicationDraft = {
  rubricVersion: string;
  model: string;
  levels: JudgedLevels;
  composed: ComposedResult;
  confidenceMin: number;
  rawJson: string;
};

/** One decision answered by Jev: the parsed answer bag, the served model, and the raw text. */
export type Decision = {
  answers: Record<string, unknown>;
  model: string;
  rawJson: string;
};

/**
 * POST one TypeSafe decision request. Retries only overload and transient
 * transport failures; never invents answers.
 */
export async function requestDecision(
  config: JudgeConfig,
  body: { model: string; state: unknown; questions: unknown },
  fetchImpl: FetchLike = fetch,
): Promise<Decision> {
  let lastCode = "JUDGE_UNAVAILABLE";
  let lastMessage = "The judge did not answer. Nothing was scored.";
  for (let attempt = 1; attempt <= MAX_JUDGE_ATTEMPTS; attempt += 1) {
    let response: Response;
    try {
      response = await fetchImpl(config.url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${config.apiKey}`,
        },
        body: JSON.stringify(body),
        signal: AbortSignal.timeout(JUDGE_TIMEOUT_MS),
      });
    } catch {
      lastCode = "JUDGE_NETWORK";
      lastMessage =
        "The judge is unreachable right now. Nothing was scored; retry is free.";
      if (attempt < MAX_JUDGE_ATTEMPTS) {
        await sleep(400 * 2 ** (attempt - 1));
        continue;
      }
      throw new JudgeUnavailableError(lastCode, lastMessage);
    }
    if (
      response.status === 429 ||
      response.status === 529 ||
      response.status >= 500
    ) {
      lastCode = `JUDGE_HTTP_${response.status}`;
      lastMessage =
        "The judge is overloaded right now. Nothing was scored; retry is free.";
      if (attempt < MAX_JUDGE_ATTEMPTS) {
        await sleep(400 * 2 ** (attempt - 1));
        continue;
      }
      throw new JudgeUnavailableError(lastCode, lastMessage);
    }
    if (!response.ok)
      throw new JudgeUnavailableError(
        `JUDGE_HTTP_${response.status}`,
        "The judge rejected the request. Nothing was scored.",
      );
    const text = await response.text();
    if (text.length > MAX_RESPONSE_CHARS)
      throw new JudgeUnavailableError(
        "JUDGE_BAD_RESPONSE",
        "The judge response was unusable.",
      );
    let parsed: unknown;
    try {
      parsed = JSON.parse(text);
    } catch {
      throw new JudgeUnavailableError(
        "JUDGE_BAD_RESPONSE",
        "The judge response was unusable.",
      );
    }
    const record = parsed as Record<string, unknown>;
    const answers = record.answers;
    if (typeof answers !== "object" || answers === null)
      throw new JudgeUnavailableError(
        "JUDGE_BAD_RESPONSE",
        "The judge returned no answers.",
      );
    return {
      answers: answers as Record<string, unknown>,
      model:
        typeof record.model === "string" && record.model.length > 0
          ? record.model
          : config.model,
      rawJson: text,
    };
  }
  throw new JudgeUnavailableError(lastCode, lastMessage);
}

/** Judge one line for one pair with the production rubric. */
export async function runAdjudication(
  config: JudgeConfig,
  pair: Pair,
  sentence: string,
  fetchImpl: FetchLike = fetch,
): Promise<AdjudicationDraft> {
  const decision = await requestDecision(
    config,
    buildJudgeRequest(config.model, pair, sentence),
    fetchImpl,
  );
  const bag = decision.answers;
  const appropriateA = parseScoreAnswer(
    bag.appropriate_a,
    APPROPRIATE_LEVELS,
    "appropriate_a",
  );
  const appropriateB = parseScoreAnswer(
    bag.appropriate_b,
    APPROPRIATE_LEVELS,
    "appropriate_b",
  );
  const coherence = parseScoreAnswer(
    bag.coherence,
    COHERENCE_LEVELS,
    "coherence",
  );
  const levels: JudgedLevels = {
    a: appropriateA.score,
    b: appropriateB.score,
    coherence: coherence.level,
  };
  return {
    rubricVersion: RUBRIC_VERSION,
    model: decision.model,
    levels,
    composed: composeResult(levels),
    confidenceMin: Math.min(
      appropriateA.confidence,
      appropriateB.confidence,
      coherence.confidence,
    ),
    rawJson: decision.rawJson,
  };
}
