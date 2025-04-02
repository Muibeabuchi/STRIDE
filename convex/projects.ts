import { ConvexError, v } from "convex/values";

import {
  authenticatedUserQuery,
  authorizedWorkspaceMutation,
  authorizedWorkspaceQuery,
} from "./middleware";

export const get = authorizedWorkspaceQuery({
  args: {
    workspaceId: v.id("workspaces"),
  },
  async handler(ctx, args) {
    // grab all the projects for the workspace
    const projects = await ctx.db
      .query("projects")
      .withIndex("by_workspaceId", (q) => q.eq("workspaceId", args.workspaceId))
      .order("desc")
      .collect();

    // TODO: crosscheck this return type
    if (!projects) return null;

    return await Promise.all(
      projects.map(async (project) => {
        if (!project.projectImage)
          return {
            ...project,
            projectImage: "",
          };
        const projectImage =
          (await ctx.storage.getUrl(project.projectImage)) ?? "";

        return {
          ...project,
          projectImage,
        };
      })
    );

    // return
  },
});

export const getById = authorizedWorkspaceQuery({
  args: { projectId: v.id("projects") },
  async handler(ctx, args) {
    // load and return  the project
    const project = await ctx.db.get(args.projectId);

    if (!project) throw new ConvexError("Project not found");

    return {
      ...project,
      projectImage: project.projectImage
        ? (await ctx.storage.getUrl(project.projectImage)) ?? ""
        : "",
    };
  },
});

export const create = authorizedWorkspaceMutation({
  args: {
    projectName: v.string(),
    projectImage: v.optional(v.id("_storage")),
  },
  async handler(ctx, args) {
    // Only admins are allowed to create projects in the workspace
    if (ctx.member.role !== "admin")
      throw new ConvexError("Unauthorized, Only admins can create projects");

    return await ctx.db.insert("projects", {
      workspaceId: args.workspaceId,
      projectName: args.projectName,
      projectImage: args.projectImage,
    });
  },
});

export const update = authorizedWorkspaceMutation({
  args: {
    projectId: v.id("projects"),
    projectName: v.optional(v.string()),
    projectImage: v.optional(v.id("_storage")),
  },
  async handler(ctx, args) {
    // grab the project and confirm it exists
    const project = await ctx.db.get(args.projectId);
    if (!project) throw new ConvexError("project does not exist");

    await ctx.db.patch(project._id, {
      projectName: args.projectImage,
      projectImage: args.projectImage,
    });
    return project;
  },
});

export const remove = authorizedWorkspaceMutation({
  args: { projectId: v.id("projects") },
  async handler(ctx, args) {
    // TODO: Delete all project tasks

    const project = await ctx.db.get(args.projectId);
    if (!project) throw new ConvexError("Project does not exist");

    await ctx.db.delete(args.projectId);
  },
});
