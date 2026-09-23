import type { MetadataRoute } from "next";
import { BRAND } from "../lib/brand";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Double Take",
    short_name: "Double Take",
    description:
      "A party game for 2 to 8 phones. Two worlds, one line that fits both.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: BRAND.paper,
    theme_color: BRAND.paper,
    categories: ["games", "entertainment"],
    icons: [
      {
        src: "/app-icon/192",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/app-icon/512",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/app-icon/maskable-512",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
