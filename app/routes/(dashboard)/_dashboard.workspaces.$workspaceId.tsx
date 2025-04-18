import { Loader } from "@/components/Loader";
import MemberList from "@/features/members/components/member-list";
import ProjectList from "@/features/projects/components/project-list";
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
    // ? Why was i prefetching this data
    context.queryClient.prefetchQuery(
      convexQuery(api.members.get, { workspaceId: params.workspaceId })
    );
    context.queryClient.prefetchQuery(
      convexQuery(api.workspaces.getWorkspaceAnalytics, {
        workspaceId: params.workspaceId,
      })
    );
    context.queryClient.prefetchQuery(
      convexQuery(api.workspaces.getUserWorkspaces, {
        workspaceId: params.workspaceId,
      })
    );
    context.queryClient.prefetchQuery(
      convexQuery(api.projects.get, {
        workspaceId: params.workspaceId,
      })
    );

    // await context.queryClient.prefetchQuery(
    //   convexQuery(api.tasks.get, {
    //     workspaceId: params.workspaceId,
    //     projectId: undefined,
    //   })
    // );
  },
});

function RouteComponent() {
  const { workspaceId } = Route.useParams();

  return (
    <div className="h-full space-y-4 flex flex-col ">
      <Suspense fallback={<p>Loading the workspace analytics</p>}>
        <WorkspaceAnalytics workspaceId={workspaceId} />
      </Suspense>
      {/*  */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {/* <Suspense fallback={<p>Loading TaskList ....</p>}> */}
        <TaskList workspaceId={workspaceId} />
        {/* </Suspense> */}
        <Suspense fallback={<p>Loading ProjectList ....</p>}>
          <ProjectList workspaceId={workspaceId} />
        </Suspense>
        <Suspense fallback={<p>Loading MemberList ....</p>}>
          <MemberList workspaceId={workspaceId} />
        </Suspense>
      </div>
    </div>
  );
}
