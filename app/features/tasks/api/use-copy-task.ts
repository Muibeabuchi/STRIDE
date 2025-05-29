import { api } from "convex/_generated/api";
import { useConvexMutation } from "@convex-dev/react-query";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

export const useCopyTask = () => {
  const mutation = useMutation({
    mutationFn: useConvexMutation(api.tasks.copy),
    onSuccess: () => {
      toast.success("Task Copied successfully");
    },
    onError: () => {
      toast.error("Failed to Copied Task");
    },
  });
  return mutation;
};
