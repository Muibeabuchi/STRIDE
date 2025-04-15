import { Button } from "@/components/ui/button";
import { useGetProjectById } from "@/features/projects/api/use-get-projects-by-id";
import { ProjectAvatar } from "@/features/projects/components/project-avatar";
import {
  tabSchema,
  TaskViewSwitcher,
} from "@/features/tasks/components/task-view-switcher";
import { convexQuery } from "@convex-dev/react-query";
import { Outlet } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { createFileRoute } from "@tanstack/react-router";
import { api } from "convex/_generated/api";
import { Id } from "convex/_generated/dataModel";
import { PencilIcon } from "lucide-react";
import { z } from "zod";
import { zodValidator } from "@tanstack/zod-adapter";
import {
  StatusSchemaType,
  taskViewSearchSchema,
} from "../../features/tasks/schema";

export const Route = createFileRoute(
  "/(dashboard)/_dashboard/workspaces_/$workspaceId/projects/$projectId"
)({
  validateSearch: zodValidator(taskViewSearchSchema),
  params: {
    parse: (params) => {
      return {
        projectId: params.projectId as Id<"projects">,
        workspaceId: params.workspaceId as Id<"workspaces">,
      };
    },
  },

  loaderDeps: ({ search }) => ({
    ...search,
  }),

  component: RouteComponent,
  loader: async (ctx) => {
    const {
      params,
      deps: { status, assigneeId, dueDate, projectId },
    } = ctx;

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
  const { projectId: projId, workspaceId } = Route.useParams();
  const { status, taskView, assigneeId, dueDate, projectId } =
    Route.useSearch();
  const navigate = Route.useNavigate();
  const { data: project } = useGetProjectById({
    projectId: projId,
    workspaceId,
  });

  const handleTaskViewChange = (tab: string) => {
    navigate({
      to: ".",
      search: {
        taskView: tabSchema.parse(tab),
        // projectId,
      },
    });
  };

  const onStatusChange = (value: StatusSchemaType) => {
    navigate({
      to: ".",
      search: (search) => ({
        ...search,
        status: value,
      }),
    });
  };

  const onAssigneeIdChange = (value: string | undefined) => {
    navigate({
      to: ".",
      search: (search) => ({
        ...search,
        assigneeId: value === "All" ? undefined : value,
      }),
    });
  };

  const onProjectIdChange = (value: string | undefined) => {
    navigate({
      to: ".",
      search: (search) => ({
        ...search,
        projectId: value === "All" ? undefined : value,
      }),
    });
  };

  const onDueDateChange = (value: string | undefined) => {
    navigate({
      to: ".",
      search: (search) => ({
        ...search,
        dueDate: value,
      }),
    });
  };

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
                projectId: projId,
                workspaceId,
              }}
            >
              <PencilIcon className="size-4 mr-2" />
              Edit Project
            </Link>
          </Button>
        </div>
      </div>
      <TaskViewSwitcher
        projectId={projectId}
        workspaceId={workspaceId}
        hideProjectFilter={true}
        status={status}
        assigneeId={assigneeId}
        dueDate={dueDate}
        taskView={taskView}
        onAssigneeIdChange={onAssigneeIdChange}
        onDueDateChange={onDueDateChange}
        onProjectIdChange={onProjectIdChange}
        onStatusChange={onStatusChange}
        handleTaskViewChange={handleTaskViewChange}
      />
      <Outlet />
    </div>
  );
}
