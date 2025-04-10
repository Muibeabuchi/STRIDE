import { z } from "zod";

export enum TaskStatus {
  BACKLOG = "BACKLOG",
  TODO = "TODO",
  IN_PROGRESS = "IN_PROGRESS",
  IN_REVIEW = "IN_REVIEW",
  DONE = "DONE",
}

export const createTaskSchema = z.object({
  taskName: z.string().trim().min(1, "required"),
  status: z.nativeEnum(TaskStatus, { required_error: "Required" }),
  // workspaceId: z.string().trim().min(1, "required"),
  projectId: z.string().trim().min(1, "required"),
  dueDate: z.coerce.date(),
  assigneeId: z.string().trim().min(1, "required"),
  description: z.string().optional(),
});

export const StatusSchema = z.union([
  z.literal("TODO"),
  z.literal("DONE"),
  z.literal("BACKLOG"),
  z.literal("ALL"),
  z.literal("IN_REVIEW"),
  z.literal("IN_PROGRESS"),
]);

export const taskViewSearchSchema = z.object({
  taskView: z
    .union([z.literal("kanban"), z.literal("table"), z.literal("calendar")])
    .catch("table"),
  status: StatusSchema.catch("ALL"),
});

export type taskViewSearchType = z.infer<typeof taskViewSearchSchema>;
export type StatusSchemaType = z.infer<typeof StatusSchema>;
