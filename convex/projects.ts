import { ConvexError, v } from "convex/values";
import { subMonths, startOfMonth, endOfMonth } from "date-fns";

import {
  authenticatedUserQuery,
  authorizedWorkspaceMutation,
  authorizedWorkspaceQuery,
} from "./middleware";
import { filter } from "convex-helpers/server/filter";

export const get = authorizedWorkspaceQuery({
  args: {
    workspaceId: v.id("workspaces"),
  },
  async handler(ctx, args) {
    // grab all the projects for the workspace
    const projects = await ctx.db
      .query("projects")
      .withIndex("by_workspaceId", (q) => q.eq("workspaceId", args.workspaceId))
      .order("desc")
      .collect();

    return await Promise.all(
      projects.map(async (project) => {
        if (!project.projectImage)
          return {
            ...project,
            projectImage: "",
          };
        const projectImage =
          (await ctx.storage.getUrl(project.projectImage)) ?? "";

        return {
          ...project,
          projectImage,
        };
      })
    );

    // return
  },
});

export const getById = authorizedWorkspaceQuery({
  args: { projectId: v.id("projects") },
  async handler(ctx, args) {
    // load and return  the project
    const project = await ctx.db.get(args.projectId);

    if (!project) throw new ConvexError("Project not found");

    return {
      ...project,
      projectImage: project.projectImage
        ? (await ctx.storage.getUrl(project.projectImage)) ?? ""
        : "",
    };
  },
});

export const create = authorizedWorkspaceMutation({
  args: {
    projectName: v.string(),
    projectImage: v.optional(v.id("_storage")),
  },
  async handler(ctx, args) {
    // Only admins are allowed to create projects in the workspace
    if (ctx.member.role !== "admin")
      throw new ConvexError("Unauthorized, Only admins can create projects");

    return await ctx.db.insert("projects", {
      workspaceId: args.workspaceId,
      projectName: args.projectName,
      projectImage: args.projectImage,
    });
  },
});

export const update = authorizedWorkspaceMutation({
  args: {
    projectId: v.id("projects"),
    projectName: v.string(),
    projectImage: v.optional(v.id("_storage")),
  },
  async handler(ctx, args) {
    // grab the project and confirm it exists
    const project = await ctx.db.get(args.projectId);
    if (!project) throw new ConvexError("project does not exist");

    await ctx.db.patch(project._id, {
      projectName: args.projectName,
      projectImage: args.projectImage,
    });
    return project;
  },
});

export const remove = authorizedWorkspaceMutation({
  args: { projectId: v.id("projects") },
  async handler(ctx, args) {
    // TODO: Delete all project tasks

    // grab all the tasks that belongs to the project
    const tasks = await ctx.db
      .query("tasks")
      .withIndex("by_WorkspaceId_ProjectId", (q) =>
        q.eq("workspaceId", args.workspaceId).eq("projectId", args.projectId)
      )
      .collect();
    // delete all the tasks and await them in parallel
    await Promise.all(
      tasks.map(async (task) => {
        await ctx.db.delete(task._id);
      })
    );

    const project = await ctx.db.get(args.projectId);
    if (!project) throw new ConvexError("Project does not exist");

    await ctx.db.delete(args.projectId);
  },
});

export const getProjectAnalytics = authorizedWorkspaceQuery({
  args: {
    projectId: v.id("projects"),
  },
  async handler(ctx, { projectId, workspaceId }) {
    const now = new Date();
    const thisMonthStart = startOfMonth(now);
    const thisMonthEnd = endOfMonth(now);
    const previousMonthStart = startOfMonth(subMonths(now, 1));
    const previousMonthEnd = endOfMonth(subMonths(now, 1));

    const thisMonthTasks = await filter(
      ctx.db
        .query("tasks")
        .withIndex("by_WorkspaceId_ProjectId", (q) =>
          q.eq("workspaceId", workspaceId).eq("projectId", projectId)
        ),
      (q) =>
        q._creationTime <= thisMonthEnd.getTime() &&
        q._creationTime >= thisMonthStart.getTime()
    ).collect();

    const lastMonthTasks = await filter(
      ctx.db
        .query("tasks")
        .withIndex("by_WorkspaceId_ProjectId", (q) =>
          q.eq("workspaceId", workspaceId).eq("projectId", projectId)
        ),
      (q) =>
        q._creationTime <= previousMonthEnd.getTime() &&
        q._creationTime >= previousMonthStart.getTime()
    ).collect();

    const taskDifference = thisMonthTasks.length - lastMonthTasks.length;

    const thisMonthAssignedTasks = await filter(
      ctx.db
        .query("tasks")
        .withIndex("by_WorkspaceId_ProjectId", (q) =>
          q.eq("workspaceId", workspaceId).eq("projectId", projectId)
        ),
      (q) =>
        q._creationTime <= thisMonthEnd.getTime() &&
        q._creationTime >= thisMonthStart.getTime() &&
        q.assigneeId === ctx.user._id
    ).collect();

    const lastMonthAssignedTasks = await filter(
      ctx.db
        .query("tasks")
        .withIndex("by_WorkspaceId_ProjectId", (q) =>
          q.eq("workspaceId", workspaceId).eq("projectId", projectId)
        ),
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
        .withIndex("by_WorkspaceId_ProjectId", (q) =>
          q.eq("workspaceId", workspaceId).eq("projectId", projectId)
        ),
      (q) =>
        q._creationTime <= thisMonthEnd.getTime() &&
        q._creationTime >= thisMonthStart.getTime() &&
        q.status !== "DONE"
    ).collect();

    const lastMonthIncompleteTasks = await filter(
      ctx.db
        .query("tasks")
        .withIndex("by_WorkspaceId_ProjectId", (q) =>
          q.eq("workspaceId", workspaceId).eq("projectId", projectId)
        ),
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
        .withIndex("by_WorkspaceId_ProjectId", (q) =>
          q.eq("workspaceId", workspaceId).eq("projectId", projectId)
        ),
      (q) =>
        q._creationTime <= thisMonthEnd.getTime() &&
        q._creationTime >= thisMonthStart.getTime() &&
        q.status === "DONE"
    ).collect();

    const lastMonthCompleteTasks = await filter(
      ctx.db
        .query("tasks")
        .withIndex("by_WorkspaceId_ProjectId", (q) =>
          q.eq("workspaceId", workspaceId).eq("projectId", projectId)
        ),
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
        .withIndex("by_WorkspaceId_ProjectId", (q) =>
          q.eq("workspaceId", workspaceId).eq("projectId", projectId)
        ),
      (q) =>
        q._creationTime <= thisMonthEnd.getTime() &&
        q._creationTime >= thisMonthStart.getTime() &&
        q.status !== "DONE" &&
        new Date(q.dueDate) <= now
    ).collect();

    const lastMonthOverdueTasks = await filter(
      ctx.db
        .query("tasks")
        .withIndex("by_WorkspaceId_ProjectId", (q) =>
          q.eq("workspaceId", workspaceId).eq("projectId", projectId)
        ),
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
