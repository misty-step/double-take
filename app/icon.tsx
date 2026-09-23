import { FAVICON_SVG } from "../lib/brand";

/** The tab icon. Tabs draw it at 16 px, so it is the 16 px optical variant. */
export const contentType = "image/svg+xml";
export const dynamic = "force-static";

export default function Icon() {
  return new Response(FAVICON_SVG, {
    headers: { "Content-Type": contentType },
  });
}
