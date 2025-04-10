import { DottedSeparator } from "@/components/doted-separator";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TabsContent } from "@radix-ui/react-tabs";
import { PlusIcon } from "lucide-react";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { useGetTasksPaginated } from "../hooks/use-get-tasks";
import { useTaskModalStore } from "@/store/store";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { z } from "zod";
import DataFilter from "./data-filter";
import useTaskFilters from "../hooks/use-task-filters";
// import { taskViewSearchSchema } from "@/routes/(dashboard)/_dashboard";

const tabSchema = z.union([
  z.literal("table"),
  z.literal("calendar"),
  z.literal("kanban"),
]);

export const TaskViewSwitcher = () => {
  const workspaceId = useWorkspaceId();
  const { status } = useTaskFilters();
  const {
    results,
    isLoading,
    loadMore,
    status: queryStatus,
  } = useGetTasksPaginated({
    workspaceId,
    status,
  });

  const { open } = useTaskModalStore();

  // TODO: Move this hook into a custom hook that takes other routes that mounts the TaskViewSwitcher component,
  const { taskView } = useSearch({
    from: "/(dashboard)/_dashboard/workspaces_/$workspaceId/projects/$projectId",
  });

  console.log(taskView);

  const navigate = useNavigate();
  // const types = taskViewSearchSchema.infer
  return (
    <Tabs
      className="flex-1 w-full border rounded-lg"
      defaultValue={taskView}
      onValueChange={(tab) => {
        navigate({
          to: ".",
          search: {
            taskView: tabSchema.parse(tab),
          },
        });
      }}
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
          <Button size="sm" className="w-full lg:w-auto" onClick={open}>
            <PlusIcon className="size-4 mr-2" />
            New
          </Button>
        </div>
        <DottedSeparator className="my-4" />
        {/* add filters */}
        <DataFilter workspaceId={workspaceId} />
        <DottedSeparator className="my-4" />
        <>
          <TabsContent value="table" className="mt-0">
            {isLoading && <p>Loading...</p>}
            {queryStatus === "LoadingFirstPage" ? (
              <p>Loading first page</p>
            ) : (
              <pre>{JSON.stringify(results, null, 2)}</pre>
            )}
            {queryStatus !== "Exhausted" && (
              <Button onClick={() => loadMore(5)}>Load More</Button>
            )}
          </TabsContent>
          <TabsContent value="kanban" className="mt-0">
            Data Kanban
          </TabsContent>
          <TabsContent value="calendar" className="mt-0">
            Data Calendar
          </TabsContent>
        </>
      </div>
    </Tabs>
  );
};
