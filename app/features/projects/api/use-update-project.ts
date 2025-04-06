import { api } from "convex/_generated/api";
import { useConvexMutation } from "@convex-dev/react-query";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

export const useUpdateProject = () => {
  const mutation = useMutation({
    mutationFn: useConvexMutation(api.projects.update),
    onSuccess: () => {
      toast.success("Project updated successfully");
    },
    onError: () => {
      toast.error("Failed to update project");
    },
  });
  return mutation;
};
