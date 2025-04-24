import {
  internalMutation,
  MutationCtx,
  query,
  QueryCtx,
} from "./_generated/server";
import { UserJSON } from "@clerk/backend";

import { ConvexError, v, Validator } from "convex/values";

export const current = query({
  args: {},
  handler: async (ctx) => {
    return await getCurrentUser(ctx);
  },
});

export const upsertFromClerk = internalMutation({
  args: { data: v.any() as Validator<UserJSON> }, // no runtime validation, trust Clerk
  async handler(ctx, { data }) {
    const user = await userByExternalId(ctx, data.id);
    if (user === null) {
      await ctx.db.insert("users", {
        id: data.id,
        name: data.username || data.first_name || data.last_name || "User",
        email: data.email_addresses[0].email_address,
        profilePicture: data.image_url,
      });
    } else {
      await ctx.db.patch(user._id, {
        name: data.username!,
        profilePicture: data.image_url,
      });
    }
  },
});

export const deleteFromClerk = internalMutation({
  args: { clerkUserId: v.string() },
  async handler(ctx, { clerkUserId }) {
    const user = await userByExternalId(ctx, clerkUserId);

    if (user !== null) {
      // grab the users memberships
      const memberships = await ctx.db
        .query("members")
        .withIndex("by_userId", (q) => q.eq("userId", user._id))
        .collect();
      if (!memberships || memberships.length < 1)
        throw new ConvexError("User has no memberships");
      // delete all memberships
      await Promise.all(
        memberships.map(
          async (membership) => await ctx.db.delete(membership._id)
        )
      );
      // grab the users workspaces
      const workspaces = await ctx.db
        .query("workspaces")
        .withIndex("by_workspace_creator", (q) =>
          q.eq("workspaceCreator", user._id)
        )
        .collect();
      if (!workspaces || workspaces.length < 1)
        throw new ConvexError("User has no workspaces");
      // delete all workspaces and workspace projects
      await Promise.all(
        workspaces.map(async (workspace) => {
          // delete all projects
          const projects = await ctx.db
            .query("projects")
            .withIndex("by_workspaceId", (q) =>
              q.eq("workspaceId", workspace._id)
            )
            .collect();
          // delete all projects
          await Promise.all(
            projects.map(async (project) => await ctx.db.delete(project._id))
          );

          // delete all the tasks of this workspace
          const tasks = await ctx.db
            .query("tasks")
            .withIndex("by_workspaceId", (q) =>
              q.eq("workspaceId", workspace._id)
            )
            .collect();
          await Promise.all(
            tasks.map(async (task) => await ctx.db.delete(task._id))
          );

          // delete the workspace
          await ctx.db.delete(workspace._id);
        })
      );

      // delete all tasks assigned to the user
      const tasks = await ctx.db
        .query("tasks")
        .withIndex("by_assigneeId", (q) => q.eq("assigneeId", user._id))
        .collect();
      await Promise.all(
        tasks.map(async (task) => await ctx.db.delete(task._id))
      );

      // delete the user
      await ctx.db.delete(user._id);
    } else {
      console.warn(
        `Can't delete user, there is none for Clerk user ID: ${clerkUserId}`
      );
    }
  },
});

export async function getCurrentUserOrThrow(ctx: QueryCtx) {
  const userRecord = await getCurrentUser(ctx);
  if (!userRecord) throw new Error("Can't get current user");
  return userRecord;
}

export async function getCurrentUser(ctx: QueryCtx) {
  const identity = await ctx.auth.getUserIdentity();
  if (identity === null) {
    return null;
  }
  const user = await userByExternalId(ctx, identity.subject);
  return user;
}

async function userByExternalId(ctx: QueryCtx, externalId: string) {
  return await ctx.db
    .query("users")
    .withIndex("id", (q) => q.eq("id", externalId))
    .unique();
}
