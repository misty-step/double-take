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
  PLAUSIBILITY_LEVELS,
  RUBRIC_VERSION,
  SPECIFICITY_LEVELS,
  type Pair,
} from "./rubrics";

export type JudgeConfig = {
  readonly url: string;
  readonly apiKey: string;
  readonly model: string;
};

export class JudgeUnavailableError extends Error {
  constructor(
    readonly code: string,
    message: string,
  ) {
    super(message);
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

type ScoreAnswer = { level: number; score: number; confidence: number };

function parseScoreAnswer(
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
  return { level, score, confidence };
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

/** Retry only overload and transient transport failures; never invent answers. */
export async function runAdjudication(
  config: JudgeConfig,
  pair: Pair,
  sentence: string,
  fetchImpl: FetchLike = fetch,
): Promise<AdjudicationDraft> {
  const body = buildJudgeRequest(config.model, pair, sentence);
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
    const bag = answers as Record<string, unknown>;
    const plausibilityA = parseScoreAnswer(
      bag.plausibility_a,
      PLAUSIBILITY_LEVELS,
      "plausibility_a",
    );
    const plausibilityB = parseScoreAnswer(
      bag.plausibility_b,
      PLAUSIBILITY_LEVELS,
      "plausibility_b",
    );
    const coherence = parseScoreAnswer(
      bag.coherence,
      COHERENCE_LEVELS,
      "coherence",
    );
    const specificity = parseScoreAnswer(
      bag.specificity,
      SPECIFICITY_LEVELS,
      "specificity",
    );
    const levels: JudgedLevels = {
      plausibilityA: plausibilityA.level,
      plausibilityB: plausibilityB.level,
      coherence: coherence.level,
      specificity: specificity.level,
    };
    return {
      rubricVersion: RUBRIC_VERSION,
      model:
        typeof record.model === "string" && record.model.length > 0
          ? record.model
          : config.model,
      levels,
      composed: composeResult(levels),
      confidenceMin: Math.min(
        plausibilityA.confidence,
        plausibilityB.confidence,
        coherence.confidence,
        specificity.confidence,
      ),
      rawJson: text,
    };
  }
  throw new JudgeUnavailableError(lastCode, lastMessage);
}
