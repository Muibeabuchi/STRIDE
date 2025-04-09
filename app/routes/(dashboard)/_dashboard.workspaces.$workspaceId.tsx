import { convexQuery } from "@convex-dev/react-query";
import { createFileRoute, Outlet } from "@tanstack/react-router";
import { api } from "convex/_generated/api";
import { Id } from "convex/_generated/dataModel";

export const Route = createFileRoute(
  "/(dashboard)/_dashboard/workspaces/$workspaceId"
)({
  component: RouteComponent,
  params: {
    parse: (params) => {
      return {
        workspaceId: params.workspaceId as Id<"workspaces">,
      };
    },
  },
  loader: async ({ context, params }) => {
    //  // Prefetch data for members
    context.queryClient.prefetchQuery(
      convexQuery(api.members.get, { workspaceId: params.workspaceId })
    );
  },
});

function RouteComponent() {
  return (
    <div>
      Hello "/_dashboard/workspaces/$workspaceId"!
      <Outlet />
    </div>
  );
}
