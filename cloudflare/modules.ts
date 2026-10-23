import type { ModuleSource } from "@parlor/cloudflare";

/** Explicit function modules; helpers stay imports of the rules that own them. */
export const modules = {
  game: () => import("../convex/game"),
  limits: () => import("../convex/limits"),
  maintenance: () => import("../convex/maintenance"),
  productEvents: () => import("../convex/productEvents"),
  recovery: () => import("../convex/recovery"),
  rooms: () => import("../convex/rooms"),
  seed: () => import("../convex/seed"),
} satisfies Record<string, ModuleSource>;
