/**
 * The Double Take mark, in one place. A tile split into two worlds (blush over
 * navy) with one white speech bubble across both: a line that belongs in both
 * worlds. Every icon, favicon, share card, and in-app mark draws from here.
 */

export const BRAND = {
  blush: "#F8DCE1",
  /** Deeper pink for the 16 px favicon: blush washes out beside a white bubble and a grey tab. */
  rose: "#F2A5B8",
  navy: "#16203A",
  ink: "#000000",
  paper: "#FFFFFF",
} as const;

/** The bubble on a 64 unit grid, its tail in the lower world. */
const BUBBLE = `<path d="M32 7C17 7 6 16.4 6 28.8c0 7.2 3.7 13.4 9.6 17.5L13 57l13.4-7.2c1.8.4 3.7.6 5.6.6 15 0 26-9.4 26-21.6S47 7 32 7z" fill="${BRAND.paper}"/>`;

function tile(rounded: boolean, bubbleScale: number): string {
  const offset = (64 - 64 * bubbleScale) / 2;
  const worlds = `<rect width="64" height="32" fill="${BRAND.blush}"/><rect y="32" width="64" height="32" fill="${BRAND.navy}"/>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">${
    rounded
      ? `<clipPath id="t"><rect width="64" height="64" rx="14"/></clipPath><g clip-path="url(#t)">${worlds}</g>`
      : worlds
  }<g transform="translate(${offset} ${offset - 1}) scale(${bubbleScale})">${BUBBLE}</g></svg>`;
}

/** The mark at 32 px and up, and the 192/512 install icons: rounded tile, transparent corners. */
export const MARK_SVG = tile(true, 0.69);

/** Full-bleed tile for iOS, which rounds the corners itself. */
export const APPLE_ICON_SVG = tile(false, 0.69);

/** Maskable install icon: full bleed, the bubble inside the central 80% safe circle. */
export const MASKABLE_ICON_SVG = tile(false, 0.52);

/**
 * The 16 px optical variant for browser tabs: deeper pink so the top world
 * survives beside the white bubble and a grey tab, and a smaller bubble so a
 * band of pink shows above it.
 */
export const FAVICON_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><clipPath id="t"><rect width="16" height="16" rx="3.5"/></clipPath><g clip-path="url(#t)"><rect width="16" height="8" fill="${BRAND.rose}"/><rect y="8" width="16" height="8" fill="${BRAND.navy}"/></g><path d="M8 3.5c-3 0-5.2 1.8-5.2 4.2 0 1.4.7 2.6 1.9 3.4l-.6 2.3 2.7-1.4c.4.1.8.1 1.2.1 3 0 5.2-1.9 5.2-4.3S11 3.5 8 3.5z" fill="${BRAND.paper}"/></svg>`;

/** Works in the browser and in next/og alike. */
export const svgDataUrl = (svg: string) =>
  `data:image/svg+xml,${encodeURIComponent(svg)}`;
