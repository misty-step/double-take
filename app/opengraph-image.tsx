import { ImageResponse } from "next/og";
import { BRAND } from "../lib/brand";

/**
 * The link preview in group chats: the home screen's example, two worlds and
 * one line that fits both. Built once at build time, in the game's typeface.
 */
export const alt =
  "Double Take: a wedding vow and a villain's gloat, and one line that fits both.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const dynamic = "force-static";

const LINE = "I have waited years for this moment.";

/** Google Fonts serves TTF (which next/og needs) when asked without a browser user agent. */
async function newsreader(weight: 400 | 600, italic: boolean) {
  const css = await fetch(
    `https://fonts.googleapis.com/css2?family=Newsreader:ital,wght@${italic ? 1 : 0},${weight}`,
  ).then((response) => response.text());
  const url = css.match(/src: url\((.+?)\) format\('truetype'\)/)?.[1];
  if (!url) throw new Error("Newsreader font file not found");
  return fetch(url).then((response) => response.arrayBuffer());
}

export default async function OpenGraphImage() {
  const [regular, semibold, italic] = await Promise.all([
    newsreader(400, false),
    newsreader(600, false),
    newsreader(400, true),
  ]);
  const world = (label: string, bg: string, ink: string, mark?: boolean) => (
    <div
      style={{
        flex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 72px",
        background: bg,
        color: ink,
        fontSize: 52,
      }}
    >
      <span style={{ fontStyle: "italic" }}>{label}</span>
      {mark && (
        <span style={{ fontSize: 40, fontWeight: 600 }}>Double Take</span>
      )}
    </div>
  );
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        fontFamily: "Newsreader",
      }}
    >
      {world("A wedding vow", BRAND.blush, BRAND.ink)}
      <div
        style={{
          height: 220,
          display: "flex",
          alignItems: "center",
          padding: "0 72px",
          background: BRAND.paper,
          fontSize: 66,
          color: BRAND.ink,
        }}
      >
        {LINE}
      </div>
      {world("A villain\u2019s gloat", BRAND.navy, BRAND.paper, true)}
    </div>,
    {
      ...size,
      fonts: [
        { name: "Newsreader", data: regular, weight: 400, style: "normal" },
        { name: "Newsreader", data: semibold, weight: 600, style: "normal" },
        { name: "Newsreader", data: italic, weight: 400, style: "italic" },
      ],
    },
  );
}
