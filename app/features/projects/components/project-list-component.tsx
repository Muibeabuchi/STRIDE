import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";

function ProjectListSkeleton() {
  return (
    <div className="flex flex-col gap-y-4 col-span-1">
      <div className="bg-muted border-muted border rounded-lg p-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-32 bg-background" />{" "}
          {/* Projects (count) */}
          <Button
            variant={"ghost"}
            size="icon"
            disabled
            className="!bg-background text-neutral-500"
          >
            <PlusIcon className="size-4" />
          </Button>
        </div>

        <Separator className="my-4 bg-background" />

        <ul className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <li key={index}>
              <div className="bg-background shadow-none rounded-lg p-4 flex items-center gap-x-2.5">
                <Skeleton className="h-12 w-12 rounded-full bg-muted" />{" "}
                {/* Project Avatar */}
                <Skeleton className="h-6 w-48 bg-muted" /> {/* Project Name */}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default ProjectListSkeleton;
