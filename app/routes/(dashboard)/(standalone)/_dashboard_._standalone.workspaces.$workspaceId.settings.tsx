import { UpdateWorkspaceForm } from "@/features/workspaces/components/update-workspace-form";
import { convexQuery } from "@convex-dev/react-query";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { api } from "convex/_generated/api";
import { Id } from "convex/_generated/dataModel";

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
  loader: async ({ context, params }) => {
    await context.queryClient.ensureQueryData(
      convexQuery(api.workspaces.getWorkspaceById, {
        workspaceId: params.workspaceId as Id<"workspaces">,
      })
    );
  },
});

function RouteComponent() {
  const { workspaceId } = Route.useParams();

  const { data: workspace } = useSuspenseQuery(
    convexQuery(api.workspaces.getWorkspaceById, {
      workspaceId: workspaceId as Id<"workspaces">,
    })
  );
  return (
    <div className="w-full lg:max-w-xl">
      <UpdateWorkspaceForm
        workspaceId={workspaceId as Id<"workspaces">}
        initialValues={{
          ...workspace,
          workspaceImage: workspace.workspaceAvatar,
        }}
      />
    </div>
  );
}
