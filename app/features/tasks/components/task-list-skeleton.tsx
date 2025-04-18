import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";

function TaskListSkeleton() {
  return (
    <div className="flex flex-col gap-y-4 col-span-1">
      <div className="bg-neutral-800 rounded-lg p-4">
        {" "}
        {/* Darker background for contrast */}
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-32 bg-neutral-600" /> {/* Tasks (count) */}
          <Button
            variant={"ghost"}
            size="icon"
            disabled
            className="bg-neutral-700 text-neutral-500"
          >
            <PlusIcon className="size-4" />
          </Button>
        </div>
        <Separator className="my-4 bg-neutral-700" />
        <ul className="flex flex-col gap-y-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <li key={index}>
              <div className="bg-neutral-700 shadow-none rounded-lg p-4">
                <div className="flex flex-col gap-y-2">
                  <Skeleton className="h-6 w-48 bg-neutral-600" />{" "}
                  {/* taskName */}
                  <div className="flex items-center gap-x-4">
                    <Skeleton className="h-4 w-20 bg-neutral-600" />{" "}
                    {/* projectName */}
                    <div className="rounded-full size-1 bg-neutral-500 animate-pulse" />{" "}
                    {/* Lighter pulse */}
                    <div className="flex items-center">
                      <div className="mr-2">
                        <Skeleton className="h-4 w-4 bg-neutral-600" />{" "}
                        {/* Calendar Icon Placeholder */}
                      </div>
                      <Skeleton className="h-4 w-24 bg-neutral-600" />{" "}
                      {/* Due Date */}
                    </div>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
        <Button
          variant={"ghost"}
          className="mt-4 w-full bg-neutral-700 text-neutral-500"
          disabled
        >
          <Skeleton className="h-6 w-[100px] bg-neutral-600" /> {/* Show All */}
        </Button>
      </div>
    </div>
  );
}

export default TaskListSkeleton;
