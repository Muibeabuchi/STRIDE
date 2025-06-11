import { TaskPriorityType } from "./../../../convex/schema";
import { z } from "zod";

// export enum TaskStatus {
//   BACKLOG = "BACKLOG",
//   TODO = "TODO",
//   IN_PROGRESS = "IN_PROGRESS",
//   IN_REVIEW = "IN_REVIEW",
//   DONE = "DONE",
// }

export const createTaskSchema = z.object({
  taskName: z.string().trim().min(1, "required"),
  status: z
    .string({
      required_error: "Select a Task Status",
    })
    .trim(),
  //  z.nativeEnum(TaskStatus, { required_error: "Required" }),
  projectId: z.string().trim().min(1, "required"),
  dueDate: z.coerce.date(),
  assigneeId: z.string().trim().min(1, "required"),
  description: z.string().optional(),
});

export const StatusSchema = z.union([z.literal("ALL"), z.string()]);

export const TaskPrioritySchema = z.union([
  z.literal(0),
  z.literal(1),
  z.literal(2),
  z.literal(3),
  z.literal(4),
]);

export const taskViewSearchSchema = z.object({
  taskView: z
    .union([z.literal("kanban"), z.literal("table"), z.literal("calendar")])
    .catch("table"),
  priority: TaskPrioritySchema.catch(1).optional(),
  status: StatusSchema.catch("ALL"),
  assigneeId: z.string().optional(),
  projectId: z.string().optional(),
  dueDate: z.string().optional(),
});

export type taskViewSearchType = z.infer<
  typeof taskViewSearchSchema
>["taskView"];
export type StatusSchemaType = z.infer<typeof StatusSchema>;
