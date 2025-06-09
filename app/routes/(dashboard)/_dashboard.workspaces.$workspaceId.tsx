import MemberList from "@/features/members/components/member-list";
import ProjectList from "@/features/projects/components/project-list";
import TaskList from "@/features/tasks/components/task-list";
import WorkspaceAnalytics from "@/features/workspaces/components/workspace-analytics";
import { useWorkspaceExists } from "@/features/workspaces/hooks/use-workspace-exists";
import { createFileRoute } from "@tanstack/react-router";
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
  const { workspaceId } = Route.useParams();

  useWorkspaceExists(workspaceId);

  return (
    <div className="max-h-screen overflow-y-auto mt-12 space-y-4 flex flex-col ">
      <WorkspaceAnalytics workspaceId={workspaceId} />
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <ProjectList workspaceId={workspaceId} />
        <MemberList workspaceId={workspaceId} />
        <div className="flex gap-y-3 flex-col">
          <TaskList workspaceId={workspaceId} />
        </div>
      </div>
    </div>
  );
}
