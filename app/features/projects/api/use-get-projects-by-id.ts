import { api } from "convex/_generated/api";
import { Id } from "convex/_generated/dataModel";
import { convexQuery } from "@convex-dev/react-query";
import { useQuery } from "@tanstack/react-query";

export const useGetProjectById = ({
  projectId,
  workspaceId,
}: {
  projectId: Id<"projects">;
  workspaceId: Id<"workspaces">;
}) => {
  return useQuery({
    ...convexQuery(api.projects.getById, { projectId, workspaceId }),
    throwOnError: true,
  });
};
