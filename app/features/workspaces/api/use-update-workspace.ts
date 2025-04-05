import { api } from "convex/_generated/api";
import { useConvexMutation } from "@convex-dev/react-query";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

export const useUpdateWorkspace = () =>
  useMutation({
    mutationFn: useConvexMutation(api.workspaces.update),
    onSuccess: () => {
      toast.success("Workspace updated successfully");
    },
    onError: () => {
      toast.error("Failed to update workspace");
    },
  });
