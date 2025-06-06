import { ConvexError, v } from "convex/values";
import { subMonths, startOfMonth, endOfMonth } from "date-fns";

import {
  authorizedWorkspaceMutation,
  authorizedWorkspaceQuery,
} from "./middleware";
import { filter } from "convex-helpers/server/filter";
import { IssueStatusValidator } from "./schema";
import {
  DEFAULT_PROJECT_TASK_STATUS,
  DEFAULT_PROJECT_TASK_STATUS_NAME,
  FREE_MAX_TASK_STATUS,
  NUMBER_OF_DEFAULT_TASK_STATUS,
} from "./constants";
import { ensureUniqueTaskStatusName } from "./model/projects";

// ================================QUERIES ===============================
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

    // const thisMonthIncompleteTasks = await filter(
    //   ctx.db
    //     .query("tasks")
    //     .withIndex("by_WorkspaceId_ProjectId", (q) =>
    //       q.eq("workspaceId", workspaceId).eq("projectId", projectId)
    //     ),
    //   (q) =>
    //     q._creationTime <= thisMonthEnd.getTime() &&
    //     q._creationTime >= thisMonthStart.getTime() &&
    //     q.status !== "DONE"
    // ).collect();

    // const lastMonthIncompleteTasks = await filter(
    //   ctx.db
    //     .query("tasks")
    //     .withIndex("by_WorkspaceId_ProjectId", (q) =>
    //       q.eq("workspaceId", workspaceId).eq("projectId", projectId)
    //     ),
    //   (q) =>
    //     q._creationTime <= previousMonthEnd.getTime() &&
    //     q._creationTime >= previousMonthStart.getTime() &&
    //     q.status !== "DONE"
    // ).collect();

    // const incompleteTaskDifference =
    //   thisMonthIncompleteTasks.length - lastMonthIncompleteTasks.length;

    // const thisMonthCompleteTasks = await filter(
    //   ctx.db
    //     .query("tasks")
    //     .withIndex("by_WorkspaceId_ProjectId", (q) =>
    //       q.eq("workspaceId", workspaceId).eq("projectId", projectId)
    //     ),
    //   (q) =>
    //     q._creationTime <= thisMonthEnd.getTime() &&
    //     q._creationTime >= thisMonthStart.getTime() &&
    //     q.status === "DONE"
    // ).collect();

    // const lastMonthCompleteTasks = await filter(
    //   ctx.db
    //     .query("tasks")
    //     .withIndex("by_WorkspaceId_ProjectId", (q) =>
    //       q.eq("workspaceId", workspaceId).eq("projectId", projectId)
    //     ),
    //   (q) =>
    //     q._creationTime <= previousMonthEnd.getTime() &&
    //     q._creationTime >= previousMonthStart.getTime() &&
    //     q.status === "DONE"
    // ).collect();

    // const completedTaskDifference =
    //   thisMonthCompleteTasks.length - lastMonthCompleteTasks.length;

    // const thisMonthOverdueTasks = await filter(
    //   ctx.db
    //     .query("tasks")
    //     .withIndex("by_WorkspaceId_ProjectId", (q) =>
    //       q.eq("workspaceId", workspaceId).eq("projectId", projectId)
    //     ),
    //   (q) =>
    //     q._creationTime <= thisMonthEnd.getTime() &&
    //     q._creationTime >= thisMonthStart.getTime() &&
    //     q.status !== "DONE" &&
    //     new Date(q.dueDate) <= now
    // ).collect();

    // const lastMonthOverdueTasks = await filter(
    //   ctx.db
    //     .query("tasks")
    //     .withIndex("by_WorkspaceId_ProjectId", (q) =>
    //       q.eq("workspaceId", workspaceId).eq("projectId", projectId)
    //     ),
    //   (q) =>
    //     q._creationTime <= previousMonthEnd.getTime() &&
    //     q._creationTime >= previousMonthStart.getTime() &&
    //     q.status !== "DONE" &&
    //     new Date(q.dueDate) <= now
    // ).collect();

    // const overdueTaskDifference =
    //   thisMonthOverdueTasks.length - lastMonthOverdueTasks.length;

    return {
      // completedTaskDifference,
      // completedTaskCount: thisMonthCompleteTasks.length,
      // overdueTaskDifference,
      // overDueTaskCount: thisMonthOverdueTasks.length,
      // incompleteTaskDifference,
      // incompleteTaskCount: thisMonthIncompleteTasks.length,
      assignedTaskDifference,
      assignedTaskCount: thisMonthAssignedTasks.length,
      taskDifference,
      taskCount: thisMonthTasks.length,
    };
  },
});

