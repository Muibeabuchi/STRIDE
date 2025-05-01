import { getAuthUserId } from "@convex-dev/auth/server";
import { QueryCtx } from "./_generated/server";
import { authenticatedUserQuery } from "./middleware";

export const currentUser = authenticatedUserQuery({
  async handler(ctx) {
    return ctx.user;
  },
});

export async function getCurrentUserOrThrow(ctx: QueryCtx) {
  const userRecord = await getCurrentUser(ctx);
  if (!userRecord) throw new Error("Can't get current user");
  return userRecord;
}

export async function getCurrentUser(ctx: QueryCtx) {
  const userId = await getAuthUserId(ctx);

  if (userId === null) {
    return null;
  }
  const user = await ctx.db.get(userId);
  return user;
}
