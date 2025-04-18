import {
  tabSchema,
  TaskViewSwitcher,
} from "@/features/tasks/components/task-view-switcher";
import {
  StatusSchemaType,
  taskViewSearchSchema,
} from "@/features/tasks/schema";
import { createFileRoute } from "@tanstack/react-router";
import { zodValidator } from "@tanstack/zod-adapter";
import { api } from "convex/_generated/api";
import { Id } from "convex/_generated/dataModel";

export const Route = createFileRoute(
  "/(dashboard)/_dashboard/workspaces_/$workspaceId/tasks"
)({
  component: TasksPage,
  pendingComponent: () => <div>Loading...</div>,
  errorComponent: () => <div>Error</div>,
  params: {
    parse: (params) => {
      return {
        workspaceId: params.workspaceId as Id<"workspaces">,
      };
    },
  },
  validateSearch: zodValidator(taskViewSearchSchema),
  loaderDeps: ({ search }) => ({
    ...search,
  }),
  // loader: async ({ params, deps, context }) => {
  //   // const { status, assigneeId, dueDate, projectId } = deps;
  //   // await context.convexClient.query(api.tasks.get, {
  //   //   workspaceId: params.workspaceId,
  //   //   status: status === "ALL" ? undefined : status,
  //   //   assigneeId: assigneeId as Id<"users">,
  //   //   dueDate,
  //   //   projectId: projectId as Id<"projects">,
  //   // });
  // },
});

function TasksPage() {
  const { workspaceId } = Route.useParams();
  const { status, taskView, assigneeId, dueDate, projectId } =
    Route.useSearch();
  const navigate = Route.useNavigate();

  const handleTaskViewChange = (tab: string) => {
    navigate({
      to: ".",
      search: {
        taskView: tabSchema.parse(tab),
        projectId,
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
    <div className="flex h-full flex-col">
      <TaskViewSwitcher
        projectId={projectId}
        hideProjectFilter={false}
        status={status}
        assigneeId={assigneeId}
        dueDate={dueDate}
        taskView={taskView}
        workspaceId={workspaceId}
        handleTaskViewChange={handleTaskViewChange}
        onAssigneeIdChange={onAssigneeIdChange}
        onDueDateChange={onDueDateChange}
        onProjectIdChange={onProjectIdChange}
        onStatusChange={onStatusChange}
      />
    </div>
  );
}
