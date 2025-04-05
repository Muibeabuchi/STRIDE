import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute(
  "/(dashboard)/(standalone)/_dashboard_/_standalone/workspaces/$workspaceId/settings"
)({
  notFoundComponent: () => {
    return (
      <div>
        <h2>Not Found</h2>
        <p>Could not find requested resource</p>
        <Link to="/">Return Home</Link>
      </div>
    );
  },
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      Hello "/_dashboard/_standalone_/workspaces/$workspaceId/settings"!
    </div>
  );
}
