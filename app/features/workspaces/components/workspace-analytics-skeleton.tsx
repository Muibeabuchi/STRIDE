import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ScrollBar } from "@/components/ui/scroll-area";

function AnalyticsCardsSkeleton() {
  return (
    <ScrollArea className="border border-secondary rounded-lg w-full whitespace-nowrap shrink-0">
      <div className="w-full flex flex-row">
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className="flex w-full items-center flex-1 shrink-0">
            <div className="p-4 flex flex-col gap-y-2">
              <Skeleton className="h-4 w-32 bg-muted" /> {/* Title */}
              <Skeleton className="h-6 w-24 bg-muted" /> {/* Value */}
              <Skeleton className="h-4 w-16 bg-muted" /> {/* Difference */}
            </div>
            {index < 4 && (
              <Separator orientation="vertical" className="bg-secondary" />
            )}
          </div>
        ))}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
}

export default AnalyticsCardsSkeleton;
