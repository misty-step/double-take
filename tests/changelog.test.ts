import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { readFileSync } from "node:fs";
import { afterEach, describe, expect, it, vi } from "vitest";
import Changelog from "../app/changelog/page";
import { version } from "../package.json";

describe("build-time changelog", () => {
  afterEach(() => vi.unstubAllEnvs());
  it("renders the canonical notes and build version with a route back to play", () => {
    vi.stubEnv("DOUBLETAKE_CHANGELOG", readFileSync("CHANGELOG.md", "utf8"));
    const html = renderToStaticMarkup(createElement(Changelog));
    expect(html).toContain("<h1>Changelog</h1>");
    expect(html).toContain(`This build · ${version}`);
    expect(html).toContain('href="/"');
    expect(html).toContain(
      'href="https://github.com/misty-step/double-take/releases"',
    );
    expect(html).not.toContain("GITHUB_TOKEN");
  });
  it("refuses missing build-time notes instead of relying on a runtime file", () => {
    vi.stubEnv("DOUBLETAKE_CHANGELOG", "");
    expect(() => renderToStaticMarkup(createElement(Changelog))).toThrow(
      /Build-time changelog/,
    );
  });
});
