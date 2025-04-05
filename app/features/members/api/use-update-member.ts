import { api } from "convex/_generated/api";
import { useConvexMutation } from "@convex-dev/react-query";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

export const useUpdateMember = () =>
  useMutation({
    mutationFn: useConvexMutation(api.members.updateRole),
    onSuccess: () => {
      toast.success("Member role updated successfully");
    },
    onError: () => {
      toast.error("Failed to update member");
    },
  });
