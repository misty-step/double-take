import { defineConfig } from "vitest/config";

/** Unchanged application suites, with only the backend runtime replaced. */
export default defineConfig({
  resolve: { alias: { "convex-test": "@parlor/cloudflare/testing" } },
  test: {
    include: [
      "tests/game.test.ts",
      "tests/product-events-convex.test.ts",
      "tests/backend-migration.test.ts",
    ],
    environment: "node",
  },
});
