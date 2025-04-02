import { taskStatusValidator } from "./schema";
import { authorizedWorkspaceMutation } from "./middleware";
import { ConvexError, v } from "convex/values";

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
    }

    const highestPositionTask = tasks.sort(
      (a, b) => b.position - a.position
    )[0];

    newPosition = highestPositionTask.position + 1000;

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
