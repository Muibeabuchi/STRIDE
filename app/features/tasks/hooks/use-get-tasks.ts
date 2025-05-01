import { api } from "convex/_generated/api";
import { Id } from "convex/_generated/dataModel";
import { StatusSchemaType } from "../schema";
import { useQuery } from "convex/react";

export function useGetTasks({
  workspaceId,
  status = undefined,
  assigneeId,
  projectId,
  dueDate,
}: {
  workspaceId: Id<"workspaces">;
  status?: StatusSchemaType;
  assigneeId?: Id<"users">;
  projectId?: Id<"projects">;
  dueDate?: string;
}) {
  const tasks = useQuery(api.tasks.get, {
    workspaceId,
    status: status === "ALL" ? undefined : status,
    assigneeId: assigneeId,
    projectId: projectId,
    dueDate,
  });

  return {
    tasks,
  };
}
