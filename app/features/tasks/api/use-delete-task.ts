import { api } from "convex/_generated/api";
import { useConvexMutation } from "@convex-dev/react-query";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

export const useDeleteTask = () => {
  const mutation = useMutation({
    mutationFn: useConvexMutation(api.tasks.remove),
    onSuccess: () => {
      toast.success("Task Removed successfully");
    },
    onError: () => {
      toast.error("Failed to Delete Task");
    },
  });
  return mutation;
};
