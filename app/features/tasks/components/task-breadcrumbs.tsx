import { Button } from "@/components/ui/button";
import { ProjectAvatar } from "@/features/projects/components/project-avatar";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { Link, useNavigate } from "@tanstack/react-router";
import { Doc } from "convex/_generated/dataModel";
import { ChevronRightIcon, TrashIcon } from "lucide-react";
import { useDeleteTask } from "../api/use-delete-task";
import { useConfirm } from "@/hooks/use-confirm";
import { getTaskByIdResponse } from "convex/schema";

interface TaskBreadCrumbsProps {
  project: Omit<Doc<"projects">, "projectImage"> & { projectImage: string };
  task: getTaskByIdResponse;
}

const TaskBreadCrumbs = ({ project, task }: TaskBreadCrumbsProps) => {
  const workspaceId = useWorkspaceId();
  const navigate = useNavigate();

  const [confirm, ConfirmDialog] = useConfirm({
    title: "Delete Task",
    description: "This action cannot be undone",
    variant: "destructive",
  });
  const { mutate: removeTask } = useDeleteTask();

  const handleDeleteTask = async () => {
    const ok = await confirm();
    if (!ok) return;
    removeTask(
      {
        taskId: task._id,
      },
      {
        onSuccess: () => {
          navigate({
            to: "/workspaces/$workspaceId/tasks",
            params: {
              workspaceId,
            },
          });
        },
      }
    );
  };
  return (
    <div className="flex items-center gap-x-2">
      <ConfirmDialog />
      <ProjectAvatar
        name={project.projectName}
        image={project.projectImage}
        className="size-6 lg:size-8"
      />
      <Link
        to="/workspaces/$workspaceId/projects/$projectId"
        params={{
          projectId: project._id,
          workspaceId,
        }}
      >
        <p className="lg:text-lg text-sm font-semibold text-muted-foreground hover:opacity-75 transition  ">
          {project.projectName}
        </p>
      </Link>
      <ChevronRightIcon className="size-4 lg:size:5" />
      <p className="text-sm lg:text-lg font-semibold">{task.taskName}</p>
      <Button
        className="ml-auto "
        variant="destructive"
        size="sm"
        onClick={handleDeleteTask}
      >
        <TrashIcon className="size-4 lg:mr-2" />
        <span className="hidden lg:block">Delete Task</span>
      </Button>
    </div>
  );
};

export default TaskBreadCrumbs;
