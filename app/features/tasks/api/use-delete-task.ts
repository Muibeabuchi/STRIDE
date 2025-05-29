import { api } from "convex/_generated/api";
import { useConvexMutation } from "@convex-dev/react-query";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

export const useDeleteTask = () => {
  const mutation = useMutation({
    mutationFn: useConvexMutation(api.tasks.remove).withOptimisticUpdate(
      (localStore, { taskId, workspaceId, projectId }) => {
        const tasks = localStore.getQuery(api.tasks.get, {
          workspaceId,
        });

        if (!tasks) {
          const tasksFromProjects = localStore.getQuery(api.tasks.get, {
            workspaceId,
            projectId,
          });

          console.log(tasksFromProjects);

          if (!tasksFromProjects) return;

          const filteredTasks = tasksFromProjects.filter(
            (task) => task._id !== taskId
          );
          console.log(filteredTasks);

          localStore.setQuery(
            api.tasks.get,
            {
              workspaceId,
              projectId,
            },
            filteredTasks
          );

          // return;
        }

        if (!tasks) return;

        const filteredTasks = tasks.filter((task) => task._id !== taskId);

        localStore.setQuery(
          api.tasks.get,
          {
            workspaceId,
            // projectId,
          },
          filteredTasks
        );
      }
    ),
    onSuccess: () => {
      toast.success("Task Removed successfully");
    },
    onError: () => {
      toast.error("Failed to Delete Task");
    },
  });
  return mutation;
};
