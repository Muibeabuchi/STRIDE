import { ConvexError } from "convex/values";
import { Doc, Id } from "../_generated/dataModel";
import { QueryCtx } from "../_generated/server";

export const DEFAULT_PROJECT_TASK_STATUS = [
  "TODO",
  "DONE",
  "IN_REVIEW",
  "BACKLOG",
  "IN_PROGRESS",
];

export async function populateProject({
  ctx,
  projectIds,
}: {
  ctx: QueryCtx;
  projectIds: Id<"projects">[];
}) {
  return await Promise.all(
    projectIds.map(async (id) => {
      const response = await ctx.db.get(id);
      if (!response) throw new ConvexError("Project does not exist");
      if (!response.projectImage) return { ...response, projectImage: "" };
      const image = await ctx.storage.getUrl(response.projectImage);
      return { ...response, projectImage: image ?? "" };
    })
  );
}

export async function populateProjectWithImage({
  ctx,
  project,
}: {
  ctx: QueryCtx;
  project: Doc<"projects">;
}) {
  if (!project.projectImage) return { ...project, projectImage: "" };
  const image = await ctx.storage.getUrl(project.projectImage);
  return { ...project, projectImage: image ?? "" };
}

export async function populateMemberWithUser({
  ctx,
  userIds,
  workspaceId,
}: {
  ctx: QueryCtx;
  userIds: Id<"users">[];
  workspaceId: Id<"workspaces">;
}) {
  return await Promise.all(
    userIds.map(async (id) => {
      const user = await ctx.db.get(id);
      if (!user) throw new ConvexError("User does not exist");
      const response = await ctx.db
        .query("members")
        .withIndex("by_userId_by_workspaceId", (q) =>
          q.eq("userId", id).eq("workspaceId", workspaceId)
        )
        // A user can only have a single memberId per workspace
        .unique();
      // check if the user is a member of the workspace
      if (!response) throw new ConvexError("Member does not exist");

      return { user, member: response };
    })
  );
}
