import { defineSchema, defineTable } from "convex/server";
import { type Infer, v } from "convex/values";
import { Doc } from "./_generated/dataModel";
import { api } from "./_generated/api";

export const taskStatusValidator = v.union(
  v.literal("BACKLOG"),
  v.literal("TODO"),
  v.literal("IN_PROGRESS"),
  v.literal("DONE"),
  v.literal("IN_REVIEW")
);

const schema = defineSchema({
  users: defineTable({
    // Clerk user Id
    id: v.string(),
    // Username from the clerk Object
    name: v.string(),
    email: v.string(),
    profilePicture: v.optional(v.string()),
  }).index("id", ["id"]),
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
  })
    .index("by_workspaceId", ["workspaceId"])
    .index("by_projectName", ["projectName"]),
  tasks: defineTable({
    workspaceId: v.id("workspaces"),
    projectId: v.id("projects"),
    taskName: v.string(),
    assigneeId: v.id("users"),
    description: v.optional(v.string()),
    dueDate: v.string(),
    status: taskStatusValidator,
    position: v.number(),
    // min position = 1000,max position = 1000000
  })
    .index("by_workspaceId_by_status", ["workspaceId", "status"])
    .index("by_assigneeId", ["assigneeId"])
    .index("by_workspaceId", ["workspaceId"])
    .index("by_WorkspaceId_ProjectId", ["workspaceId", "projectId"])
    .searchIndex("by_description_by_taskName", {
      searchField: "taskName",
      filterFields: ["workspaceId", "description", "status"],
    }),
});
export default schema;

export type taskStatus = Infer<typeof taskStatusValidator>;

export const taskValidator = schema.tables.tasks.validator.fields;

// export type TasksArguments = Infer<typeof schema.tables.tasks.validator>;
export type Tasks = Doc<"tasks">;
export type PaginatedTasksResponse =
  (typeof api.tasks.get._returnType)["page"][number];
export type getTaskByIdResponse = typeof api.tasks.getById._returnType;

// const board = schema.tables.boards.validator;
// const board = schema.tables.boards.validator;
// const column = schema.tables.columns.validator;
// const item = schema.tables.items.validator;

// export const updateBoardSchema = v.object({
//   id: board.fields.id,
//   name: v.optional(board.fields.name),
//   color: v.optional(v.string()),
// });

// export const updateColumnSchema = v.object({
//   id: column.fields.id,
//   boardId: column.fields.boardId,
//   name: v.optional(column.fields.name),
//   order: v.optional(column.fields.order),
// });

// export const deleteItemSchema = v.object({
//   id: item.fields.id,
//   boardId: item.fields.boardId,
// });
// const { order, id, ...rest } = column.fields;
// export const newColumnsSchema = v.object(rest);
// export const deleteColumnSchema = v.object({
//   boardId: column.fields.boardId,
//   id: column.fields.id,
// });

// export type Board = Infer<typeof board>;
// export type Column = Infer<typeof column>;
// export type Item = Infer<typeof item>;

// import { Doc } from "@/convex/_generated/dataModel";
// import { defineSchema, defineTable } from "convex/server";
// import { authTables } from "@convex-dev/auth/server";
// import { Infer, v } from "convex/values";

// const schema = defineSchema({
//   ...authTables,

//   // Your other tables...
// });
