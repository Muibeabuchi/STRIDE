import { Skeleton } from "@/components/ui/skeleton";

import { Button } from "@/components/ui/button";
import { TrashIcon, ChevronRightIcon } from "lucide-react"; // Assuming you're using heroicons
import { DottedSeparator } from "@/components/doted-separator";

function TaskIdRouteSkeleton() {
  return (
    <div className="flex flex-col">
      {/* TaskBreadCrumbs Skeleton */}
      <div className="flex items-center gap-x-2">
        <Skeleton className="size-6 lg:size-8 rounded-md enhanced-skeleton" />{" "}
        {/* Project Avatar */}
        <Skeleton className="h-5 w-32 enhanced-skeleton" /> {/* Project Name */}
        <ChevronRightIcon className="size-4 lg:size:5 text-muted-foreground" />
        <Skeleton className="h-7 w-48 rounded-md enhanced-skeleton" />{" "}
        {/* Task Name */}
        <div className="ml-auto">
          <Skeleton className="h-9 w-28 enhanced-skeleton" />{" "}
          {/* Delete Button */}
        </div>
      </div>

      <DottedSeparator className="my-6" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* TaskOverview Skeleton */}
        <div className="flex flex-col gap-y-4 col-span-1">
          <div className="bg-muted p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <Skeleton className="h-6 w-24 enhanced-skeleton" />{" "}
              {/* Overview Text */}
              <Skeleton className="h-9 w-20 enhanced-skeleton" />{" "}
              {/* Edit Button */}
            </div>

            <DottedSeparator className="my-4" />

            <div className="flex flex-col gap-y-4">
              {/* Assignee Row */}
              <div className="flex flex-col gap-y-1">
                <Skeleton className="h-4 w-16 enhanced-skeleton" />{" "}
                {/* Label */}
                <div className="flex items-center gap-x-2 mt-1">
                  <Skeleton className="size-6 rounded-full enhanced-skeleton" />{" "}
                  {/* Avatar */}
                  <Skeleton className="h-4 w-24 enhanced-skeleton" />{" "}
                  {/* Name */}
                </div>
              </div>

              {/* Due Date Row */}
              <div className="flex flex-col gap-y-1">
                <Skeleton className="h-4 w-16 enhanced-skeleton" />{" "}
                {/* Label */}
                <Skeleton className="h-4 w-32 mt-1 enhanced-skeleton" />{" "}
                {/* Date */}
              </div>

              {/* Status Row */}
              <div className="flex flex-col gap-y-1">
                <Skeleton className="h-4 w-16 enhanced-skeleton" />{" "}
                {/* Label */}
                <Skeleton className="h-6 w-24 rounded-full mt-1 enhanced-skeleton" />{" "}
                {/* Status Badge */}
              </div>
            </div>
          </div>
        </div>

        {/* TaskDescription Skeleton */}
        <div className="p-4 border rounded-lg">
          <div className="flex items-center justify-between">
            <Skeleton className="h-6 w-24 enhanced-skeleton" />{" "}
            {/* Overview Text */}
            <Skeleton className="h-9 w-20 enhanced-skeleton" />{" "}
            {/* Edit Button */}
          </div>

          <DottedSeparator className="my-4" />

          <div className="flex flex-col gap-y-2">
            <Skeleton className="h-4 w-full enhanced-skeleton" />
            <Skeleton className="h-4 w-full enhanced-skeleton" />
            <Skeleton className="h-4 w-4/5 enhanced-skeleton" />
            <Skeleton className="h-4 w-3/5 enhanced-skeleton" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default TaskIdRouteSkeleton;
