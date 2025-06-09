import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useConfirm } from "@/hooks/use-confirm";
import { Id } from "convex/_generated/dataModel";
import {
  ArrowBigRight,
  ArrowUpRightFromSquare,
  CopyIcon,
  ExternalLinkIcon,
  InfoIcon,
  PencilIcon,
  TrashIcon,
} from "lucide-react";
import { ReactNode } from "react";
import { useDeleteTask } from "../api/use-delete-task";
import { useNavigate } from "@tanstack/react-router";
import { useEditTaskModalStore } from "@/store/store";
import { useCopyTask } from "../api/use-copy-task";

import {
  getRouteApi,
  useLocation,
  useMatchRoute,
} from "@tanstack/react-router";

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
  const { openEditTaskModal } = useEditTaskModalStore();

  const navigate = useNavigate();

  const { mutate: removeTask, isPending: deletingTask } = useDeleteTask();
  const { mutate: CopyTask, isPending: CopyingTask } = useCopyTask();

  const matchRoute = useMatchRoute();
  const params = matchRoute({
    to: "/workspaces/$workspaceId/projects/$projectId",
  });

  const onDeleteTask = async () => {
    const ok = await confirm();
    if (!ok) return;
    removeTask({
      taskId: id,
      workspaceId,
      projectId,
    });
  };

  const onOpenProject = () => {
    navigate({
      to: "/workspaces/$workspaceId/projects/$projectId",
      params: {
        projectId,
        workspaceId,
      },
      search: (search) => ({
        ...search,
        projectId,
      }),
    });
  };

  //  TODO:  Write method for opening a task
  const openTask = () => {
    navigate({
      to: "/workspaces/$workspaceId/tasks/$taskId",
      params: {
        taskId: id,
        workspaceId,
      },
    });
  };

  const handleOpenEditTaskModal = () => {
    openEditTaskModal(id);
  };

  const handleCopyTask = () => {
    CopyTask({
      taskId: id,
      workspaceId,
    });
  };

  return (
    <div className="flex justify-end">
      <ConfirmDialog />
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          {params === false ? (
            <DropdownMenuItem
              onClick={onOpenProject}
              className="font-medium p-[10px]"
            >
              <ArrowBigRight className="size-4 mr-w stroke-2" />
              Go To Project
            </DropdownMenuItem>
          ) : null}
          <DropdownMenuItem
            onClick={openTask}
            className="font-medium p-[10px] hover:bg-muted"
          >
            <InfoIcon className="size-4 mr-w stroke-2" />
            Task Details
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={handleOpenEditTaskModal}
            className="font-medium p-[10px] hover:bg-muted"
          >
            <PencilIcon className="size-4 mr-w stroke-2" />
            Edit Task
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={handleCopyTask}
            disabled={CopyingTask}
            className="font-medium hover:bg-muted p-[10px]"
          >
            <CopyIcon className="size-4 mr-w stroke-2" />
            Copy Task
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={onDeleteTask}
            disabled={deletingTask}
            className="text-amber-700 focus:text-amber-700 hover:bg-muted font-medium p-[10px]"
          >
            <TrashIcon className="size-4 mr-w stroke-2" />
            Delete Task
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default TaskActions;
