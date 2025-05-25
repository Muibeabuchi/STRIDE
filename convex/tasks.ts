import { DataModel, Id } from "./_generated/dataModel.d";
import { taskStatusValidator } from "./schema";
import {
  authenticatedUserQuery,
  authorizedWorkspaceMutation,
  authorizedWorkspaceQuery,
} from "./middleware";
import { ConvexError, v } from "convex/values";
import {
  QueryInitializer,
  Query,
  OrderedQuery,
  paginationOptsValidator,
} from "convex/server";

import { filter } from "convex-helpers/server/filter";
import {
  populateMemberWithUser,
  populateProject,
  populateProjectWithImage,
} from "./model/projects";
import { mutation, query, QueryCtx } from "./_generated/server";
import { ensureTaskExists, validateTaskWorkspace } from "./model/tasks";

export const create = authorizedWorkspaceMutation({
  args: {
    status: taskStatusValidator,
    taskName: v.string(),
    // TODO: Refactor to accept and store the memberId instead of the userId
    assigneeId: v.id("users"),
    projectId: v.id("projects"),
    dueDate: v.string(),
  },
  async handler(ctx, args) {
    // only admin members of the workspace and  are allowed to create tasks

    let newPosition: number;

    const tasks = await ctx.db
      .query("tasks")
      .withIndex(
        "by_workspaceId_by_projectId_by_status",
        (q) =>
          q
            .eq("workspaceId", args.workspaceId)
            .eq("projectId", args.projectId)
            .eq("status", args.status)
        //   .eq("position", args.position)
      )
      .collect();

    if (!tasks || tasks.length === 0) {
      newPosition = 1000;
    } else {
      const highestPositionTask = tasks.sort(
        (a, b) => b.position - a.position
      )[0];

      newPosition = highestPositionTask.position + 1000;
    }

    return await ctx.db.insert("tasks", {
      taskName: args.taskName,
      status: args.status,
      workspaceId: args.workspaceId,
      projectId: args.projectId,
      dueDate: args.dueDate,
      assigneeId: args.assigneeId,
      position: newPosition,
    });
  },
});

export const get = authorizedWorkspaceQuery({
  args: {
    // TODO: Find a way to eliminate this field (workspaceId) from the query from the frontend
    workspaceId: v.id("workspaces"),
    projectId: v.optional(v.id("projects")),
    assigneeId: v.optional(v.id("users")),
    status: v.optional(taskStatusValidator),
    search: v.optional(v.string()),
    dueDate: v.optional(v.string()),
  },
  async handler(
    ctx,
    {
      workspaceId,
      assigneeId,
      projectId,
      dueDate,
      search,
      status,
      // paginationOpts,
    }
  ) {
    const tasksTable: QueryInitializer<DataModel["tasks"]> =
      ctx.db.query("tasks");

    let indexedQuery: Query<DataModel["tasks"]> = tasksTable;
    if (workspaceId !== undefined && search === undefined) {
      indexedQuery = tasksTable.withIndex("by_workspaceId", (q) =>
        q.eq("workspaceId", workspaceId)
      );
    }

    let orderedQuery: OrderedQuery<DataModel["tasks"]> = indexedQuery;

    orderedQuery = indexedQuery.order("desc");

    if (search !== undefined && workspaceId !== undefined) {
      orderedQuery = tasksTable.withSearchIndex(
        "by_description_by_taskName",
        (q) => q.search("taskName", search).eq("workspaceId", workspaceId)
      );
    }

    if (dueDate !== undefined) {
      orderedQuery = filter(orderedQuery, (tasks) => tasks.dueDate === dueDate);
    }
    if (assigneeId !== undefined) {
      orderedQuery = filter(
        orderedQuery,
        (tasks) => tasks.assigneeId === assigneeId
      );
    }
    if (status !== undefined) {
      orderedQuery = filter(orderedQuery, (tasks) => tasks.status === status);
    }
    if (projectId !== undefined) {
      orderedQuery = filter(
        orderedQuery,
        (tasks) => tasks.projectId === projectId
      );
    }

    const results = await orderedQuery.collect();

    // results.page[0].
    const tasks = results;
    const projectIds = tasks.map((task) => task.projectId);
    const assigneeIds = tasks.map((task) => task.assigneeId);

    // Populate the projects
    const projects = await populateProject({ ctx, projectIds });

    // projects.map(async (project) => {
    //   if (!project.projectImage) return project;
    //   const image = await ctx.storage.getUrl(project.projectImage);
    //   return {
    //     ...project,
    //     projectImage: image ?? "",
    //   };
    // });
    // populate the members
    const members = await populateMemberWithUser({
      ctx,
      userIds: assigneeIds,
      workspaceId,
    });

    const tasksResult = results.map(({ projectId, assigneeId, ...rest }) => {
      const project = projects.find((id) => id._id === projectId);
      if (!project) throw new ConvexError("Project does not exist");
      const memberWithUser = members.find((id) => id.user._id === assigneeId);
      if (!memberWithUser) throw new ConvexError("MemberUser does not exist");

      return {
        ...rest,
        taskProject: project,
        memberUser: memberWithUser,
      };
    });

    return tasksResult;
  },
});

