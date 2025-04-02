import {
  authenticatedUserMutation,
  authenticatedUserQuery,
} from "./middleware";
import { ConvexError, v } from "convex/values";

export const get = authenticatedUserQuery({
  args: {
    workspaceId: v.id("workspaces"),
  },
  async handler(ctx, args) {
    //   user must be a member of the workspace
    const member = await ctx.db
      .query("members")
      .withIndex("by_userId_by_workspaceId", (q) =>
        q.eq("userId", ctx.user._id).eq("workspaceId", args.workspaceId)
      )
      .unique();

    if (!member) throw new ConvexError("unauthorized");

    const members = await ctx.db
      .query("members")
      .withIndex("by_workspaceId", (q) => q.eq("workspaceId", args.workspaceId))
      .collect();

    return await Promise.all(
      members.map(async (member) => {
        const userData = await ctx.db.get(member.userId);
        if (!userData) throw new ConvexError("Error while fetching userData");
        return {
          ...member,
          userName: userData.name,
          userEmail: userData.email,
        };
      })
    );
  },
});

export const remove = authenticatedUserMutation({
  args: {
    memberId: v.id("members"),
  },
  async handler(ctx, args) {
    // grab the member to be deleted
    const memberToBeDeleted = await ctx.db.get(args.memberId);
    if (!memberToBeDeleted)
      throw new ConvexError("Error while deleting member");

    //     grab the users member data
    const userMember = await ctx.db
      .query("members")
      .withIndex("by_userId_by_workspaceId", (q) =>
        q
          .eq("userId", ctx.userId)
          .eq("workspaceId", memberToBeDeleted.workspaceId)
      )
      .unique();
    if (!userMember) throw new ConvexError("Unauthorized");

    //     grab the length of all the members in the workspace
    const allMembers = await ctx.db
      .query("members")
      .withIndex("by_workspaceId", (q) =>
        q.eq("workspaceId", memberToBeDeleted.workspaceId)
      )
      .collect();

    //     if we are trying to delete another user, we must be admins
    if (userMember._id !== memberToBeDeleted._id && userMember.role !== "admin")
      throw new ConvexError("Unauthorized");

    //     prevent user from deleting himself if he is the last member in the workspace
    if (allMembers.length <= 1)
      throw new ConvexError("There must be at least 1 member in the workspace");

    //     delete the member if all requirements has been fulfilled
    await ctx.db.delete(memberToBeDeleted._id);
    return memberToBeDeleted;
  },
});

export const updateRole = authenticatedUserMutation({
  args: {
    memberRole: v.union(v.literal("admin"), v.literal("member")),
    memberId: v.id("members"),
  },
  async handler(ctx, args) {
    // grab the member to be edited
    const memberToBeEdited = await ctx.db.get(args.memberId);
    if (!memberToBeEdited)
      throw new ConvexError("Error while updating the member");

    //     grab the users member data
    const userMember = await ctx.db
      .query("members")
      .withIndex("by_userId_by_workspaceId", (q) =>
        q
          .eq("userId", ctx.userId)
          .eq("workspaceId", memberToBeEdited.workspaceId)
      )
      .unique();
    if (!userMember) throw new ConvexError("Unauthorized");

    //     grab the length of all the members in the workspace
    const allMembers = await ctx.db
      .query("members")
      .withIndex("by_workspaceId", (q) =>
        q.eq("workspaceId", memberToBeEdited.workspaceId)
      )
      .collect();

    //     if we are trying to delete another user, we must be admins
    if (userMember.role !== "admin") throw new ConvexError("Unauthorized");

    // prevent user from deleting himself if he is the last member in the workspace
    if (allMembers.length <= 1)
      throw new ConvexError(
        "Cannot downgrade the only member in the workspace"
      );

    //     update the members role in the workspace
    await ctx.db.patch(memberToBeEdited._id, {
      role: args.memberRole,
    });
    return memberToBeEdited;
  },
});
