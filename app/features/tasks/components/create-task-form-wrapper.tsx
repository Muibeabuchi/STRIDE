import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { convexQuery } from "@convex-dev/react-query";
import { useQuery, useSuspenseQueries } from "@tanstack/react-query";
import { api } from "convex/_generated/api";
import { CreateTaskForm } from "./create-task-form";

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
  // return useSuspenseQueries({
  //   queries: [
  //     {
  //       queryKey: convexQuery(api.projects.get, { workspaceId }).queryKey,
  //       queryFn: convexQuery(api.projects.get, { workspaceId }).queryFn,
  //       staleTime: Infinity,
  //     },
  //     {
  //       queryKey: convexQuery(api.members.get, { workspaceId }).queryKey,
  //       queryFn: convexQuery(api.members.get, { workspaceId }).queryFn,
  //       staleTime: Infinity,
  //     },
  //   ],
  // });
};

// TODO: create SkeletonLoading component using AI
export function CreateTaskFormWrapperSkeleton() {
  return <p>Loading...</p>;
}

export function CreateTaskFormWrapper() {
  const response = useGetTaskFormData();

  const [projects, members] = response;

  const isLoading = projects.isPending || members.isPending;

  const error = projects.error || members.error;

  if (projects.isError || members.isError) throw error;
  if (isLoading) return <CreateTaskFormWrapperSkeleton />;

  const projectOptions = projects.data.map((project) => ({
    id: project._id,
    name: project.projectName,
    imageUrl: project.projectImage,
  }));
  const memberOptions = members.data.map((member) => ({
    id: member.userId,
    name: member.userName,
  }));

  return (
    <CreateTaskForm
      memberOptions={memberOptions}
      projectOptions={projectOptions}
    />
  );
}
