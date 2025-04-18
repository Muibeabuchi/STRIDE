import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";

function ProjectListSkeleton() {
  return (
    <div className="flex flex-col gap-y-4 col-span-1">
      <div className="bg-neutral-800 border-neutral-700 border rounded-lg p-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-32 bg-neutral-600" />{" "}
          {/* Projects (count) */}
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

        <ul className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <li key={index}>
              <div className="bg-neutral-700 shadow-none rounded-lg p-4 flex items-center gap-x-2.5">
                <Skeleton className="h-12 w-12 rounded-full bg-neutral-600" />{" "}
                {/* Project Avatar */}
                <Skeleton className="h-6 w-48 bg-neutral-600" />{" "}
                {/* Project Name */}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default ProjectListSkeleton;
