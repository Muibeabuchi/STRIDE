import { api } from "convex/_generated/api";
import { useConvexMutation } from "@convex-dev/react-query";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

export function useResetWorkspaceLink() {
  return useMutation({
    mutationFn: useConvexMutation(api.workspaces.resetInviteLink),
    onSuccess() {
      toast.success("Workspace invite-link has been reset successfully");
    },
    onError() {
      toast.error("Failed to reset invite-link");
    },
  });
}
