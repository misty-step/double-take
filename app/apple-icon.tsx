import { ImageResponse } from "next/og";
import { APPLE_ICON_SVG, svgDataUrl } from "../lib/brand";

/** Home screen icon on iOS. Full bleed: iOS rounds the corners itself. */
export const size = { width: 180, height: 180 };
export const contentType = "image/png";
export const dynamic = "force-static";

export default function AppleIcon() {
  return new ImageResponse(
    // next/og renders a plain img; next/image does not apply here.
    <img src={svgDataUrl(APPLE_ICON_SVG)} width={180} height={180} alt="" />,
    size,
  );
}
