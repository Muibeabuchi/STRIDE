import { api } from "convex/_generated/api";
import { useConvexMutation } from "@convex-dev/react-query";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

export const useDeleteMember = () =>
  useMutation({
    mutationFn: useConvexMutation(api.members.remove),
    onSuccess: () => {
      toast.success("Member removed successfully ");
    },
    onError: () => {
      toast.error("Failed to remove member");
    },
  });
