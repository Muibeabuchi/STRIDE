import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Id } from "convex/_generated/dataModel";
import AnalyticsCard from "@/components/analytics-card";
import { DottedSeparator } from "@/components/doted-separator";
import { useGetWorkspaceAnalytics } from "../api/use-get-workspaces-analytics";
interface WorkspaceAnalyticsProps {
  workspaceId: Id<"workspaces">;
}

const WorkspaceAnalytics = ({ workspaceId }: WorkspaceAnalyticsProps) => {
  const { data: workspaceAnalyticsData } =
    useGetWorkspaceAnalytics(workspaceId);

  return (
    <ScrollArea className="border rounded-lg w-full whitespace-nowrap shrink-0">
      <div className="w-full flex flex-row">
        <div className="flex w-full items-center flex-1 shrink-0 ">
          <AnalyticsCard
            title="Total Tasks"
            value={workspaceAnalyticsData.taskCount}
            variant={workspaceAnalyticsData.taskDifference > 0 ? "up" : "down"}
            increaseValue={workspaceAnalyticsData.taskDifference}
          />
          <DottedSeparator direction="vertical" />
        </div>
        <div className="flex w-full items-center flex-1">
          <AnalyticsCard
            title="Assigned Tasks"
            value={workspaceAnalyticsData.assignedTaskCount}
            variant={
              workspaceAnalyticsData.assignedTaskDifference > 0 ? "up" : "down"
            }
            increaseValue={workspaceAnalyticsData.assignedTaskDifference}
          />
          <DottedSeparator direction="vertical" />
        </div>

        <div className="flex w-full items-center flex-1">
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
        </div>
        <div className="flex items-center flex-1">
          <AnalyticsCard
            title="OverDue Tasks"
            value={workspaceAnalyticsData.overDueTaskCount}
            variant={
              workspaceAnalyticsData.overdueTaskDifference > 0 ? "up" : "down"
            }
            increaseValue={workspaceAnalyticsData.overdueTaskDifference}
          />
        </div>
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
};

export default WorkspaceAnalytics;

// import { Skeleton } from "@/components/ui/skeleton";
// import { Separator } from "@/components/ui/separator";
// import { Button } from "@/components/ui/button";
// import { PlusIcon } from "lucide-react";

// function TaskListSkeleton() {
//   return (
//     <div className="flex flex-col gap-y-4 col-span-1">
//       <div className="bg-neutral-800 rounded-lg p-4">
//         <div className="flex items-center justify-between">
//           <Skeleton className="h-6 w-32 bg-neutral-600" /> {/* Tasks (count) */}
//           <Button
//             variant={"ghost"}
//             size="icon"
//             disabled
//             className="bg-neutral-700 text-neutral-500"
//           >
//             <PlusIcon className="size-4" />
//           </Button>
//         </div>

//         <Separator className="my-4 bg-neutral-700" />

//         <ul className="flex flex-col gap-y-4">
//           {Array.from({ length: 4 }).map((_, index) => (
//             <li key={index}>
//               <div className="shadow-none rounded-lg p-0">
//                 {" "}
//                 {/* Mimic Card with p-0 */}
//                 <div className="p-4">
//                   {" "}
//                   {/* Mimic CardContent with p-4 */}
//                   <Skeleton className="h-6 w-48 bg-neutral-600" />{" "}
//                   {/* taskName */}
//                   <div className="flex items-center gap-x-4 mt-2">
//                     {" "}
//                     {/* Mimic the flex container */}
//                     <Skeleton className="h-4 w-20 bg-neutral-600" />{" "}
//                     {/* projectName */}
//                     <div className="rounded-full size-1 bg-neutral-500 animate-pulse" />{" "}
//                     {/* Dot */}
//                     <div className="flex items-center">
//                       <div className="mr-2">
//                         <Skeleton className="h-4 w-4 bg-neutral-600" />{" "}
//                         {/* Calendar Icon */}
//                       </div>
//                       <Skeleton className="h-4 w-24 bg-neutral-600" />{" "}
//                       {/* Due Date */}
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </li>
//           ))}
//         </ul>

//         <Button
//           variant={"ghost"}
//           className="mt-4 w-full bg-neutral-700 text-neutral-500"
//           disabled
//         >
//           <Skeleton className="h-6 w-full bg-neutral-600" /> {/* Show All */}
//         </Button>
//       </div>
//     </div>
//   );
// }

// export default TaskListSkeleton;
