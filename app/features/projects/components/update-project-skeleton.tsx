import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { DottedSeparator } from "@/components/doted-separator";

const ProjectSettingsSkeleton = () => {
  return (
    <div className="flex flex-col gap-y-4 animate-pulse">
      {/* Header Card */}
      <Card className="w-full h-full border-none shadow-none">
        <CardHeader className="flex flex-row items-center justify-between gap-x-4 space-y-0 p-7">
          <Skeleton className="h-9 w-24" /> {/* Back button */}
          <Skeleton className="h-6 w-48" /> {/* Project title */}
        </CardHeader>
        <div className="px-7">
          <DottedSeparator />
        </div>
        <CardContent className="p-7">
          <div className="flex flex-col gap-y-4">
            {/* Project Name field */}
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" /> {/* Form Label */}
              <Skeleton className="h-10 w-full" /> {/* Input field */}
            </div>

            {/* Project Icon field */}
            <div className="flex flex-col gap-y-2">
              <div className="flex items-center gap-x-5">
                <Skeleton className="size-[72px] rounded-md" />{" "}
                {/* Image placeholder */}
                <div className="flex flex-col gap-y-2">
                  <Skeleton className="h-4 w-20" /> {/* Project Icon text */}
                  <Skeleton className="h-4 w-48" /> {/* JPG, PNG text */}
                  <Skeleton className="h-8 w-28 mt-2" />{" "}
                  {/* Upload/Remove button */}
                </div>
              </div>
            </div>
          </div>

          <DottedSeparator className="py-7" />

          <div className="flex items-center justify-between">
            <Skeleton className="h-10 w-24" /> {/* Cancel button */}
            <Skeleton className="h-10 w-32" /> {/* Save Changes button */}
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone Card */}
      <Card className="w-full h-full border-none shadow-none">
        <CardContent className="p-7">
          <div className="flex flex-col">
            <Skeleton className="h-5 w-28" /> {/* Danger Zone title */}
            <Skeleton className="h-4 w-full mt-2" /> {/* Description text */}
            <DottedSeparator className={"py-7"} />
            <div className="flex justify-end mt-6">
              <Skeleton className="h-9 w-28" /> {/* Delete Project button */}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProjectSettingsSkeleton;
