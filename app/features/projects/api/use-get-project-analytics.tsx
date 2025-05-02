import { api } from "convex/_generated/api";
import { Id } from "convex/_generated/dataModel";
import { convexQuery } from "@convex-dev/react-query";
import { useQuery } from "@tanstack/react-query";

interface useGetProjectAnalyticsProps {
  workspaceId: Id<"workspaces">;
  projectId: Id<"projects">;
}

export const useGetProjectAnalytics = ({
  workspaceId,
  projectId,
}: useGetProjectAnalyticsProps) => {
  return useQuery({
    ...convexQuery(api.projects.getProjectAnalytics, {
      workspaceId,
      projectId,
    }),
    throwOnError: true,
  });
};
