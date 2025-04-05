import { useConvexMutation } from "@convex-dev/react-query";
import { useMutation } from "@tanstack/react-query";
import { api } from "convex/_generated/api";
import { toast } from "sonner";

export const useCreateWorkspace = () => {
  const mutation = useMutation({
    mutationFn: useConvexMutation(api.workspaces.create),
    onSuccess: () => {
      toast.success("Workspace created successfully");
    },
    onError: () => {
      toast.error("Failed to create workspace");
    },
  });
  return mutation;
};
