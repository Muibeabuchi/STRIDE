/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as clerkSessions from "../clerkSessions.js";
import type * as http from "../http.js";
import type * as members from "../members.js";
import type * as middleware from "../middleware.js";
import type * as model_projects from "../model/projects.js";
import type * as projects from "../projects.js";
import type * as tasks from "../tasks.js";
import type * as upload from "../upload.js";
import type * as users from "../users.js";
import type * as utils_index from "../utils/index.js";
import type * as workspaces from "../workspaces.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  clerkSessions: typeof clerkSessions;
  http: typeof http;
  members: typeof members;
  middleware: typeof middleware;
  "model/projects": typeof model_projects;
  projects: typeof projects;
  tasks: typeof tasks;
  upload: typeof upload;
  users: typeof users;
  "utils/index": typeof utils_index;
  workspaces: typeof workspaces;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
