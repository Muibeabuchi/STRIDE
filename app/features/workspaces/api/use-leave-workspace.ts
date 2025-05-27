import { api } from "convex/_generated/api";
import { useConvexMutation } from "@convex-dev/react-query";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

export const useLeaveWorkspace = () =>
  useMutation({
    mutationFn: useConvexMutation(api.workspaces.leave),
    onSuccess: () => {
      toast.success("You Successfully left the workspace");
    },
    onError: () => {
      toast.error("Failed to Leave workspace");
    },
  });