// ======================MUTATIONS ================================
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
      projectTaskStatus: DEFAULT_PROJECT_TASK_STATUS,
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

/**
 * Asynchronously attempts to perform an operation, checking for name availability.
 *
 * @async
 * @param {string} name - The name to check or use for the operation.
 * @returns {Promise<undefined | -1>} A Promise that resolves to:
 * - `undefined` if the operation completes successfully and the name is available (no issues).
 * - `-1` if there was an error, specifically indicating that the "Name is already taken".
 */
export const addProjectStatus = authorizedWorkspaceMutation({
  args: {
    projectId: v.id("projects"),
    projectTaskStatus: IssueStatusValidator,
  },
  async handler(ctx, args) {
    // grab the project
    const projectData = await ctx.db.get(args.projectId);
    if (!projectData) throw new ConvexError("Project does not exist");
    if (!projectData.projectTaskStatus)
      throw new ConvexError("Project TaskStatus does not exist");

    const projectStatus = projectData.projectTaskStatus;

    if (!projectStatus)
      throw new ConvexError("There should be a Project Status");
    // check if the number of taskStatus has exceeded the maximum limit
    if (
      projectStatus.length >
      NUMBER_OF_DEFAULT_TASK_STATUS + FREE_MAX_TASK_STATUS
    ) {
      // TODO: Block the user on the frontend from creating extra task-status when on the free plan
      throw new ConvexError(
        "UNAUTHORIZED: User does not have the authorization to create extra task status"
      );
    }
    const isUniqueTaskStatusName = await ensureUniqueTaskStatusName({
      ctx,
      projectId: args.projectId,
      statusName: args.projectTaskStatus.issueName,
    });

    if (!isUniqueTaskStatusName.isUniqueName) return -1;

    // grab the taskStatus with the highest position
    const highestTaskStatus = [...projectStatus].sort(
      (status1, status2) => status2.issuePosition - status1.issuePosition
    )[0];

    await ctx.db.patch(args.projectId, {
      projectTaskStatus: [
        ...projectStatus,
        {
          issueName: isUniqueTaskStatusName.isUniqueName?.issueName,
          issuePosition: highestTaskStatus.issuePosition,
        },
      ],
    });
  },
});

/**
 * Asynchronously attempts to perform an operation, checking for name availability.
 *
 * @async
 * @param {string} name - The name to check or use for the operation.
 * @returns {Promise<undefined | -1>} A Promise that resolves to:
 * - `undefined` if the operation completes successfully and the name is available (no issues).
 * - `-1` if there was an error, specifically indicating that the "Name is already taken".
 */
