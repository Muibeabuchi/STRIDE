import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useConfirm } from "@/hooks/use-confirm";
import { Id } from "convex/_generated/dataModel";
import { ExternalLinkIcon, PencilIcon, TrashIcon } from "lucide-react";
import { ReactNode } from "react";
import { useDeleteTask } from "../api/use-delete-task";
import { useNavigate } from "@tanstack/react-router";

interface TaskActionProps {
  id: Id<"tasks">;
  projectId: Id<"projects">;
  workspaceId: Id<"workspaces">;
  children: ReactNode;
}

const TaskActions = ({
  children,
  workspaceId,
  id,
  projectId,
}: TaskActionProps) => {
  const [confirm, ConfirmDialog] = useConfirm({
    title: "Delete Task",
    description: "This action cannot be undone",
    variant: "destructive",
  });

  const navigate = useNavigate();

  const { mutate: removeTask, isPending: deletingTask } = useDeleteTask();

  const onDeleteTask = async () => {
    const ok = await confirm();
    if (!ok) return;
    removeTask({
      taskId: id,
    });
  };

  const onOpenProject = () => {
    navigate({
      to: "/workspaces/$workspaceId/projects/$projectId",
      params: {
        projectId,
        workspaceId,
      },
    });
  };

  //  TODO:  Write method for opening a task
  const openTask = () => {};

  return (
    <div className="flex justify-end">
      <ConfirmDialog />
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem onClick={() => {}} className="font-medium p-[10px]">
            <ExternalLinkIcon className="size-4 mr-w stroke-2" />
            Task Details
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => {}} className="font-medium p-[10px]">
            <PencilIcon className="size-4 mr-w stroke-2" />
            Edit Task
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={onDeleteTask}
            disabled={deletingTask}
            className="text-amber-700 focus:text-amber-700 font-medium p-[10px]"
          >
            <TrashIcon className="size-4 mr-w stroke-2" />
            Delete Task
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={onOpenProject}
            className="font-medium p-[10px]"
          >
            <ExternalLinkIcon className="size-4 mr-w stroke-2" />
            Open Project
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default TaskActions;
