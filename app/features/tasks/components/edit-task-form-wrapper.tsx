import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { convexQuery } from "@convex-dev/react-query";
import { useQuery } from "@tanstack/react-query";
import { api } from "convex/_generated/api";
import { useGetWorkspaceTasksById } from "../api/use-get-tasks-byId";
import { EditTaskForm } from "./edit-task-form";
import { Id } from "convex/_generated/dataModel";
import { EditTaskFormSkeleton } from "./edit-task-form-skeleton";

interface EditTaskFormWrapperProps {
  taskId: Id<"tasks">;
  onCancel: () => void;
}

export const useGetTaskFormData = () => {
  const workspaceId = useWorkspaceId();

  const projects = useQuery({
    ...convexQuery(api.projects.get, { workspaceId }),
    throwOnError: true,
  });
  const members = useQuery({
    ...convexQuery(api.members.get, { workspaceId }),
    throwOnError: true,
  });

  // TODO: Talk about this typescript fix for tuples
  return [projects, members] as const;
};

export function EditTaskFormWrapperSkeleton() {
  return <EditTaskFormSkeleton />;
}

export function EditTaskFormWrapper({
  taskId,
  onCancel,
}: EditTaskFormWrapperProps) {
  const {
    data: initialValues,
    isPending: isLoadingInitialValues,
    isError: taskByIdIsError,
    error: taskByIdError,
  } = useGetWorkspaceTasksById({ taskId });
  const response = useGetTaskFormData();

  const [projects, members] = response;

  const isLoading =
    projects.isPending || members.isPending || isLoadingInitialValues;

  const error = projects.error || members.error || taskByIdError;

  if (projects.isError || members.isError || taskByIdIsError) throw error;
  if (isLoading) return <EditTaskFormWrapperSkeleton />;
  const projectOptions = projects.data.map((project) => ({
    id: project._id,
    name: project.projectName,
    imageUrl: project.projectImage,
  }));
  const memberOptions = members.data.map((member) => ({
    id: member.userId,
    name: member.userName,
    imageUrl: member.userImage,
  }));
  const projectTaskStatus = projects.data[0].projectTaskStatus;

  return (
    <EditTaskForm
      memberOptions={memberOptions}
      projectOptions={projectOptions}
      taskId={taskId}
      initialValues={initialValues}
      onCancel={onCancel}
      projectTaskStatus={projectTaskStatus}
    />
  );
}
