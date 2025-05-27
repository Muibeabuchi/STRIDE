import MemberList from "@/features/members/components/member-list";
import ProjectList from "@/features/projects/components/project-list";
import TaskList from "@/features/tasks/components/task-list";
import WorkspaceAnalytics from "@/features/workspaces/components/workspace-analytics";
import { createFileRoute } from "@tanstack/react-router";
import { Id } from "convex/_generated/dataModel";
import { useWorkspaceExists } from "..";
import TaskListSkeleton from "@/features/tasks/components/task-list-skeleton";
import AnalyticsCardsSkeleton from "@/features/workspaces/components/workspace-analytics-skeleton";
import ProjectListSkeleton from "@/features/projects/components/project-list-component";
import PeopleListSkeleton from "@/features/members/components/member-list-skeleton";

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
    <div className="h-full space-y-4 flex flex-col ">
      <WorkspaceAnalytics workspaceId={workspaceId} />
      {/* <AnalyticsCardsSkeleton /> */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <TaskList workspaceId={workspaceId} />
        {/* <TaskListSkeleton />
        <ProjectListSkeleton />
        <PeopleListSkeleton /> */}
        <ProjectList workspaceId={workspaceId} />
        <MemberList workspaceId={workspaceId} />
      </div>
    </div>
  );
}
