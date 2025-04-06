import { api } from "convex/_generated/api";
import { useConvexMutation } from "@convex-dev/react-query";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

export const useRemoveProject = () => {
  const mutation = useMutation({
    mutationFn: useConvexMutation(api.projects.remove),
    onSuccess: () => {
      toast.success("Project removed successfully");
    },
    onError: () => {
      toast.error("Failed to remove project");
    },
  });
  return mutation;
};
