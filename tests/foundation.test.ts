import { readFile } from "node:fs/promises";
import { describe, expect, it } from "vitest";

const root = new URL("../", import.meta.url);

async function source(path: string) {
  return readFile(new URL(path, root), "utf8");
}

describe("browser-app foundation", () => {
  it("ships editable optical mark variants for 16, 32, and large use", async () => {
    const variants = await Promise.all([
      source("public/brand/double-take-mark-16.svg"),
      source("public/brand/double-take-mark-32.svg"),
      source("public/brand/double-take-mark.svg"),
    ]);
    expect(variants[0]).toMatch(/width="16" height="16"/);
    expect(variants[0]).toContain("M1 3h10.5a2.5 2.5 0 0 1 0 5H1z");
    expect(variants[0]).toContain("M4.5 7H15v5H4.5a2.5 2.5 0 0 1 0-5Z");
    expect(variants[1]).toMatch(/width="32" height="32"/);
    expect(variants[2]).toMatch(/viewBox="0 0 128 128"/);
    for (const svg of variants) {
      expect(svg).toContain("#4f6bff");
      expect(svg).toContain("#ff5a45");
      expect(svg).not.toMatch(/<text\b/);
    }
  });

  it("wires favicon and share metadata to served assets", async () => {
    const layout = await source("app/layout.tsx");
    expect(layout).toContain('url: "/brand/double-take-mark-16.svg"');
    expect(layout).toContain('url: "/brand/double-take-mark-32.svg"');
    expect(layout).toContain('images: ["/brand/double-take-share.svg"]');
  });

  it("keeps evaluator internals out of the player component", async () => {
    const component = await source("components/double-take.tsx");
    expect(component).not.toMatch(/judge confidence/i);
    expect(component).not.toMatch(/Scoring details/i);
    expect(component).not.toMatch(/rubricVersion/);
    expect(component).not.toMatch(/confidenceMin/);
  });

  it("retains a maintainable design and copy specification", async () => {
    const design = await source("docs/design-and-copy.md");
    expect(design).toContain("Two Impressions");
    expect(design).toContain("16 px");
    expect(design).toContain("Player copy");
  });

  it("keeps compact labels and disabled actions readable", async () => {
    const css = await source("app/globals.css");
    expect(css).toContain("--ink-faint: #b9afc5");
    expect(css).toContain("0.018em 0.015em 0 var(--riso-blue)");
    expect(css).toContain("-0.014em -0.012em 0 var(--riso-red)");
    expect(css).toMatch(
      /\.button\.primary:disabled\s*\{[^}]*background:\s*#303557;[^}]*color:\s*var\(--ink-soft\);[^}]*box-shadow:\s*none;/s,
    );
    expect(css).toMatch(
      /@media \(max-width: 700px\)[\s\S]*\.row > \.button\.ghost\.small\s*\{[^}]*flex:\s*0 0 auto;/,
    );
  });

  it("keeps package-lock generation out of formatter churn", async () => {
    const prettierIgnore = await source(".prettierignore");
    expect(prettierIgnore.split(/\r?\n/)).toContain("pnpm-lock.yaml");
  });

  it("ships executable browser-app operations surfaces", async () => {
    const [healthRoute, backendHealth, events, instrumentation, workflow] =
      await Promise.all([
        source("app/api/health/route.ts"),
        source("convex/http.ts"),
        source("convex/productEvents.ts"),
        source("instrumentation.ts"),
        source(".github/workflows/ci.yml"),
      ]);
    expect(healthRoute).toContain("GET");
    expect(backendHealth).toContain('path: "/health"');
    expect(events).toContain("recordProductEvent");
    expect(instrumentation).toContain("captureRequestError");
    expect(workflow).toContain("pnpm check");
    expect(workflow).toContain("pnpm build:web");
  });
});
