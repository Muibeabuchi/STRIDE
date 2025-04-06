import { api } from "convex/_generated/api";
import { useConvexMutation } from "@convex-dev/react-query";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

export const useCreateProject = () => {
  const mutation = useMutation({
    mutationFn: useConvexMutation(api.projects.create),
    onSuccess: () => {
      toast.success("Project created successfully");
    },
    onError: () => {
      toast.error("Failed to create project");
    },
  });
  return mutation;
};
