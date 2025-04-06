import { api } from "convex/_generated/api";
import { Id } from "convex/_generated/dataModel";
import { convexQuery } from "@convex-dev/react-query";
import { useSuspenseQuery } from "@tanstack/react-query";

export const useGetProjectById = ({
  projectId,
  workspaceId,
}: {
  projectId: Id<"projects">;
  workspaceId: Id<"workspaces">;
}) => {
  return useSuspenseQuery(
    convexQuery(api.projects.getById, { projectId, workspaceId })
  );
};
