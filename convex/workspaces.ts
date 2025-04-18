import { ConvexError, v } from "convex/values";

// import { generateInviteCode } from "../lib/utils";

import {
  authenticatedUserMutation,
  authenticatedUserQuery,
  authorizedWorkspaceMutation,
  authorizedWorkspaceQuery,
} from "./middleware";
import { generateInviteCode } from "./utils";
import { query } from "./_generated/server";
import { endOfMonth, startOfMonth, subMonths } from "date-fns";
import { filter } from "convex-helpers/server/filter";

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

export const getWorkspaceName = query({
  args: {
    workspaceId: v.id("workspaces"),
  },
  handler: async (ctx, args) => {
    const workspace = await ctx.db.get(args.workspaceId);
    if (!workspace) throw new ConvexError("Workspace not found");
    return workspace.workspaceName;
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
    // it should be impossible for an authenticated user to not have a workspace
    if (!workspace) throw new ConvexError("Workspace not found");
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

export const getWorkspaceAnalytics = authorizedWorkspaceQuery({
  args: {},
  handler: async (ctx, { workspaceId }) => {
    // the workspaceId is already validated in the middleware

    const now = new Date();
    const thisMonthStart = startOfMonth(now);
    const thisMonthEnd = endOfMonth(now);
    const previousMonthStart = startOfMonth(subMonths(now, 1));
    const previousMonthEnd = endOfMonth(subMonths(now, 1));

    const thisMonthTasks = await filter(
      ctx.db
        .query("tasks")
        .withIndex("by_workspaceId", (q) => q.eq("workspaceId", workspaceId)),
      (q) =>
        q._creationTime <= thisMonthEnd.getTime() &&
        q._creationTime >= thisMonthStart.getTime()
    ).collect();

    const lastMonthTasks = await filter(
      ctx.db
        .query("tasks")
        .withIndex("by_workspaceId", (q) => q.eq("workspaceId", workspaceId)),
      (q) =>
        q._creationTime <= previousMonthEnd.getTime() &&
        q._creationTime >= previousMonthStart.getTime()
    ).collect();

    const taskDifference = thisMonthTasks.length - lastMonthTasks.length;

    const thisMonthAssignedTasks = await filter(
      ctx.db
        .query("tasks")
        .withIndex("by_workspaceId", (q) => q.eq("workspaceId", workspaceId)),
      (q) =>
        q._creationTime <= thisMonthEnd.getTime() &&
        q._creationTime >= thisMonthStart.getTime() &&
        q.assigneeId === ctx.user._id
    ).collect();

    const lastMonthAssignedTasks = await filter(
      ctx.db
        .query("tasks")
        .withIndex("by_workspaceId", (q) => q.eq("workspaceId", workspaceId)),
      (q) =>
        q._creationTime <= previousMonthEnd.getTime() &&
        q._creationTime >= previousMonthStart.getTime() &&
        q.assigneeId === ctx.user._id
    ).collect();

    const assignedTaskDifference =
      thisMonthAssignedTasks.length - lastMonthAssignedTasks.length;

    const thisMonthIncompleteTasks = await filter(
      ctx.db
        .query("tasks")
        .withIndex("by_workspaceId", (q) => q.eq("workspaceId", workspaceId)),
      (q) =>
        q._creationTime <= thisMonthEnd.getTime() &&
        q._creationTime >= thisMonthStart.getTime() &&
        q.status !== "DONE"
    ).collect();

    const lastMonthIncompleteTasks = await filter(
      ctx.db
        .query("tasks")
        .withIndex("by_workspaceId", (q) => q.eq("workspaceId", workspaceId)),
      (q) =>
        q._creationTime <= previousMonthEnd.getTime() &&
        q._creationTime >= previousMonthStart.getTime() &&
        q.status !== "DONE"
    ).collect();

    const incompleteTaskDifference =
      thisMonthIncompleteTasks.length - lastMonthIncompleteTasks.length;

    const thisMonthCompleteTasks = await filter(
      ctx.db
        .query("tasks")
        .withIndex("by_workspaceId", (q) => q.eq("workspaceId", workspaceId)),
      (q) =>
        q._creationTime <= thisMonthEnd.getTime() &&
        q._creationTime >= thisMonthStart.getTime() &&
        q.status === "DONE"
    ).collect();

    const lastMonthCompleteTasks = await filter(
      ctx.db
        .query("tasks")
        .withIndex("by_workspaceId", (q) => q.eq("workspaceId", workspaceId)),
      (q) =>
        q._creationTime <= previousMonthEnd.getTime() &&
        q._creationTime >= previousMonthStart.getTime() &&
        q.status === "DONE"
    ).collect();

    const completedTaskDifference =
      thisMonthCompleteTasks.length - lastMonthCompleteTasks.length;

    const thisMonthOverdueTasks = await filter(
      ctx.db
        .query("tasks")
        .withIndex("by_workspaceId", (q) => q.eq("workspaceId", workspaceId)),
      (q) =>
        q._creationTime <= thisMonthEnd.getTime() &&
        q._creationTime >= thisMonthStart.getTime() &&
        q.status !== "DONE" &&
        new Date(q.dueDate) <= now
    ).collect();

    const lastMonthOverdueTasks = await filter(
      ctx.db
        .query("tasks")
        .withIndex("by_workspaceId", (q) => q.eq("workspaceId", workspaceId)),
      (q) =>
        q._creationTime <= previousMonthEnd.getTime() &&
        q._creationTime >= previousMonthStart.getTime() &&
        q.status !== "DONE" &&
        new Date(q.dueDate) <= now
    ).collect();

    const overdueTaskDifference =
      thisMonthOverdueTasks.length - lastMonthOverdueTasks.length;

    return {
      completedTaskDifference,
      completedTaskCount: thisMonthCompleteTasks.length,
      overdueTaskDifference,
      overDueTaskCount: thisMonthOverdueTasks.length,
      incompleteTaskDifference,
      incompleteTaskCount: thisMonthIncompleteTasks.length,
      assignedTaskDifference,
      assignedTaskCount: thisMonthAssignedTasks.length,
      taskDifference,
      taskCount: thisMonthTasks.length,
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

    if (member) throw new ConvexError("Already a member in the workspace");

    // add the user as a member to the workspace
    await ctx.db.insert("members", {
      role: "member",
      workspaceId: args.workspaceId,
      userId: ctx.userId,
    });

    // change the workspace joincode

    await ctx.db.patch(args.workspaceId, {
      workspaceInviteCode: generateInviteCode(10),
    });

    return workspace;
  },
});
