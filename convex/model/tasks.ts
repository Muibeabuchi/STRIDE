import { ConvexError } from "convex/values";
import { Id } from "../_generated/dataModel";
import { QueryCtx } from "../_generated/server";
import { getCurrentUser } from "../users";

export async function ensureTaskExists(ctx: QueryCtx, taskId: Id<"tasks">) {
  const task = await ctx.db.get(taskId);
  if (!task) return null;

  return task;
}

export const validateTaskWorkspace = async (
  ctx: QueryCtx,
  workspaceId: Id<"workspaces">
) => {
  const user = await getCurrentUser(ctx);

  if (!user) throw new ConvexError("Unauthorized");

  // check if the user is a member of the workspace
  const member = await ctx.db
    .query("members")
    .withIndex("by_userId_by_workspaceId", (q) =>
      q.eq("userId", user._id).eq("workspaceId", workspaceId)
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

  return {
    member,
    user,
  };
};
