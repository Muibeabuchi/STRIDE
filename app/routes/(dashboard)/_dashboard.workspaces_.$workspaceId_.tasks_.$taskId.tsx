import { DottedSeparator } from "@/components/doted-separator";
import TaskBreadCrumbs from "@/features/tasks/components/task-breadcrumbs";
import TaskDescription from "@/features/tasks/components/task-description";
import TaskOverview from "@/features/tasks/components/task-overview";
import { convexQuery } from "@convex-dev/react-query";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { api } from "convex/_generated/api";
import { Id } from "convex/_generated/dataModel";
import { AlertTriangle } from "lucide-react";

export const Route = createFileRoute(
  "/(dashboard)/_dashboard/workspaces_/$workspaceId_/tasks_/$taskId"
)({
  component: RouteComponent,
  errorComponent: () => {
    return (
      <div className="flex flex-col items-center h-full justify-center">
        <AlertTriangle className="size-6 text-muted-foreground mb-2" />
        <p className="text-sm font-medium  text-muted-foreground">
          Something went wrong
        </p>
      </div>
    );
  },
  params: {
    parse: (params) => ({
      taskId: params.taskId as Id<"tasks">,
      workspaceId: params.workspaceId as Id<"workspaces">,
    }),
  },
  pendingComponent: () => <p>Loading the taskId route</p>,
});

function RouteComponent() {
  const { taskId } = Route.useParams();

  const { data: task } = useSuspenseQuery(
    convexQuery(api.tasks.getById, {
      taskId,
    })
  );

  return (
    <div className="flex flex-col ">
      <TaskBreadCrumbs task={task} project={task.project} />
      <DottedSeparator className="my-6" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <TaskOverview task={task} />
        <TaskDescription task={task} />
      </div>
    </div>
  );
}
