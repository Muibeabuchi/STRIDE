import { DottedSeparator } from "@/components/doted-separator";
import { Card, CardHeader, CardContent } from "@/components/ui/card";

const WorkspaceSettingsSkeleton = () => {
  return (
    <div className="flex flex-col gap-y-4">
      {/* Main Settings Card */}
      <Card className="w-full h-full border-none shadow-none">
        <CardHeader className="flex flex-row items-center justify-between gap-x-4 space-y-0 p-7">
          <div className="h-9 w-24 enhanced-skeleton" /> {/* Back button */}
          <div className="h-6 w-48 enhanced-skeleton" /> {/* Workspace title */}
        </CardHeader>
        <div className="px-7">
          <DottedSeparator />
        </div>
        <CardContent className="p-7">
          <div className="flex flex-col gap-y-4">
            {/* Workspace Name field */}
            <div className="space-y-2">
              <div className="h-4 w-32 enhanced-skeleton" /> {/* Form Label */}
              <div className="h-10 w-full enhanced-skeleton" />{" "}
              {/* Input field */}
            </div>

            {/* Workspace Icon field */}
            <div className="flex flex-col gap-y-2">
              <div className="flex items-center gap-x-5">
                <div className="size-[72px] rounded-md enhanced-skeleton" />{" "}
                {/* Image placeholder */}
                <div className="flex flex-col gap-y-2">
                  <div className="h-4 w-28 enhanced-skeleton" />{" "}
                  {/* Workspace Icon text */}
                  <div className="h-4 w-56 enhanced-skeleton" />{" "}
                  {/* File type info */}
                  <div className="h-8 w-28 mt-2 enhanced-skeleton" />{" "}
                  {/* Upload/Remove button */}
                </div>
              </div>
            </div>
          </div>

          <DottedSeparator className="py-7" />

          <div className="flex items-center justify-between">
            <div className="h-10 w-24 enhanced-skeleton" />{" "}
            {/* Cancel button */}
            <div className="h-10 w-32 enhanced-skeleton" />{" "}
            {/* Save Changes button */}
          </div>
        </CardContent>
      </Card>

      {/* Invite Members Card */}
      <Card className="w-full h-full border-none shadow-none">
        <CardContent className="p-7">
          <div className="flex flex-col">
            <div className="h-5 w-32 enhanced-skeleton" />{" "}
            {/* Invite Members title */}
            <div className="h-4 w-full mt-1 enhanced-skeleton" />{" "}
            {/* Description text */}
            <div className="mt-4">
              <div className="flex items-center gap-x-2">
                <div className="h-10 w-full enhanced-skeleton" />{" "}
                {/* Input field */}
                <div className="size-12 enhanced-skeleton" />{" "}
                {/* Copy button */}
              </div>
            </div>
            <DottedSeparator className={"py-7"} />
            <div className="flex justify-end mt-6">
              <div className="h-9 w-32 enhanced-skeleton" />{" "}
              {/* Reset invite link button */}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone Card */}
      <Card className="w-full h-full border-none shadow-none">
        <CardContent className="p-7">
          <div className="flex flex-col">
            <div className="h-5 w-28 enhanced-skeleton" />{" "}
            {/* Danger Zone title */}
            <div className="h-4 w-full mt-1 enhanced-skeleton" />{" "}
            {/* Description text */}
            <DottedSeparator className={"py-7"} />
            <div className="flex justify-end mt-6">
              <div className="h-9 w-36 enhanced-skeleton" />{" "}
              {/* Delete Workspace button */}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WorkspaceSettingsSkeleton;
