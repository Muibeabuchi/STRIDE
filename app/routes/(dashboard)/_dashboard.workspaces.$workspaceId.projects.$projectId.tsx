import { DefaultCatchBoundary } from "@/components/DefaultCatchBoundary";
import { NotFound } from "@/components/NotFound";
import { createFileRoute } from "@tanstack/react-router";
import { Loader } from "lucide-react";

export const Route = createFileRoute(
  "/(dashboard)/_dashboard/workspaces/$workspaceId/projects/$projectId"
)({
  component: RouteComponent,
  errorComponent: DefaultCatchBoundary,
  notFoundComponent: () => <NotFound />,
  pendingComponent: () => {
    return (
      <div className="flex h-full justify-center items-center">
        <Loader className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  },
});

function RouteComponent() {
  const { projectId, workspaceId } = Route.useParams();
  return (
    <div>
      Hello "/_dashboard/workspaces/$workspaceId/projects/$projectId"!
      <p>ProjectId {projectId}</p>
      <p>WorkspaceId {workspaceId}</p>
    </div>
  );
}