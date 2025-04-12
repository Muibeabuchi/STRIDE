import { api } from "convex/_generated/api";
import { Id } from "convex/_generated/dataModel";
import { convexQuery } from "@convex-dev/react-query";
import { useSuspenseQuery } from "@tanstack/react-query";
import { usePaginatedQuery } from "convex/react";

// export const useGetWorkspaceTasks = (workspaceId: Id<"workspaces">) => {
//   return useSuspenseQuery(convexQuery(api.tasks.get, { workspaceId }));
// };

export const useGetWorkspaceTasks = ({
  initialNumItems,
  workspaceId,
}: {
  workspaceId: Id<"workspaces">;
  initialNumItems: number;
}) => {
  return usePaginatedQuery(
    api.tasks.get,
    {
      workspaceId,
    },
    {
      initialNumItems,
    }
  );
};
