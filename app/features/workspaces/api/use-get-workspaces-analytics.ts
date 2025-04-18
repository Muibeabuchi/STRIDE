import { convexQuery } from "@convex-dev/react-query";
import { useSuspenseQuery } from "@tanstack/react-query";
import { api } from "convex/_generated/api";
import { Id } from "convex/_generated/dataModel";

export const useGetWorkspaceAnalytics = (workspaceId: Id<"workspaces">) => {
  return useSuspenseQuery(
    convexQuery(api.workspaces.getWorkspaceAnalytics, { workspaceId })
  );
};
