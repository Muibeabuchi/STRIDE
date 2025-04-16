import useGetWorkSpaceName from "@/features/workspaces/api/use-get-workspacename";
import { JoinWorkspaceForm } from "@/features/workspaces/components/join-workspace-form";
import { convexQuery } from "@convex-dev/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { api } from "convex/_generated/api";
import { Id } from "convex/_generated/dataModel";

export const Route = createFileRoute(
  "/(dashboard)/(standalone)/_dashboard_/_standalone/workspaces/$workspaceId/join/$joinCode"
)({
  component: RouteComponent,
  params: {
    parse: (params) => ({
      joinCode: params.joinCode,
      workspaceId: params.workspaceId as Id<"workspaces">,
    }),
  },
  loader: async ({ context, params: { workspaceId } }) => {
    await context.queryClient.ensureQueryData(
      convexQuery(api.workspaces.getWorkspaceName, {
        workspaceId,
      })
    );
  },
});

function RouteComponent() {
  const { joinCode, workspaceId } = Route.useParams();
  const { data: workspaceName } = useGetWorkSpaceName(workspaceId);
  return (
    <div className="w-full lg:max-w-xl">
      <JoinWorkspaceForm
        workspaceJoinCode={joinCode}
        workspaceId={workspaceId}
        workspaceName={workspaceName}
      />
    </div>
  );
}
