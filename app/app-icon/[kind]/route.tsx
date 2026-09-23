import { ImageResponse } from "next/og";
import { MARK_SVG, MASKABLE_ICON_SVG, svgDataUrl } from "../../../lib/brand";

/** Install icons named by the web manifest (app/manifest.ts). Built once, at build time. */
const ICONS = {
  "192": { svg: MARK_SVG, size: 192 },
  "512": { svg: MARK_SVG, size: 512 },
  "maskable-512": { svg: MASKABLE_ICON_SVG, size: 512 },
} as const;
type Kind = keyof typeof ICONS;

export const dynamic = "force-static";
export const dynamicParams = false;
export function generateStaticParams() {
  return Object.keys(ICONS).map((kind) => ({ kind }));
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ kind: string }> },
) {
  const { kind } = await params;
  const icon = ICONS[kind as Kind];
  if (!icon) return new Response("Not found", { status: 404 });
  return new ImageResponse(
    <img
      src={svgDataUrl(icon.svg)}
      width={icon.size}
      height={icon.size}
      alt=""
    />,
    { width: icon.size, height: icon.size },
  );
}
