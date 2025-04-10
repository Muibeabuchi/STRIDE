import { api } from "convex/_generated/api";
import { Id } from "convex/_generated/dataModel";
import { usePaginatedQuery } from "convex/react";
import { StatusSchemaType } from "../schema";

export function useGetTasksPaginated({
  workspaceId,
  status,
  assigneeId,
  projectId,
  dueDate,
}: {
  workspaceId: Id<"workspaces">;
  status: StatusSchemaType;
  assigneeId: string | undefined;
  projectId: string | undefined;
  dueDate: string | undefined;
}) {
  return usePaginatedQuery(
    api.tasks.get,
    {
      workspaceId,
      status: status === "ALL" ? undefined : status,
      assigneeId: assigneeId as Id<"users"> | undefined,
      projectId: projectId as Id<"projects"> | undefined,
      dueDate,
    },
    {
      initialNumItems: 5,
    }
  );
}
