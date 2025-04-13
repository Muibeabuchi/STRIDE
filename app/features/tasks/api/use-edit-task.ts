import { api } from "convex/_generated/api";
import { useConvexMutation } from "@convex-dev/react-query";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useEditTask = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: useConvexMutation(api.tasks.edit),
    // onMutate: () => {},
    onSuccess: () => {
      toast.success("Task Edited successfully");
    },
    onError: () => {
      toast.error("Failed to edit Task");
    },
    // onMutate: async (newTodo) => {
    //   // Cancel any outgoing refetches
    //   // (so they don't overwrite our optimistic update)
    //   await queryClient.cancelQueries({ queryKey: ["todos", newTodo.id] });

    //   // Snapshot the previous value
    //   const previousTodo = queryClient.getQueryData(["todos", newTodo.id]);

    //   // Optimistically update to the new value
    //   queryClient.setQueryData(["todos", newTodo.id], newTodo);

    //   // Return a context with the previous and new todo
    //   return { previousTodo, newTodo };
    // },
    // Always refetch after error or success:
    // onSettled: (newTodo) => {
    //   queryClient.invalidateQueries({ queryKey: ["todos", newTodo.id] });
    // },
  });
  return mutation;
};
