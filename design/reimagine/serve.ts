/**
 * Local server for the Double Take prototypes, with live Jev scoring.
 *
 * Serves design/reimagine as static files and answers POST /judge with a real
 * adjudication: the authored pair from convex/content.ts, the production
 * request from convex/rubrics.ts, and the production client in convex/judge.ts.
 * The key stays in this process; the browser only sees levels.
 *
 *   JEV_MODEL=typesafe/jev-1.13 \
 *   JEV_DECISIONS_URL=https://openrouter.ai/api/alpha/decisions \
 *   pass-env run -e OPENROUTER_API_KEY=workstation/DOUBLETAKE_OPENROUTER_API_KEY -- \
 *   bun design/reimagine/serve.ts
 *
 * Then open http://127.0.0.1:4173/synthesis/
 */

import { join, normalize, sep } from "node:path";
import { pairByKey } from "../../convex/content.ts";
import { JudgeUnavailableError, readJudgeConfig, runAdjudication } from "../../convex/judge.ts";
import { checkSentence } from "../../convex/rules.ts";

const root = import.meta.dir;
const port = Number(process.env.PORT ?? 4173);
const config = readJudgeConfig(process.env);
if (!config) {
  console.error("Missing JEV_DECISIONS_URL, JEV_MODEL, or OPENROUTER_API_KEY. See the header of serve.ts.");
  process.exit(2);
}

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } });

async function judge(request: Request): Promise<Response> {
  let body: { pairKey?: unknown; text?: unknown };
  try {
    body = await request.json();
  } catch {
    return json({ error: "BAD_REQUEST" }, 400);
  }
  const pair = typeof body.pairKey === "string" ? pairByKey(body.pairKey) : undefined;
  const check = typeof body.text === "string" ? checkSentence(body.text) : null;
  if (!pair || !check || !check.ok) return json({ error: "BAD_REQUEST" }, 400);
  const started = Date.now();
  try {
    const draft = await runAdjudication(config!, pair, check.text);
    const { plausibilityA: a, plausibilityB: b, coherence, specificity } = draft.levels;
    console.log(`jev ${pair.key} a=${a} b=${b} coherence=${coherence} specificity=${specificity} ${Date.now() - started}ms "${check.text}"`);
    return json({ a, b, coherence, specificity });
  } catch (error) {
    const code = error instanceof JudgeUnavailableError ? error.code : "JUDGE_UNAVAILABLE";
    console.error(`jev ${pair.key} failed ${code} ${Date.now() - started}ms "${check.text}"`);
    return json({ error: code }, 502);
  }
}

async function file(pathname: string): Promise<Response> {
  const relative = normalize(decodeURIComponent(pathname)).replace(/^([/\\])+/, "");
  const target = join(root, relative.endsWith(sep) || relative === "" ? join(relative, "index.html") : relative);
  if (!target.startsWith(root + sep)) return new Response("Not found", { status: 404 });
  const found = Bun.file(target);
  if (await found.exists()) return new Response(found);
  const index = Bun.file(join(target, "index.html"));
  return (await index.exists()) ? new Response(index) : new Response("Not found", { status: 404 });
}

Bun.serve({
  hostname: "127.0.0.1",
  port,
  fetch(request) {
    const { pathname } = new URL(request.url);
    if (pathname === "/judge") return request.method === "POST" ? judge(request) : new Response(null, { status: 405 });
    return file(pathname);
  },
});

console.log(`Double Take prototype with live Jev (${config.model}): http://127.0.0.1:${port}/synthesis/`);
