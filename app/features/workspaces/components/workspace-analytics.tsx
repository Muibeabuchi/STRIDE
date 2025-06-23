import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Id } from "convex/_generated/dataModel";
import AnalyticsCard from "@/components/analytics-card";
import { DottedSeparator } from "@/components/doted-separator";
import { useGetWorkspaceAnalytics } from "../api/use-get-workspaces-analytics";
import WorkspaceAnalyticsSkeleton from "@/features/workspaces/components/workspace-analytics-skeleton";

interface WorkspaceAnalyticsProps {
  workspaceId: Id<"workspaces">;
}

const WorkspaceAnalytics = ({ workspaceId }: WorkspaceAnalyticsProps) => {
  const {
    data: workspaceAnalyticsData,
    isPending,
    isLoading,
  } = useGetWorkspaceAnalytics(workspaceId);

  if (isPending || isLoading || workspaceAnalyticsData === undefined) {
    return <WorkspaceAnalyticsSkeleton />;
  }

  return (
    <ScrollArea className="rounded-lg w-full whitespace-nowrap shrink-0">
      <div className="w-full gap-x-2 flex flex-row">
        <div className="flex border rounded-xl w-full items-center flex-1 shrink-0 ">
          <AnalyticsCard
            title="Total Tasks"
            value={workspaceAnalyticsData.taskCount}
            variant={workspaceAnalyticsData.taskDifference > 0 ? "up" : "down"}
            increaseValue={workspaceAnalyticsData.taskDifference}
          />
        </div>
        <DottedSeparator direction="vertical" />
        <div className="flex w-full items-center rounded-xl border flex-1">
          <AnalyticsCard
            title="Assigned Tasks"
            value={workspaceAnalyticsData.assignedTaskCount}
            variant={
              workspaceAnalyticsData.assignedTaskDifference > 0 ? "up" : "down"
            }
            increaseValue={workspaceAnalyticsData.assignedTaskDifference}
          />
          {/* <DottedSeparator direction="vertical" /> */}
        </div>

        {/* <div className="flex w-full items-center flex-1">
          <AnalyticsCard
            title="Completed Tasks"
            value={workspaceAnalyticsData.completedTaskCount}
            variant={
              workspaceAnalyticsData.completedTaskDifference > 0 ? "up" : "down"
            }
            increaseValue={workspaceAnalyticsData.completedTaskDifference}
          />
          <DottedSeparator direction="vertical" />
        </div>
        <div className="flex w-full items-center flex-1">
          <AnalyticsCard
            title="UnCompleted Tasks"
            value={workspaceAnalyticsData.incompleteTaskCount}
            variant={
              workspaceAnalyticsData.incompleteTaskDifference > 0
                ? "up"
                : "down"
            }
            increaseValue={workspaceAnalyticsData.incompleteTaskDifference}
          />
          <DottedSeparator direction="vertical" />
        </div> */}
        {/* <div className="flex items-center flex-1">
          <AnalyticsCard
            title="OverDue Tasks"
            value={workspaceAnalyticsData.overDueTaskCount}
            variant={
              workspaceAnalyticsData.overdueTaskDifference > 0 ? "up" : "down"
            }
            increaseValue={workspaceAnalyticsData.overdueTaskDifference}
          />
        </div> */}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
};

export default WorkspaceAnalytics;
