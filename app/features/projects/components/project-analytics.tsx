import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { useGetProjectAnalytics } from "../api/use-get-project-analytics";
import { Id } from "convex/_generated/dataModel";
import AnalyticsCard from "@/components/analytics-card";
import { DottedSeparator } from "@/components/doted-separator";
import AnalyticsCardsSkeleton from "@/features/workspaces/components/workspace-analytics-skeleton";

interface ProjectAnalyticsProps {
  workspaceId: Id<"workspaces">;
  projectId: Id<"projects">;
}

const ProjectAnalytics = ({
  projectId,
  workspaceId,
}: ProjectAnalyticsProps) => {
  const {
    data: dataAnalyticsData,
    isLoading,
    isPending,
  } = useGetProjectAnalytics({
    projectId,
    workspaceId,
  });

  if (isLoading || isPending || dataAnalyticsData === undefined) {
    return <AnalyticsCardsSkeleton />;
  }
  return (
    <ScrollArea className="border rounded-lg w-full whitespace-nowrap shrink-0">
      <div className="w-full flex flex-row">
        <div className="flex w-full items-center flex-1 shrink-0 ">
          <AnalyticsCard
            title="Total Tasks"
            value={dataAnalyticsData.taskCount}
            variant={dataAnalyticsData.taskDifference > 0 ? "up" : "down"}
            increaseValue={dataAnalyticsData.taskDifference}
          />
          <DottedSeparator direction="vertical" />
        </div>
        <div className="flex w-full items-center flex-1">
          <AnalyticsCard
            title="Assigned Tasks"
            value={dataAnalyticsData.assignedTaskCount}
            variant={
              dataAnalyticsData.assignedTaskDifference > 0 ? "up" : "down"
            }
            increaseValue={dataAnalyticsData.assignedTaskDifference}
          />
          <DottedSeparator direction="vertical" />
        </div>

        <div className="flex w-full items-center flex-1">
          <AnalyticsCard
            title="Completed Tasks"
            value={dataAnalyticsData.completedTaskCount}
            variant={
              dataAnalyticsData.completedTaskDifference > 0 ? "up" : "down"
            }
            increaseValue={dataAnalyticsData.completedTaskDifference}
          />
          <DottedSeparator direction="vertical" />
        </div>
        <div className="flex w-full items-center flex-1">
          <AnalyticsCard
            title="UnCompleted Tasks"
            value={dataAnalyticsData.incompleteTaskCount}
            variant={
              dataAnalyticsData.incompleteTaskDifference > 0 ? "up" : "down"
            }
            increaseValue={dataAnalyticsData.incompleteTaskDifference}
          />
          <DottedSeparator direction="vertical" />
        </div>
        <div className="flex items-center flex-1">
          <AnalyticsCard
            title="OverDue Tasks"
            value={dataAnalyticsData.overDueTaskCount}
            variant={
              dataAnalyticsData.overdueTaskDifference > 0 ? "up" : "down"
            }
            increaseValue={dataAnalyticsData.overdueTaskDifference}
          />
        </div>
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
};

export default ProjectAnalytics;
