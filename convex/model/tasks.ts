import { ConvexError } from "convex/values";
import { Id } from "../_generated/dataModel";
import { QueryCtx } from "../_generated/server";
import { getCurrentUser } from "../users";
import { ensureUserIsMember } from "../utils/helpers";

export async function ensureTaskExists(ctx: QueryCtx, taskId: Id<"tasks">) {
  const task = await ctx.db.get(taskId);
  if (!task) return null;

  return task;
}

export const ensureProjectTaskStatus = async ({
  ctx,
  status,
  projectId,
}: {
  ctx: QueryCtx;
  status: string | undefined;
  projectId: Id<"projects">;
}) => {
  if (!status) return undefined;

  const project = await ctx.db.get(projectId);
  if (!project) throw new ConvexError("Project does not exist");
  if (!project.projectTaskStatus)
    throw new ConvexError("ProjectTaskStatus does not exist");

  // check if the status is defined in  the project
  return project.projectTaskStatus.find((s) => s.issueName === status);
};

export const validateTaskWorkspace = async (
  ctx: QueryCtx,
  workspaceId: Id<"workspaces">
) => {
  const user = await getCurrentUser(ctx);

  if (!user) throw new ConvexError("Unauthorized");

  const member = await ensureUserIsMember({
    ctx,
    workspaceId,
    userId: user._id,
  });

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
