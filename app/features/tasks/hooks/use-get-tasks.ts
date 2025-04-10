import { api } from "convex/_generated/api";
import { Id } from "convex/_generated/dataModel";
import { usePaginatedQuery } from "convex/react";
import { StatusSchemaType } from "../schema";

export function useGetTasksPaginated({
  workspaceId,
  status,
}: {
  workspaceId: Id<"workspaces">;
  status: StatusSchemaType;
}) {
  return usePaginatedQuery(
    api.tasks.get,
    { workspaceId, status: status === "ALL" ? undefined : status },
    {
      initialNumItems: 5,
    }
  );
}
