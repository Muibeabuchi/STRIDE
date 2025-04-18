import {
  authenticatedUserMutation,
  authenticatedUserQuery,
  authorizedWorkspaceMutation,
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

export const remove = authorizedWorkspaceMutation({
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
          .eq("userId", ctx.member.userId)
          .eq("workspaceId", ctx.member.workspaceId)
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

    // only admins can delete a member
    if (userMember.role !== "admin") throw new ConvexError("Unauthorized");
    //     if we are trying to delete another user, we must be admins
    if (userMember._id !== memberToBeDeleted._id && userMember.role !== "admin")
      throw new ConvexError("Unauthorized");

    //     prevent user from deleting himself if he is the last member in the workspace
    if (allMembers.length <= 1 && userMember._id === memberToBeDeleted._id)
      throw new ConvexError("There must be at least 1 member in the workspace");

    //     delete the member if all requirements has been fulfilled
    await ctx.db.delete(memberToBeDeleted._id);
    return memberToBeDeleted;
  },
});

export const updateRole = authorizedWorkspaceMutation({
  args: {
    memberRole: v.union(v.literal("admin"), v.literal("member")),
    memberId: v.id("members"),
  },
  async handler(ctx, args) {
    // grab the member to be edited
    const memberToBeEdited = await ctx.db.get(args.memberId);
    if (!memberToBeEdited)
      throw new ConvexError("User is not a member of the workspace");

    // // grab the users member data
    // const userMember = await ctx.db
    //   .query("members")
    //   .withIndex("by_userId_by_workspaceId", (q) =>
    //     q
    //       .eq("userId", ctx.member.userId)
    //       .eq("workspaceId", memberToBeEdited.workspaceId)
    //   )
    //   .unique();
    // if (!userMember) throw new ConvexError("Unauthorized");

    //     grab the length of all the members in the workspace
    const allMembers = await ctx.db
      .query("members")
      .withIndex("by_workspaceId", (q) => q.eq("workspaceId", args.workspaceId))
      .collect();

    //     if we are trying to update another user, we must be admins
    if (ctx.member.role !== "admin") throw new ConvexError("Unauthorized");

    // emsure there is at least 1 admin in the workspace
    const admins = allMembers.filter((member) => member.role === "admin");
    if (admins.length === 1)
      throw new ConvexError("There must be at least 1 admin in the workspace");

    // prevent user from updating  his role to member if he is the last member in the workspace
    if (allMembers.length <= 1 && args.memberRole === "member")
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
