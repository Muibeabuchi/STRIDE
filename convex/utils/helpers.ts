import { ConvexError } from "convex/values";
import { Id } from "../_generated/dataModel";
import { QueryCtx } from "../_generated/server";

export async function ensureUserIsMember({
  ctx,
  workspaceId,
  userId,
}: {
  ctx: QueryCtx;
  workspaceId: Id<"workspaces">;
  userId: Id<"users">;
}) {
  // check if the user is a member of the workspace
  const member = await ctx.db
    .query("members")
    .withIndex("by_userId_by_workspaceId", (q) =>
      q.eq("userId", userId).eq("workspaceId", workspaceId)
    )
    .unique();
  if (!member) throw new ConvexError("Unauthorized");
  return member;
}
