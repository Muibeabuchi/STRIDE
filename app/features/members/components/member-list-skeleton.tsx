import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { SettingsIcon } from "lucide-react";

function PeopleListSkeleton() {
  return (
    <div className="flex flex-col gap-y-4 col-span-1">
      <div className="bg-muted border border-muted rounded-lg p-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-32 bg-background" /> {/* People (count) */}
          <Button
            variant="ghost"
            size="icon"
            className="!bg-background"
            disabled
          >
            <SettingsIcon className="size-4 " />
          </Button>
        </div>

        <Separator className="my-4 bg-background" />

        <ul className="grid grid-cols-1 lg:grid-cols-3 sm:grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map(
            (
              _,
              index // Showing a few loading states
            ) => (
              <li key={index}>
                <div className="shadow-none rounded-lg overflow-hidden bg-background">
                  {" "}
                  {/* Mimic Card */}
                  <div className="p-3 flex flex-col items-center gap-x-2">
                    {" "}
                    {/* Mimic CardContent */}
                    <Skeleton className="h-12 w-12 rounded-full bg-muted" />{" "}
                    {/* MemberAvatar */}
                    <div className="flex items-center overflow-hidden flex-col mt-2">
                      {" "}
                      {/* Vertical text container */}
                      <Skeleton className="h-3 w-24 bg-muted" />{" "}
                      {/* User Email (sm:hidden lg:block) */}
                      <Skeleton className="h-4 w-32 bg-muted mt-1" />{" "}
                      {/* User Name */}
                    </div>
                  </div>
                </div>
              </li>
            )
          )}
        </ul>
      </div>
    </div>
  );
}

export default PeopleListSkeleton;
