import { defineSchema, defineTable } from "convex/server";
import { type Infer, v } from "convex/values";
import { Doc } from "./_generated/dataModel";
import { api } from "./_generated/api";
import { authTables } from "@convex-dev/auth/server";

export const IssueStatusValidator = v.object({
  issueName: v.string(),
  issuePosition: v.number(),
});

export type IssueStatusTypes = Infer<typeof IssueStatusValidator>;

const schema = defineSchema({
  ...authTables,
  workspaces: defineTable({
    workspaceName: v.string(),
    workspaceCreator: v.id("users"),
    workspaceAvatar: v.optional(v.id("_storage")),
    workspaceInviteCode: v.string(),
  }).index("by_workspace_creator", ["workspaceCreator"]),
  members: defineTable({
    userId: v.id("users"),
    workspaceId: v.id("workspaces"),
    role: v.union(v.literal("admin"), v.literal("member")),
  })
    .index("by_userId", ["userId"])
    .index("by_userId_by_workspaceId", ["userId", "workspaceId"])
    .index("by_workspaceId", ["workspaceId"]),
  projects: defineTable({
    projectImage: v.optional(v.id("_storage")),
    projectName: v.string(),
    workspaceId: v.id("workspaces"),
    // Project status can either be an array of strings or  null
    projectTaskStatus: v.optional(
      v.union(v.array(IssueStatusValidator), v.array(v.string()))
    ),
  })
    .index("by_workspaceId", ["workspaceId"])
    .index("by_projectName", ["projectName"])
    .index("by_Status", ["projectTaskStatus"]),
  tasks: defineTable({
    workspaceId: v.id("workspaces"),
    projectId: v.id("projects"),
    taskName: v.string(),
    assigneeId: v.id("users"),
    description: v.optional(v.string()),
    dueDate: v.string(),
    priority: v.optional(v.number()),
    // ? A task must always have a status
    status: v.string(),
    position: v.number(),
  })
    .index("by_workspaceId_by_projectId_by_status", [
      "workspaceId",
      "projectId",
      "status",
    ])
    .index("by_assigneeId", ["assigneeId"])
    .index("by_workspaceId", ["workspaceId"])
    .index("by_WorkspaceId_ProjectId", ["workspaceId", "projectId"])
    .index("by_WorkspaceId_assigneeId", ["workspaceId", "assigneeId"])
    .searchIndex("by_description_by_taskName", {
      searchField: "taskName",
      filterFields: ["workspaceId", "description", "status"],
    }),
});
export default schema;

// export type taskStatus = Infer<typeof taskStatusValidator>;

export const taskValidator = schema.tables.tasks.validator.fields;

// export const TaskKanbanData =

// export type TasksArguments = Infer<typeof schema.tables.tasks.validator>;
export type Tasks = Doc<"tasks">;
export type PaginatedTasksResponse = (typeof api.tasks.get._returnType)[number];
export type getTaskByIdResponse = typeof api.tasks.getById._returnType;
export type getProjectAnalytics =
  typeof api.projects.getProjectAnalytics._returnType;
