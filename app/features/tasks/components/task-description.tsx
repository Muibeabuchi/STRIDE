import { DottedSeparator } from "@/components/doted-separator";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { getTaskByIdResponse } from "convex/schema";
import { PencilIcon, XIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useEditTask } from "../api/use-edit-task";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { toast } from "sonner";
interface TaskDescriptionProps {
  task: getTaskByIdResponse;
}

const TaskDescription = ({ task }: TaskDescriptionProps) => {
  const editTaskDescription = useEditTask();
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [description, setDescription] = useState(task.description);
  const [isSavingDescription, setIsSavingDescription] = useState(false);
  const textAreRef = useRef<HTMLTextAreaElement | null>(null);

  const handleEditDescription = async () => {
    // if (description && description.trim().length === 0) return;
    if (!descriptionLengthIsValid) return;

    if (!description) return;
    if (descriptionHasChanged) return;
    try {
      setIsSavingDescription(true);
      await editTaskDescription({
        taskId: task._id,
        taskDescription: description?.trim(),
        workspaceId: task.workspaceId,
      });

      toast.success("Description updated successfully");
    } catch (error) {
      toast.error("Failed to edit the description");
      console.error("Failed to edit the description");
    } finally {
      setIsSavingDescription(false);
      setIsEditingDescription(false);
    }
  };

  useEffect(
    function () {
      if (isEditingDescription) {
        if (textAreRef.current) {
          textAreRef.current?.focus();
        }
      }
    },
    [isEditingDescription]
  );

  const descriptionHasChanged =
    task.description && description
      ? task.description.trim() === description.trim()
      : false;

  const descriptionLengthIsValid =
    description && description.trim().length !== 0;

  return (
    <div className="p-4 border rounded-lg">
      <div className="flex items-center justify-between">
        <p className="text-lg font-semibold">Overview</p>
        <Button
          onClick={() => {
            setIsEditingDescription((prev) => !prev);
            // if (!isEditingDescription && textAreRef.current) {
            // }
          }}
          size={"sm"}
          variant={"secondary"}
        >
          {isEditingDescription ? (
            <XIcon className="size-4 mr-2" />
          ) : (
            <PencilIcon className="size-4 mr-2" />
          )}
          {isEditingDescription ? "Cancel" : "Edit"}
        </Button>
      </div>
      <DottedSeparator className="my-4" />
      {isEditingDescription ? (
        <div className="flex flex-col  gap-y-4 max-h-[100px]">
          <Textarea
            value={description}
            ref={textAreRef}
            className="resize-none h-full scrollbar-hide overflow-y-auto"
            rows={8}
            placeholder="Add a description to this task"
            onChange={(e) => setDescription(e.target.value)}
            disabled={isSavingDescription}
          />
          {description &&
            !descriptionHasChanged &&
            descriptionLengthIsValid && (
              <Button
                size="sm"
                className="w-fit ml-auto"
                onClick={handleEditDescription}
                disabled={isSavingDescription}
              >
                {isSavingDescription ? "Saving..." : "Save"}
              </Button>
            )}
        </div>
      ) : (
        <div className="">
          {task.description || (
            <span className="text-muted-foreground">No description set</span>
          )}
        </div>
      )}
    </div>
  );
};

export default TaskDescription;
