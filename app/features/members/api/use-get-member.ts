import { api } from "convex/_generated/api";
import { convexQuery } from "@convex-dev/react-query";
import { useQuery } from "@tanstack/react-query";
import { Id } from "convex/_generated/dataModel";

export const useGetMember = (workspaceId: Id<"workspaces">) => {
  return useQuery({
    ...convexQuery(api.members.getMember, {
      workspaceId,
    }),
    throwOnError: true,
  });
};
