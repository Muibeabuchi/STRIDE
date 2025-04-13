import { convexQuery } from "@convex-dev/react-query";
import { api } from "convex/_generated/api";
import { Id } from "convex/_generated/dataModel";
// import { usePaginatedQuery } from "convex/react";
import { StatusSchemaType } from "../schema";
import { useSuspenseQuery } from "@tanstack/react-query";

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
  return useSuspenseQuery(
    convexQuery(api.tasks.get, {
      workspaceId,
      status: status === "ALL" ? undefined : status,
      assigneeId: assigneeId as Id<"users"> | undefined,
      projectId: projectId as Id<"projects"> | undefined,
      dueDate,
    })
  );
}
