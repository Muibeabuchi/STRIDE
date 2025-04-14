import { api } from "convex/_generated/api";
import { useConvexMutation } from "@convex-dev/react-query";
// import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useMutation } from "convex/react";

// export const useEditTask = () => {
//   const queryClient = useQueryClient();

//   const mutation = useMutation({
//     mutationFn: useConvexMutation(api.tasks.edit),
//     // onMutate: (ctx) => {
//     //   return {}
//     // },
//     onSuccess: () => {
//       toast.success("Task Edited successfully");
//     },
//     onError: () => {
//       toast.error("Failed to edit Task");
//     },
//     // onMutate: async (newTodo) => {
//     //   // Cancel any outgoing refetches
//     //   // (so they don't overwrite our optimistic update)
//     //   await queryClient.cancelQueries({ queryKey: ["todos", newTodo.id] });

//     //   // Snapshot the previous value
//     //   const previousTodo = queryClient.getQueryData(["todos", newTodo.id]);

//     //   // Optimistically update to the new value
//     //   queryClient.setQueryData(["todos", newTodo.id], newTodo);

//     //   // Return a context with the previous and new todo
//     //   return { previousTodo, newTodo };
//     // },
//     // Always refetch after error or success:
//     // onSettled: (newTodo) => {
//     //   queryClient.invalidateQueries({ queryKey: ["todos", newTodo.id] });
//     // },
//   });
//   return mutation;
// };

export const useEditTask = () => {
  const editTask = useMutation(api.tasks.edit).withOptimisticUpdate(
    (
      localStore,
      {
        workspaceId,
        taskId,
        taskPosition,
        dueDate,
        assigneeId,
        projectId,
        taskName,
        taskStatus,
        taskDescription,
      }
    ) => {
      const tasks = localStore.getQuery(api.tasks.get, {
        workspaceId,
        dueDate,
        assigneeId,
        projectId,
      });
      if (!tasks) return;

      // grab the task we wanna edit
      const taskToEdit = tasks.find((task) => task._id === taskId);
      if (!taskToEdit) return;

      console.log("taskToEdit", taskToEdit);

      const newTaskToEdit: typeof taskToEdit = {
        ...taskToEdit,
        status: taskStatus || taskToEdit.status,
        position: taskPosition || taskToEdit.position,
        taskName: taskName || taskToEdit.taskName,
        workspaceId,
        dueDate: dueDate || taskToEdit.dueDate,
      };

      const optimisticTasks = tasks.map((task) => {
        return task._id === taskToEdit._id ? newTaskToEdit : task;
      });

      console.log("optimistic tasks", optimisticTasks);

      localStore.setQuery(api.tasks.get, { workspaceId }, optimisticTasks);
    }
  );

  return editTask;
};
