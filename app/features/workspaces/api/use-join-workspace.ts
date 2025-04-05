import { api } from "convex/_generated/api";
import { useConvexMutation } from "@convex-dev/react-query";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

export const useJoinWorkspace = () => {
  const mutation = useMutation({
    mutationFn: useConvexMutation(api.workspaces.join),
    onSuccess: () => {
      toast.success("Successfully joined workspace");
    },
    onError: () => {
      toast.error("Failed to join workspace");
    },
  });
  return mutation;
};
