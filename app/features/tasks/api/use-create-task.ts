import { api } from "convex/_generated/api";
import { useConvexMutation } from "@convex-dev/react-query";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

export const useCreateTask = () => {
  const mutation = useMutation({
    mutationFn: useConvexMutation(api.tasks.create),
    onSuccess: () => {
      toast.success("Task created successfully");
    },
    onError: () => {
      toast.error("Failed to create Task");
    },
  });
  return mutation;
};
