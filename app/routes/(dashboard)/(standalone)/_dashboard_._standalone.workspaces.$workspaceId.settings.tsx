import { UpdateWorkspaceForm } from "@/features/workspaces/components/update-workspace-form";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Id } from "convex/_generated/dataModel";
import useGetWorkSpaceById from "@/features/workspaces/api/use-get-workspace-by-id";

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
  params: {
    parse: (params) => {
      return {
        workspaceId: params.workspaceId as Id<"workspaces">,
      };
    },
  },
  component: RouteComponent,
});

function RouteComponent() {
  const { workspaceId } = Route.useParams();
  const { data: workspace } = useGetWorkSpaceById(workspaceId);
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
