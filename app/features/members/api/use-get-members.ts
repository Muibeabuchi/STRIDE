import { api } from "convex/_generated/api";
import { convexQuery } from "@convex-dev/react-query";
import { useQuery } from "@tanstack/react-query";
import { Id } from "convex/_generated/dataModel";

export const useGetUserWorkspaceIdMembers = (workspaceId: Id<"workspaces">) => {
  return useQuery({
    ...convexQuery(api.members.get, {
      workspaceId,
    }),
    throwOnError: true,
  });
};
