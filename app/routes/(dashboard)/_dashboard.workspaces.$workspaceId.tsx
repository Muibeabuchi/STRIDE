import { Loader } from "@/components/Loader";
import MemberList from "@/features/members/components/member-list";
import PeopleListSkeleton from "@/features/members/components/member-list-skeleton";
import ProjectList from "@/features/projects/components/project-list";
import ProjectListSkeleton from "@/features/projects/components/project-list-component";
import { useCreateTask } from "@/features/tasks/api/use-create-task";
import { useGetHomePageTasks } from "@/features/tasks/api/use-get-tasks";
import TaskList from "@/features/tasks/components/task-list";
import { useGetTasks } from "@/features/tasks/hooks/use-get-tasks";
import { MembersList } from "@/features/workspaces/components/members-list";
import WorkspaceAnalytics from "@/features/workspaces/components/workspace-analytics";
import { useTaskModalStore } from "@/store/store";
import { convexQuery } from "@convex-dev/react-query";
import { createFileRoute, Outlet } from "@tanstack/react-router";
import { api } from "convex/_generated/api";
import { Id } from "convex/_generated/dataModel";
import { Suspense } from "react";
import { useWorkspaceExists } from "..";

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
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <TaskList workspaceId={workspaceId} />
        <ProjectList workspaceId={workspaceId} />
        <MemberList workspaceId={workspaceId} />
      </div>
    </div>
  );
}
