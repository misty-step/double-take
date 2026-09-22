/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as content from "../content.js";
import type * as crons from "../crons.js";
import type * as game from "../game.js";
import type * as http from "../http.js";
import type * as judge from "../judge.js";
import type * as limits from "../limits.js";
import type * as maintenance from "../maintenance.js";
import type * as productEvents from "../productEvents.js";
import type * as rooms from "../rooms.js";
import type * as rubrics from "../rubrics.js";
import type * as rules from "../rules.js";
import type * as seed from "../seed.js";
import type * as solo from "../solo.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  content: typeof content;
  crons: typeof crons;
  game: typeof game;
  http: typeof http;
  judge: typeof judge;
  limits: typeof limits;
  maintenance: typeof maintenance;
  productEvents: typeof productEvents;
  rooms: typeof rooms;
  rubrics: typeof rubrics;
  rules: typeof rules;
  seed: typeof seed;
  solo: typeof solo;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
