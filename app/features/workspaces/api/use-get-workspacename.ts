import { convexQuery } from "@convex-dev/react-query";
import { useSuspenseQuery } from "@tanstack/react-query";
import { api } from "convex/_generated/api";
import { Id } from "convex/_generated/dataModel";

const useGetWorkSpaceName = (workspaceId: Id<"workspaces">) => {
  return useSuspenseQuery(
    convexQuery(api.workspaces.getWorkspaceName, {
      workspaceId: workspaceId as Id<"workspaces">,
    })
  );
};

export default useGetWorkSpaceName;
