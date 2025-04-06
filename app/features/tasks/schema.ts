import { z } from "zod";

enum TaskStatus {
  BACKLOG = "BACKLOG",
  TODO = "TODO",
  IN_PROGRESS = "IN_PROGRESS",
  IN_REVIEW = "IN_REVIEW",
  DONE = "DONE",
}

export const createTaskSchema = z.object({
  taskName: z.string().trim().min(1, "required"),
  status: z.nativeEnum(TaskStatus, { required_error: "Required" }),
  workspaceId: z.string().trim().min(1, "required"),
  projectId: z.string().trim().min(1, "required"),
  dueDate: z.coerce.date(),
  assigneeId: z.string().trim().min(1, "required"),
  description: z.string().optional(),
});
