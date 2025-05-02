import { DottedSeparator } from "@/components/doted-separator";
import { Card, CardHeader, CardContent } from "@/components/ui/card";

const CreateTaskSkeleton = () => {
  return (
    <Card className="w-full h-full border-none shadow-none gap-4">
      <CardHeader className="flex p-4">
        <div className="h-6 w-48 enhanced-skeleton" /> {/* Card title */}
      </CardHeader>
      <div className="px-7">
        <DottedSeparator />
      </div>
      <CardContent className="p-4">
        <div className="flex flex-col gap-y-4">
          {/* Task Name field */}
          <div className="space-y-2">
            <div className="h-4 w-24 enhanced-skeleton" /> {/* Form Label */}
            <div className="h-10 w-full enhanced-skeleton" />{" "}
            {/* Input field */}
          </div>

          {/* Due Date field */}
          <div className="space-y-2">
            <div className="h-4 w-20 enhanced-skeleton" /> {/* Form Label */}
            <div className="h-10 w-full enhanced-skeleton" />{" "}
            {/* Date picker */}
          </div>

          {/* Assignee field */}
          <div className="space-y-2">
            <div className="h-4 w-20 enhanced-skeleton" /> {/* Form Label */}
            <div className="h-10 w-full enhanced-skeleton" />{" "}
            {/* Select input */}
          </div>

          {/* Status field */}
          <div className="space-y-2">
            <div className="h-4 w-28 enhanced-skeleton" /> {/* Form Label */}
            <div className="h-10 w-full enhanced-skeleton" />{" "}
            {/* Select input */}
          </div>

          {/* Project field */}
          <div className="space-y-2">
            <div className="h-4 w-28 enhanced-skeleton" /> {/* Form Label */}
            <div className="h-10 w-full enhanced-skeleton" />{" "}
            {/* Select input */}
          </div>
        </div>

        <DottedSeparator className="py-7" />

        <div className="flex items-center justify-between">
          <div className="h-10 w-24 enhanced-skeleton" /> {/* Cancel button */}
          <div className="h-10 w-32 enhanced-skeleton" />{" "}
          {/* Create Task button */}
        </div>
      </CardContent>
    </Card>
  );
};

export default CreateTaskSkeleton;
