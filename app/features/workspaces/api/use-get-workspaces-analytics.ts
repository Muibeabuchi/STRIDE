import { convexQuery } from "@convex-dev/react-query";
import { useQuery } from "@tanstack/react-query";
import { api } from "convex/_generated/api";
import { Id } from "convex/_generated/dataModel";

export const useGetWorkspaceAnalytics = (workspaceId: Id<"workspaces">) => {
  return useQuery({
    ...convexQuery(api.workspaces.getWorkspaceAnalytics, { workspaceId }),
    throwOnError: true,
  });
};
