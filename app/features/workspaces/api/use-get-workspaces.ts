import { convexQuery } from "@convex-dev/react-query";
import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { api } from "convex/_generated/api";

export const useGetUserWorkspaces = (isAuthenticated?: boolean) => {
  return useQuery({
    ...convexQuery(api.workspaces.getUserWorkspaces, {}),
    // throwOnError: true,
    enabled: isAuthenticated,
  });
};
