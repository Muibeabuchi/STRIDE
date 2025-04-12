import { api } from "convex/_generated/api";
import { useConvexMutation } from "@convex-dev/react-query";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

export const useEditTask = () => {
  const mutation = useMutation({
    mutationFn: useConvexMutation(api.tasks.edit),
    onSuccess: () => {
      toast.success("Task Edited successfully");
    },
    onError: () => {
      toast.error("Failed to edit Task");
    },
  });
  return mutation;
};
