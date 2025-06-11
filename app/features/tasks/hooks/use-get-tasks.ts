import { api } from "convex/_generated/api";
import { Id } from "convex/_generated/dataModel";
import { StatusSchemaType } from "../schema";
import { useQuery } from "convex/react";
import { PriorityTypes } from "convex/constants";
import { TaskPriorityType } from "convex/schema";

export function useGetTasks({
  workspaceId,
  status = undefined,
  assigneeId,
  projectId,
  priority,
  dueDate,
}: {
  workspaceId: Id<"workspaces">;
  status?: StatusSchemaType;
  assigneeId?: Id<"users">;
  projectId?: Id<"projects">;
  dueDate?: string;
  priority: TaskPriorityType | undefined;
}) {
  const tasks = useQuery(api.tasks.get, {
    workspaceId,
    status: status === "ALL" ? undefined : status,
    assigneeId: assigneeId,
    projectId: projectId,
    dueDate,
    priority,
  });

  return {
    tasks,
  };
}
