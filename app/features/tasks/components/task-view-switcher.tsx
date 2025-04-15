import { DottedSeparator } from "@/components/doted-separator";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TabsContent } from "@radix-ui/react-tabs";
import { PlusIcon } from "lucide-react";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { useGetTasks } from "../hooks/use-get-tasks";
import { useTaskModalStore } from "@/store/store";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { z } from "zod";
import DataFilter from "./data-filter";
import useTaskFilters from "../hooks/use-task-filters";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import DataKanban from "./data-kanban";
import { Id } from "convex/_generated/dataModel";
import DataCalendar from "./data-calendar";
import { StatusSchemaType, taskViewSearchType } from "../schema";
import { useProjectId } from "@/features/projects/hooks/use-project-id";

export const tabSchema = z.union([
  z.literal("table"),
  z.literal("calendar"),
  z.literal("kanban"),
]);

interface TaskViewSwitcherProps {
  workspaceId: Id<"workspaces">;
  projectId: string | undefined;
  hideProjectFilter: boolean;
  taskView: taskViewSearchType;
  status: StatusSchemaType;
  assigneeId: string | undefined;
  dueDate: string | undefined;
  onDueDateChange: (value: string | undefined) => void;
  onProjectIdChange: (value: string | undefined) => void;
  onAssigneeIdChange: (value: string | undefined) => void;
  onStatusChange: (value: StatusSchemaType) => void;
  handleTaskViewChange: (tab: string) => void;
}

export const TaskViewSwitcher = ({
  projectId,
  handleTaskViewChange,
  workspaceId,
  hideProjectFilter = true,
  assigneeId,
  dueDate,
  status,
  taskView,
  onAssigneeIdChange,
  onDueDateChange,
  onProjectIdChange,
  onStatusChange,
}: TaskViewSwitcherProps) => {
  const { tasks, taskIsError, taskIsPending } = useGetTasks({
    workspaceId,
    status,
    assigneeId: assigneeId as Id<"users">,
    projectId: projectId as Id<"projects">,
    dueDate,
  });

  const { open } = useTaskModalStore();

  if (taskIsPending || tasks === undefined) {
    return <p>Loading...</p>;
  }

  if (taskIsError || tasks === null) {
    return <p>Task Errored out</p>;
  }
  return (
    <Tabs
      className="flex-1 w-full border rounded-lg"
      defaultValue={taskView}
      value={taskView}
      onValueChange={handleTaskViewChange}
    >
      <div className="h-full flex flex-col overflow-auto p-4">
        <div className="flex flex-col lg:flex-row gap-y-2 justify-between items-center">
          <TabsList className="w-full lg:w-auto ">
            <TabsTrigger className="h-8 w-full lg:w-auto" value="table">
              Table
            </TabsTrigger>
            <TabsTrigger className="h-8 w-full lg:w-auto" value="kanban">
              Kanban
            </TabsTrigger>
            <TabsTrigger className="h-8 w-full lg:w-auto" value="calendar">
              Calendar
            </TabsTrigger>
          </TabsList>
          <Button
            size="sm"
            className="w-full lg:w-auto"
            onClick={() => open("ALL")}
          >
            <PlusIcon className="size-4 mr-2" />
            New
          </Button>
        </div>
        <DottedSeparator className="my-4" />
        {taskView !== "kanban" && (
          <>
            <DataFilter
              hideProjectFilter={hideProjectFilter}
              assigneeId={assigneeId}
              dueDate={dueDate}
              onAssigneeIdChange={onAssigneeIdChange}
              onDueDateChange={onDueDateChange}
              onProjectIdChange={onProjectIdChange}
              onStatusChange={onStatusChange}
              projectId={projectId}
              status={status}
            />
            <DottedSeparator className="my-4" />
          </>
        )}
        <>
          <TabsContent value="table" className="mt-0">
            <DataTable columns={columns} data={tasks} />
          </TabsContent>
          <TabsContent value="kanban" className="mt-0">
            <DataKanban data={tasks} />
          </TabsContent>
          <TabsContent value="calendar" className="mt-0">
            <DataCalendar data={tasks} />
          </TabsContent>
        </>
      </div>
    </Tabs>
  );
};
