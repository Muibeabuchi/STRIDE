import { ConvexError } from "convex/values";
import { Doc, Id } from "../_generated/dataModel";
import { QueryCtx } from "../_generated/server";

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

export async function ensureUniqueTaskStatusName({
  ctx,
  projectId,
  statusName,
}: {
  ctx: QueryCtx;
  statusName: string;
  projectId: Id<"projects">;
}) {
  // ! We are assuming this function is called from an authorized api
  // Loop through all the project Task Status, checking if the  statusName is repeated

  const project = await ctx.db.get(projectId);
  if (!project) throw new ConvexError("The project does not exist");
  const projectTaskStatusNames = project.projectTaskStatus;
  if (!projectTaskStatusNames)
    throw new ConvexError("The project has not task status");

  return {
    isUniqueName: projectTaskStatusNames.find(
      (status) => status.issueName === statusName
    ),
    projectInfo: project,
  };

  // return !projectStatus ? null : projectStatus;
}
