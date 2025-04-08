import { DataModel } from "./_generated/dataModel.d";
import { taskStatusValidator } from "./schema";
import {
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
import { populateMemberWithUser, populateProject } from "./model/projects";
import { query } from "./_generated/server";
import { getCurrentUser } from "./users";

export const create = authorizedWorkspaceMutation({
  args: {
    status: taskStatusValidator,
    taskName: v.string(),
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
        "by_workspaceId_by_status",
        (q) => q.eq("workspaceId", args.workspaceId).eq("status", args.status)
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
    paginationOpts: paginationOptsValidator,
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
      paginationOpts,
    }
  ) {
    const tasksTable: QueryInitializer<DataModel["tasks"]> =
      ctx.db.query("tasks");

    let indexedQuery: Query<DataModel["tasks"]> = tasksTable;
    if (workspaceId !== undefined) {
      indexedQuery = tasksTable.withIndex("by_workspaceId", (q) =>
        q.eq("workspaceId", workspaceId)
      );
    }

    let orderedQuery: OrderedQuery<DataModel["tasks"]> = indexedQuery;

    if (search !== undefined) {
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
        (tasks) => tasks.assigneeId === ctx.member.userId
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

    orderedQuery = indexedQuery.order("desc");
    const results = await orderedQuery.paginate(paginationOpts);

    // results.page[0].
    const tasks = results.page;
    const projectIds = tasks.map((task) => task.projectId);
    const assigneeIds = tasks.map((task) => task.assigneeId);

    // Populate the projects
    const projects = await populateProject({ ctx, projectIds });
    // populate the members
    const members = await populateMemberWithUser({
      ctx,
      userIds: assigneeIds,
      workspaceId,
    });

    return {
      ...results,
      pages: results.page.map(async ({ projectId, assigneeId, ...rest }) => {
        const project = projects.find((id) => id._id === projectId);
        const memberWithUser = members.find((id) => id.user._id === assigneeId);
        return {
          ...rest,
          project,
          memberWithUser,
        };
      }),
    };

    // get all the projects using the projects Ids

    // return results.page[0].;
  },
});