export const getById = authenticatedUserQuery({
  args: {
    taskId: v.id("tasks"),
  },
  async handler(ctx, args) {
    const task = await ctx.db.get(args.taskId);
    if (!task) throw new ConvexError("Task does not exist");

    // ensure that the user is a member of the workspace

    // load the project associated with this task
    const taskProject = await ctx.db.get(task.projectId);
    if (!taskProject) throw new ConvexError("TaskProject does not exist");
    const projectWithImage = await populateProjectWithImage({
      ctx,
      project: taskProject,
    });

    // load the task Assignee
    const taskAssignee = await ctx.db.get(task.assigneeId);
    if (!taskAssignee) throw new ConvexError("Task Assignee does not exist");

    // load the task Member detail
    const taskMember = await ctx.db
      .query("members")
      .withIndex("by_userId_by_workspaceId", (q) =>
        q.eq("userId", task.assigneeId).eq("workspaceId", task.workspaceId)
      )
      .unique();

    if (!taskMember) throw new ConvexError("Task Member does not exist");

    const assignee = {
      ...taskMember,
      name: taskAssignee.name,
      email: taskAssignee.email,
    };

    return {
      ...task,
      project: projectWithImage,
      assignee,
    };
  },
});

export const remove = mutation({
  args: { taskId: v.id("tasks") },
  async handler(ctx, args) {
    const task = await ensureTaskExists(ctx, args.taskId);
    if (!task) throw new ConvexError("Failed to confirm if the task is exists");

    await validateTaskWorkspace(ctx, task.workspaceId);
    await ctx.db.delete(task._id);
  },
});

export const edit = authorizedWorkspaceMutation({
  args: {
    taskId: v.id("tasks"),
    projectId: v.optional(v.id("projects")),
    taskDescription: v.optional(v.string()),
    taskName: v.optional(v.string()),
    taskStatus: v.optional(taskStatusValidator),
    dueDate: v.optional(v.string()),
    assigneeId: v.optional(v.id("users")),
    taskPosition: v.optional(v.number()),
  },
  async handler(ctx, args) {
    const {
      taskId,
      workspaceId,
      assigneeId,
      dueDate,
      projectId,
      taskStatus,
      taskDescription,
      taskName,
      taskPosition,
    } = args;
    const task = await ensureTaskExists(ctx, taskId);
    if (!task) throw new ConvexError("Task does not exist");

    await ctx.db.patch(task._id, {
      status: taskStatus ?? task.status,
      position: taskPosition ?? task.position,
      description: taskDescription ?? task.description,
      assigneeId: assigneeId ?? task.assigneeId,
      dueDate: dueDate ?? task.dueDate,
      projectId: projectId ?? task.projectId,
      taskName: taskName ?? task.taskName,
    });
  },
});
