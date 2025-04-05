import { ConvexError, v } from "convex/values";

// import { generateInviteCode } from "../lib/utils";

import {
  authenticatedUserMutation,
  authenticatedUserQuery,
  authorizedWorkspaceMutation,
  authorizedWorkspaceQuery,
} from "./middleware";
import { generateInviteCode } from "./utils";

// ! DATABASE QUERIES
export const getUserWorkspaces = authenticatedUserQuery({
  args: {},
  handler: async (ctx) => {
    const members = await ctx.db
      .query("members")
      .withIndex("by_userId", (q) => q.eq("userId", ctx.user._id))
      .collect();

    const workspaces = await Promise.all(
      members.map(async (member) => {
        const workspace = await ctx.db.get(member.workspaceId);
        if (!workspace) throw new ConvexError("Error fetching workspace");
        return workspace;
      })
    );

    return await Promise.all(
      workspaces.map(async (workspace) => {
        if (!workspace.workspaceAvatar)
          return { ...workspace, workspaceAvatar: "" };
        const avatarUrl = await ctx.storage.getUrl(workspace.workspaceAvatar);
        return {
          ...workspace,
          workspaceAvatar: avatarUrl ?? "",
        };
      })
    );
  },
});

export const getWorkspaceInfo = authenticatedUserQuery({
  args: {
    workspaceId: v.id("workspaces"),
  },
  async handler(ctx, args) {
    const workspace = await ctx.db.get(args.workspaceId);
    if (!workspace) return null;

    return {
      workspaceName: workspace.workspaceName,
    };
  },
});

export const getWorkspaceById = authorizedWorkspaceQuery({
  args: {
    workspaceId: v.id("workspaces"),
  },
  async handler(ctx) {
    // ? Does the user need to be a member to query this data?
    // Is this user a member of this workspace

    const workspace = await ctx.db.get(ctx.member.workspaceId);
    if (!workspace) return null;
    if (!workspace.workspaceAvatar)
      return {
        ...workspace,
        workspaceAvatar: "",
      };
    // if (workspace.workspaceAvatar) {
    const workspaceAvatar = await ctx.storage.getUrl(workspace.workspaceAvatar);
    if (!workspaceAvatar) return { ...workspace, workspaceAvatar: "" };
    // if (workspaceAvatar) {
    return {
      ...workspace,
      workspaceAvatar: workspaceAvatar,
      // };
      // } else {
      //   return {
      //     ...workspace,
      //     workspaceAvatar: "",
      //   };
      // }
    };
  },
});

// ! DATABASE MUTATIONS
export const create = authenticatedUserMutation({
  args: {
    workspaceName: v.string(),
    workspaceImageId: v.optional(v.id("_storage")),
  },
  async handler(ctx, args) {
    const workspaceId = await ctx.db.insert("workspaces", {
      workspaceName: args.workspaceName,
      workspaceCreator: ctx.userId,
      workspaceAvatar: args.workspaceImageId,
      workspaceInviteCode: generateInviteCode(10),
    });

    // create a member document with the user as the admin
    await ctx.db.insert("members", {
      workspaceId: workspaceId,
      role: "admin",
      userId: ctx.userId,
    });

    return workspaceId;
  },
});

export const update = authorizedWorkspaceMutation({
  args: {
    workspaceName: v.optional(v.string()),
    workspaceImageId: v.optional(v.id("_storage")),
  },
  async handler(ctx, args) {
    //? we have access to the workspace document in the ctx argument

    // update the workspace
    await ctx.db.patch(args.workspaceId, {
      workspaceName: args.workspaceName,
      workspaceAvatar: args.workspaceImageId,
    });
    return args.workspaceId;
  },
});

export const remove = authorizedWorkspaceMutation({
  args: {},
  async handler(ctx, args) {
    // TODO: remove the members, tasks and projects as well

    // grab all members of the workspace
    const members = await ctx.db
      .query("members")
      .withIndex("by_workspaceId", (q) =>
        q.eq("workspaceId", ctx.member.workspaceId)
      )
      .collect();

    // delete all members of the workspace
    await Promise.all(
      members.map(async (member) => {
        await ctx.db.delete(member._id);
      })
    );

    await ctx.db.delete(args.workspaceId);
    return args.workspaceId;
  },
});

export const resetInviteLink = authorizedWorkspaceMutation({
  args: {},
  async handler(ctx, args) {
    const workspace = await ctx.db.get(args.workspaceId);
    function getCode() {
      const code = generateInviteCode(10);
      if (code === workspace?.workspaceInviteCode) {
        getCode();
      }
      return code;
    }

    const workspaceInviteCode = getCode();

    await ctx.db.patch(args.workspaceId, {
      workspaceInviteCode,
    });

    return workspaceInviteCode;
  },
});

export const join = authenticatedUserMutation({
  args: {
    workspaceId: v.id("workspaces"),
    workspaceInviteCode: v.string(),
  },
  async handler(ctx, args) {
    //   grab the workspace
    const workspace = await ctx.db.get(args.workspaceId);
    if (!workspace) throw new ConvexError("Failed to join");

    //   check if the workspace code matches
    if (workspace.workspaceInviteCode !== args.workspaceInviteCode)
      throw new ConvexError("Invalid code");

    // check if the user is already a member of the workspace
    const member = await ctx.db
      .query("members")
      .withIndex("by_userId_by_workspaceId", (q) =>
        q.eq("userId", ctx.userId).eq("workspaceId", args.workspaceId)
      )
      .unique();

    if (!member) throw new ConvexError("Already a member in the workspace");
    if (member.userId === ctx.userId)
      throw new ConvexError("Already a member of the workspace");

    // add the user as a member to the workspace
    await ctx.db.insert("members", {
      role: "member",
      workspaceId: args.workspaceId,
      userId: ctx.userId,
    });

    return workspace;
  },
});
