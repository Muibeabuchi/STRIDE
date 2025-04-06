import { createFileRoute, Outlet } from "@tanstack/react-router";
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
});

function RouteComponent() {
  return (
    <div>
      Hello "/_dashboard/workspaces/$workspaceId"!
      <Outlet />
    </div>
  );
}
