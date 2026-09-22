import { describe, expect, it, vi } from "vitest";
import { CALIBRATION, PAIRS, pairByKey } from "../convex/content";
import {
  JudgeUnavailableError,
  readJudgeConfig,
  runAdjudication,
} from "../convex/judge";
import { checkSentence, normalizeSentence } from "../convex/rules";

const pair = pairByKey("vow-villain")!;

function scoreAnswer(level: number, confidence = 0.9) {
  return {
    type: "score",
    score: level,
    legend: { "0": "l0", "1": "l1", "2": "l2", "3": "l3" },
    probabilities: { "0": 0, "1": 0, "2": 0, "3": 0, [String(level)]: 1 },
    confidence,
  };
}

function response(levels: {
  a: number;
  b: number;
  coherence: number;
  specificity: number;
}) {
  return {
    model: "jev-1.13-test",
    answers: {
      plausibility_a: scoreAnswer(levels.a),
      plausibility_b: scoreAnswer(levels.b),
      coherence: scoreAnswer(levels.coherence),
      specificity: scoreAnswer(levels.specificity),
    },
  };
}

const config = {
  url: "https://judge.test/decisions",
  apiKey: "test-key-not-real",
  model: "typesafe/jev-1.13",
};

describe("judge configuration", () => {
  it("requires the decisions url, key, and model together", () => {
    expect(readJudgeConfig({})).toBeNull();
    expect(readJudgeConfig({ JEV_DECISIONS_URL: "https://x.test" })).toBeNull();
    expect(
      readJudgeConfig({
        JEV_DECISIONS_URL: "https://x.test",
        JEV_MODEL: "typesafe/jev-1.13",
        OPENROUTER_API_KEY: "short",
      }),
    ).toBeNull();
    expect(
      readJudgeConfig({
        JEV_DECISIONS_URL: "https://x.test/decisions",
        JEV_MODEL: "typesafe/jev-1.13",
        OPENROUTER_API_KEY: "a-long-enough-key",
      }),
    ).toMatchObject({ model: "typesafe/jev-1.13" });
  });
});

describe("runAdjudication", () => {
  it("parses the documented score answers and composes the weaker reading", async () => {
    const fetchMock = vi.fn(
      async (_url: RequestInfo | URL, _init?: RequestInit) =>
        new Response(
          JSON.stringify(
            response({ a: 3, b: 3, coherence: 3, specificity: 2 }),
          ),
          {
            status: 200,
          },
        ),
    );
    const draft = await runAdjudication(
      config,
      pair,
      "I will love you until death takes me",
      fetchMock,
    );
    expect(draft.levels).toEqual({
      plausibilityA: 3,
      plausibilityB: 3,
      coherence: 3,
      specificity: 2,
    });
    expect(draft.composed).toMatchObject({ weaker: 3, points: 6, gate: "ok" });
    expect(draft.rubricVersion).toBe("double-take-rubric@2");
    const body = JSON.parse(String(fetchMock.mock.calls[0]?.[1]?.body));
    expect(body.model).toBe("typesafe/jev-1.13");
    expect(body.state.sentence).toBe("I will love you until death takes me");
    expect(body.state.context_a.label).toBe("Wedding vow");
    expect(Object.keys(body.questions)).toEqual([
      "plausibility_a",
      "plausibility_b",
      "coherence",
      "specificity",
    ]);
  });

  it("retries overload with backoff, then succeeds", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(new Response("busy", { status: 429 }))
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify(
            response({ a: 2, b: 2, coherence: 2, specificity: 2 }),
          ),
          { status: 200 },
        ),
      );
    const draft = await runAdjudication(
      config,
      pair,
      "Tonight we feast on what remains",
      fetchMock,
    );
    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(draft.composed.points).toBe(3);
  });

  it("fails closed after repeated overload", async () => {
    const fetchMock = vi.fn(async () => new Response("busy", { status: 529 }));
    await expect(
      runAdjudication(config, pair, "Some line", fetchMock),
    ).rejects.toMatchObject({
      code: "JUDGE_HTTP_529",
    });
    expect(fetchMock).toHaveBeenCalledTimes(3);
  });

  it("fails closed on unreadable or mistyped answers", async () => {
    const notJson = vi.fn(
      async () => new Response("<html>gateway</html>", { status: 200 }),
    );
    await expect(
      runAdjudication(config, pair, "Some line", notJson),
    ).rejects.toMatchObject({
      code: "JUDGE_BAD_RESPONSE",
    });
    const wrongType = vi.fn(
      async () =>
        new Response(
          JSON.stringify({
            model: "x",
            answers: {
              plausibility_a: { type: "noul", noul: 0.9 },
              plausibility_b: {},
              coherence: {},
              specificity: {},
            },
          }),
          { status: 200 },
        ),
    );
    await expect(
      runAdjudication(config, pair, "Some line", wrongType),
    ).rejects.toBeInstanceOf(JudgeUnavailableError);
  });

  it("fails closed on network errors", async () => {
    const fetchMock = vi.fn(async () => {
      throw new TypeError("fetch failed");
    });
    await expect(
      runAdjudication(config, pair, "Some line", fetchMock),
    ).rejects.toMatchObject({
      code: "JUDGE_NETWORK",
    });
  });
});

describe("deck integrity", () => {
  it("has unique pair keys with both contexts and an example", () => {
    const keys = new Set(PAIRS.map((p) => p.key));
    expect(keys.size).toBe(PAIRS.length);
    for (const item of PAIRS) {
      expect(item.contextA.label.length).toBeGreaterThan(2);
      expect(item.contextB.label.length).toBeGreaterThan(2);
      expect(item.contextA.setting.length).toBeGreaterThan(10);
      expect(item.contextB.setting.length).toBeGreaterThan(10);
    }
  });
});

describe("calibration deck integrity", () => {
  it("is non-empty, references real pairs, and stays inside level range", () => {
    expect(CALIBRATION.length).toBeGreaterThan(0);
    const keys = new Set(PAIRS.map((p) => p.key));
    for (const example of CALIBRATION) {
      expect(keys.has(example.pairKey)).toBe(true);
      for (const level of Object.values(example.expected)) {
        expect(Number.isInteger(level)).toBe(true);
        expect(level).toBeGreaterThanOrEqual(0);
        expect(level).toBeLessThanOrEqual(3);
      }
      expect(example.note.length).toBeGreaterThan(10);
    }
  });

  it("uses every calibration sentence exactly once, normalized", () => {
    const seen = new Set(
      CALIBRATION.map((example) => normalizeSentence(example.sentence)),
    );
    expect(seen.size).toBe(CALIBRATION.length);
  });

  it("keeps every calibration sentence playable under the player gate", () => {
    // A deck entry over the word cap is judge-side only: no player can ever
    // submit it through the UI. This test keeps the whole deck player-reachable
    // (the 13-word letter-fineprint original failed exactly here).
    for (const example of CALIBRATION) {
      const check = checkSentence(example.sentence);
      expect({
        sentence: example.sentence,
        ok: check.ok,
        code: check.ok ? null : check.code,
      }).toEqual({ sentence: example.sentence, ok: true, code: null });
    }
  });
});
