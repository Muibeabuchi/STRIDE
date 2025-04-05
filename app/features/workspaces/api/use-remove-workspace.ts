import { api } from "convex/_generated/api";
import { useConvexMutation } from "@convex-dev/react-query";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

export const useRemoveWorkspace = () =>
  useMutation({
    mutationFn: useConvexMutation(api.workspaces.remove),
    onSuccess: () => {
      toast.success("Workspace deleted successfully");
    },
    onError: () => {
      toast.error("Failed to delete workspace");
    },
  });
