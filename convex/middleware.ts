import {
  customCtx,
  customMutation,
  customQuery,
} from "convex-helpers/server/customFunctions";
import { mutation, query, QueryCtx } from "./_generated/server";
import { ConvexError, v } from "convex/values";
import { getCurrentUser } from "./users";
import { Id } from "./_generated/dataModel";

// !MIDDLEWARES

export const authenticatedUserQuery = customQuery(
  query,
  customCtx(async (ctx) => {
    const user = await getCurrentUser(ctx);

    if (!user) throw new ConvexError("Unauthorized");
    return { user };
  })
);

export const authorizedWorkspaceQuery = customQuery(query, {
  args: { workspaceId: v.id("workspaces") },
  input: async (ctx, args) => {
    // get the user
    const user = await getCurrentUser(ctx);

    if (!user) throw new ConvexError("Unauthorized");

    // is the user a member of the workspace
    const member = await ctx.db
      .query("members")
      .withIndex("by_userId_by_workspaceId", (q) =>
        q.eq("userId", user._id).eq("workspaceId", args.workspaceId)
      )
      .unique();
    if (!member) throw new ConvexError("Unauthorized");

    return { ctx: { member }, args: { workspaceId: args.workspaceId } };
  },
});

export const authorizedWorkspaceMutation = customMutation(mutation, {
  args: {
    workspaceId: v.id("workspaces"),
  },
  async input(ctx, args) {
    const user = await getCurrentUser(ctx);

    if (!user) throw new ConvexError("Unauthorized");

    // TODO: check if the user is also an member and admin

    // check if the user is a member of the workspace
    const member = await ctx.db
      .query("members")
      .withIndex("by_userId_by_workspaceId", (q) =>
        q.eq("userId", user._id).eq("workspaceId", args.workspaceId)
      )
      .unique();
    if (!member) throw new ConvexError("Unauthorized");

    // check if the member is an admin
    const isAdmin = member.role === "admin";

    // check if the user is the creator
    if (!isAdmin)
      throw new ConvexError(
        "You do not have permission to change this workspace"
      );

    return { ctx: { member }, args };
  },
});

export const authenticatedUserMutation = customMutation(mutation, {
  args: {},
  input: async (ctx, args) => {
    const user = await getCurrentUser(ctx);

    if (!user) throw new ConvexError("Unauthorized");

    return { ctx: { userId: user._id }, args: {} };
  },
});
