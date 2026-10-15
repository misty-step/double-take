import type { Metadata } from "next";
import { readFileSync } from "node:fs";
import Markdown from "react-markdown";
import { version } from "../../package.json";
import "./changelog.css";

export const dynamic = "force-static";
export const metadata: Metadata = { title: "Changelog — Double Take" };

export default function Changelog() {
  const notes = readFileSync("CHANGELOG.md", "utf8");
  return (
    <div className="release-page">
      <nav aria-label="Double Take" className="release-bar">
        <a href="/">Double Take</a>
        <a href="/">Back to the game</a>
      </nav>
      <main className="release-notes">
        <p className="release-version">This build · {version}</p>
        <Markdown skipHtml>{notes}</Markdown>
        <p className="release-source">
          <a href="https://github.com/misty-step/double-take/releases">
            Release notes on GitHub
          </a>
        </p>
      </main>
    </div>
  );
}
