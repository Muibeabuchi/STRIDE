import { api } from "convex/_generated/api";
import { Id } from "convex/_generated/dataModel";
import { usePaginatedQuery } from "convex/react";

export function useGetTasksPaginated(workspaceId: Id<"workspaces">) {
  return usePaginatedQuery(
    api.tasks.get,
    { workspaceId },
    {
      initialNumItems: 2,
    }
  );
}
