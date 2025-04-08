import { DottedSeparator } from "@/components/doted-separator";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TabsContent } from "@radix-ui/react-tabs";
import { PlusIcon } from "lucide-react";
import { api } from "convex/_generated/api";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { usePaginatedQuery } from "convex/react";

export const TaskViewSwitcher = () => {
  const workspaceId = useWorkspaceId();
  const { isLoading, results, status } = usePaginatedQuery(
    api.tasks.get,
    { workspaceId },
    {
      initialNumItems: 5,
    }
  );

  console.log(status);
  // return
  return (
    <Tabs className="flex-1 w-full border rounded-lg">
      <pre>{JSON.stringify(results, null, 2)}</pre>
      <div className="h-full flex flex-col overflow-auto p-4">
        <div className="flex flex-col lg:flex-row gap-y-2 justify-between items-center">
          <TabsList className="w-full lg:w-auto ">
            <TabsTrigger className="h-8 w-full lg:w-auto" value="table">
              Table
            </TabsTrigger>
            <TabsTrigger className="h-8 w-full lg:w-auto" value="kanban">
              Kanban
            </TabsTrigger>
            <TabsTrigger className="h-8 w-full lg:w-auto" value="calender">
              Calender
            </TabsTrigger>
          </TabsList>
          <Button size="sm" className="w-full lg:w-auto">
            <PlusIcon className="size-4 mr-2" />
            New
          </Button>
        </div>
        <DottedSeparator className="my-4" />
        {/* add filters */}
        Data Filters
        <DottedSeparator className="my-4" />
        <>
          <TabsContent value="table" className="mt-0">
            Data Table
          </TabsContent>
          <TabsContent value="kanban" className="mt-0">
            Data Kanban
          </TabsContent>
          <TabsContent value="calender" className="mt-0">
            Data Calender
          </TabsContent>
        </>
      </div>
    </Tabs>
  );
};
