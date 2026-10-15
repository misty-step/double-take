import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import Changelog from "../app/changelog/page";
import { version } from "../package.json";

describe("build-time changelog", () => {
  it("renders the canonical notes and build version with a route back to play", () => {
    const html = renderToStaticMarkup(createElement(Changelog));
    expect(html).toContain("<h1>Changelog</h1>");
    expect(html).toContain(`This build · ${version}`);
    expect(html).toContain('href="/"');
    expect(html).toContain(
      'href="https://github.com/misty-step/double-take/releases"',
    );
    expect(html).not.toContain("GITHUB_TOKEN");
  });
});
