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
import DataFilter, { DataFilterSkeleton } from "./data-filter";
import useTaskFilters from "../hooks/use-task-filters";
import { DataTable, DataTableSkeleton } from "./data-table";
import { columns } from "./columns";
import DataKanban from "./data-kanban";
import { Id } from "convex/_generated/dataModel";
import DataCalendar from "./data-calendar";
import { StatusSchemaType, taskViewSearchType } from "../schema";
import { useProjectId } from "@/features/projects/hooks/use-project-id";
import { Skeleton } from "@/components/ui/skeleton";
import { useStableTasks } from "../hooks/use-stable-get-task";
import useGetWorkSpaceName from "@/features/workspaces/api/use-get-workspacename";
import { useGetMember } from "@/features/members/api/use-get-member";
import { TaskPriorityType } from "convex/schema";

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
  priority: TaskPriorityType | undefined;
  onDueDateChange: (value: string | undefined) => void;
  onProjectIdChange: (value: string | undefined) => void;
  onAssigneeIdChange: (value: string | undefined) => void;
  onStatusChange: (value: StatusSchemaType) => void;
  handleTaskViewChange: (tab: string) => void;
  onPriorityChange: (priority: TaskPriorityType | undefined) => void;
}

export const TaskViewSwitcher = ({
  projectId,
  handleTaskViewChange,
  workspaceId,
  hideProjectFilter = true,
  assigneeId,
  priority,
  dueDate,
  status,
  taskView,
  onPriorityChange,
  onAssigneeIdChange,
  onDueDateChange,
  onProjectIdChange,
  onStatusChange,
}: TaskViewSwitcherProps) => {
  const tasks = useStableTasks({
    workspaceId,
    status,
    assigneeId: assigneeId as Id<"users">,
    projectId: projectId as Id<"projects">,
    dueDate,
    priority,
  });

  const {
    data: memberInfo,
    isLoading: loadingMemberInfo,
    isError,
  } = useGetMember(workspaceId);

  // memberRole.data?.role;

  const { open } = useTaskModalStore();

  if (tasks === undefined || memberInfo === undefined || loadingMemberInfo) {
    return <TaskViewSwitcherSkeleton />;
  }

  if (tasks === null || isError || memberInfo === null) {
    return <p>Error fetching Tasks</p>;
  }
  return (
    <div className="flex-1 w-full h-full  rounded-lg">
      <div className="  h-full  flex flex-col  ">
        {taskView !== "kanban" && (
          <>
            <DataFilter
              hideProjectFilter={hideProjectFilter}
              assigneeId={assigneeId}
              dueDate={dueDate}
              priority={priority}
              onPriorityChange={onPriorityChange}
              onAssigneeIdChange={onAssigneeIdChange}
              onDueDateChange={onDueDateChange}
              onProjectIdChange={onProjectIdChange}
              onStatusChange={onStatusChange}
              projectId={projectId}
              status={status}
            />
          </>
        )}
        <>
          <TabsContent value="table" className="mt-0  pb-6">
            <DataTable columns={columns} data={tasks} />
          </TabsContent>
          <TabsContent value="kanban" className="mt-0">
            <DataKanban data={tasks} memberRole={memberInfo.role} />
          </TabsContent>
          {/* <TabsContent value="calendar" className="mt-0">
            <DataCalendar data={tasks} />
          </TabsContent> */}
        </>
      </div>
    </div>
  );
};

export const TaskViewSwitcherSkeleton = () => {
  return (
    <Tabs className="flex-1 w-full border rounded-lg">
      <div className="h-full flex flex-col overflow-auto p-4">
        <div className="flex flex-col lg:flex-row gap-y-2  justify-between items-center">
          <div className="flex bg-transparent rounded-md justify-between p-1 w-full lg:w-auto gap-x-4">
            <Skeleton className="h-8 w-[65px]  lg:w-[65px] rounded-md" />
            <Skeleton className="h-8 w-[65px]  lg:w-[65px] rounded-md" />
            <Skeleton className="h-8 w-[65px] lg:w-[65px] rounded-md" />
          </div>

          {/* New button skeleton */}
          <Skeleton className="h-8 w-24" />
        </div>

        <DottedSeparator className="my-4" />

        {/* Data filter skeleton */}
        <DataFilterSkeleton />

        <DottedSeparator className="my-4" />

        {/* Tab content - using DataTableSkeleton as default */}

        {/* <TabsContent value="table" className="mt-0"> */}
        {/* <DataTableSkeleton columnCount={5} rowCount={5} /> */}
        {/* </TabsContent> */}
      </div>
    </Tabs>
  );
};
