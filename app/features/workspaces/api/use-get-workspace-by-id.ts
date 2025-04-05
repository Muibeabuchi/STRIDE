import { convexQuery } from "@convex-dev/react-query";
import { useSuspenseQuery } from "@tanstack/react-query";
import { api } from "convex/_generated/api";
import { Id } from "convex/_generated/dataModel";

const useGetWorkSpaceById = (workspaceId: Id<"workspaces">) => {
  return useSuspenseQuery(
    convexQuery(api.workspaces.getWorkspaceById, {
      workspaceId: workspaceId as Id<"workspaces">,
    })
  );
};

export default useGetWorkSpaceById;
