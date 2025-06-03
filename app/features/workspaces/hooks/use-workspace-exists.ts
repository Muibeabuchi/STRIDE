import { useNavigate } from "@tanstack/react-router";
import { Id } from "convex/_generated/dataModel";
import { useGetUserWorkspaces } from "../api/use-get-workspaces";

export const useWorkspaceExists = (workspaceId: Id<"workspaces">) => {
  const navigate = useNavigate();

  const { data: workspaces, isPending } = useGetUserWorkspaces();

  if (isPending || workspaces == undefined) {
    return null;
  }
  if (!workspaces || workspaces.length === 0) {
    navigate({
      to: "/workspaces/create",
    });
  } else {
    navigate({
      to: "/workspaces/$workspaceId",
      params: {
        workspaceId: workspaceId || workspaces[0]._id,
      },
    });
  }
};