export const editProjectStatusPositionOrName = authorizedWorkspaceMutation({
  args: {
    projectId: v.id("projects"),
    //? ProjectTaskStatus names are unique identifiers
    taskId: v.string(),
    newTaskStatusName: v.optional(v.string()),
    TaskStatusPosition: v.optional(v.number()),
  },
  async handler(
    ctx,
    { newTaskStatusName, projectId, taskId, TaskStatusPosition }
  ) {
    // ? Prevent the user from updating to the same old statusName
    // ?This should also be implemented on the FrontEnd
    if (newTaskStatusName === taskId) return -1;

    // ?Update the task Status Position
    if (TaskStatusPosition) {
      // ? THis function also checks if the project exists
      const validTaskStatus = await ensureUniqueTaskStatusName({
        ctx,
        projectId,
        statusName: taskId,
      });

      if (validTaskStatus.isUniqueName === undefined) return -1;

      if (!validTaskStatus.projectInfo.projectTaskStatus)
        throw new ConvexError("Project Status must exist");
      const taskStatusUniqueName = validTaskStatus.isUniqueName;
      const filteredTask = validTaskStatus.projectInfo.projectTaskStatus.map(
        (status) => {
          if (status.issueName === taskStatusUniqueName.issueName) {
            return {
              ...status,
              issuePosition: taskStatusUniqueName.issuePosition,
            };
          } else {
            return status;
          }
        }
      );

      await ctx.db.patch(projectId, {
        projectTaskStatus: filteredTask,
      });
    }

    // ?EDIT THE TASK STATUS NAME
    // ensure the newTaskStatusName is not the same as any existing taskStatus names
    if (newTaskStatusName) {
      const isUniqueTaskStatusName = await ensureUniqueTaskStatusName({
        ctx,
        projectId,
        statusName: newTaskStatusName,
      });

      if (!isUniqueTaskStatusName.isUniqueName) return -1;
      const statusName = isUniqueTaskStatusName.isUniqueName.issueName;
      if (!isUniqueTaskStatusName.projectInfo.projectTaskStatus)
        throw new ConvexError("Task Status must exist");
      // filter the taskStatus
      const filteredTaskStatus =
        isUniqueTaskStatusName.projectInfo.projectTaskStatus.map((status) => {
          if (status.issueName === statusName) {
            return {
              ...status,
              issueName: statusName,
            };
          } else return status;
        });

      await ctx.db.patch(projectId, {
        projectTaskStatus: filteredTaskStatus,
      });
    }
  },
});

export const removeProjectTaskStatus = authorizedWorkspaceMutation({
  args: {
    projectId: v.id("projects"),
    projectTaskStatus: v.string(),
  },
  async handler(ctx, args) {
    // grab the project
    const projectData = await ctx.db.get(args.projectId);
    if (!projectData) throw new ConvexError("Project does not exist");

    const projectStatus = projectData.projectTaskStatus;
    // Permit deleting of projectTaskStatus if it exists
    if (!projectStatus) throw new ConvexError("Project Status must exist");

    //? grab the "Deletable taskStatus"
    const deleteAbleTaskStatus = projectStatus
      .map((status) => {
        const statusName = status.issueName;
        return !!DEFAULT_PROJECT_TASK_STATUS_NAME.find((s) => s === statusName)
          ? null
          : status;
      })
      .filter((s) => s !== null);

    // check if the projectTaskStatus exists
    // TODO: Change after the migration
    // const statusToRemove = projectData.projectTaskStatus?.find(
    const statusToRemove = deleteAbleTaskStatus.find(
      (status) => status.issueName === args.projectTaskStatus
    );

    if (!statusToRemove) throw new ConvexError("Status does not exist");

    // grab the tasks associated with the status
    const tasksWithProjectTaskStatus = await ctx.db
      .query("tasks")
      .withIndex("by_workspaceId_by_projectId_by_status", (q) =>
        q
          .eq("workspaceId", args.workspaceId)
          .eq("projectId", args.projectId)
          .eq("status", statusToRemove.issueName)
      )
      .collect();

    // delete the tasks associated with the projectStatus
    // TODO: Future versions will give the admin options in the settings menu  to either delete the tasks associated with the status or move them to a different status
    await Promise.all(
      tasksWithProjectTaskStatus.map(async (task) => {
        await ctx.db.delete(task._id);
      })
    );

    //! DEPRECATED VERSION OF THE APPLICATION
    // // check if the status is the last one
    // const isLastStatus =
    //   projectData.projectTaskStatus !== null &&
    //   // TODO: Change after the migration
    //   projectData.projectTaskStatus?.length === 1;

    // await ctx.db.patch(args.projectId, {
    //   // TODO: Change after the migration
    //   projectTaskStatus: projectData.projectTaskStatus?.filter(
    //     (status) => status !== statusToRemove
    //   ),
    // });

    // // if its the last status, we create a generic default status
    // if (isLastStatus) {
    //   await ctx.db.patch(args.projectId, {
    //     projectTaskStatus: ["TODO"],
    //   });
    // }
  },
});
