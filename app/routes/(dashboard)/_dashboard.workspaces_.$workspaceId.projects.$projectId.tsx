import { Button } from "@/components/ui/button";
import { useGetProjectById } from "@/features/projects/api/use-get-projects-by-id";
import { ProjectAvatar } from "@/features/projects/components/project-avatar";
import { TaskViewSwitcher } from "@/features/tasks/components/task-view-switcher";
import { convexQuery } from "@convex-dev/react-query";
import { Outlet } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { createFileRoute } from "@tanstack/react-router";
import { api } from "convex/_generated/api";
import { Id } from "convex/_generated/dataModel";
import { PencilIcon } from "lucide-react";

export const Route = createFileRoute(
  "/(dashboard)/_dashboard/workspaces_/$workspaceId/projects/$projectId"
)({
  params: {
    parse: (params) => {
      return {
        projectId: params.projectId as Id<"projects">,
        workspaceId: params.workspaceId as Id<"workspaces">,
      };
    },
  },
  component: RouteComponent,
  loader: async (ctx) => {
    const { params } = ctx;

    // prefetch other data that might be needed in this route-----------------
    ctx.context.queryClient.prefetchQuery(
      convexQuery(api.members.get, { workspaceId: params.workspaceId })
    );

    await ctx.context.queryClient.ensureQueryData(
      convexQuery(api.projects.getById, {
        projectId: params.projectId,
        workspaceId: params.workspaceId,
      })
    );
  },
});

function RouteComponent() {
  const { projectId, workspaceId } = Route.useParams();
  const { data: project } = useGetProjectById({
    projectId,
    workspaceId,
  });

  return (
    <div className="flex flex-col gap-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-x-2">
          <ProjectAvatar
            name={project.projectName}
            image={project.projectImage}
            className="size-8"
          />
          <p className="text-lg font-semibold">{project.projectName}</p>
        </div>
        <div className="">
          <Button size="sm" asChild variant={"secondary"}>
            <Link
              to={"/workspaces/$workspaceId/projects/$projectId/settings"}
              params={{
                projectId,
                workspaceId,
              }}
            >
              <PencilIcon className="size-4 mr-2" />
              Edit Project
            </Link>
          </Button>
        </div>
      </div>
      <TaskViewSwitcher />
      <Outlet />
    </div>
  );
}
