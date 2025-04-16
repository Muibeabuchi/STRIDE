import { DottedSeparator } from "@/components/doted-separator";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { getTaskByIdResponse } from "convex/schema";
import { PencilIcon, XIcon } from "lucide-react";
import { useState } from "react";
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

  const handleEditDescription = async () => {
    try {
      setIsSavingDescription(true);
      await editTaskDescription({
        taskId: task._id,
        taskDescription: description,
        workspaceId: task.workspaceId,
      });

      toast.success("Description updated successfully");
    } catch (error) {
      toast.error("Failed to edit the description");
      console.error("Failed to edit the description");
    } finally {
      setIsSavingDescription(false);
    }
  };

  return (
    <div className="p-4 border rounded-lg">
      <div className="flex items-center justify-between">
        <p className="text-lg font-semibold">Overview</p>
        <Button
          onClick={() => setIsEditingDescription((prev) => !prev)}
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
        <div className="flex flex-col gap-y-4">
          <Textarea
            value={description}
            className="resize-none"
            rows={4}
            placeholder="Add a description to this task"
            onChange={(e) => setDescription(e.target.value)}
            disabled={isSavingDescription}
          />
          <Button
            size="sm"
            className="w-fit ml-auto"
            onClick={handleEditDescription}
            disabled={isSavingDescription}
          >
            {isSavingDescription ? "Saving..." : "Save"}
          </Button>
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
