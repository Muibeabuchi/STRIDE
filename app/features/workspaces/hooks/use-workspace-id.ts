import { Id } from "convex/_generated/dataModel";
import { getRouteApi } from "@tanstack/react-router";

export function useWorkspaceId() {
  const routeApi = getRouteApi(
    "/(dashboard)/_dashboard/workspaces/$workspaceId"
  );
  const params = routeApi.useParams();
  return params.workspaceId as Id<"workspaces">;
}
