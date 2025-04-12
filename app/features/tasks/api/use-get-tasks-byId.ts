import { api } from "convex/_generated/api";
import { Id } from "convex/_generated/dataModel";
import { convexQuery } from "@convex-dev/react-query";
import { useQuery } from "@tanstack/react-query";

export const useGetWorkspaceTasksById = ({
  taskId,
}: {
  taskId: Id<"tasks">;
}) => {
  return useQuery(convexQuery(api.tasks.getById, { taskId }));
};
