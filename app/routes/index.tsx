import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { useGetUserWorkspaces } from "@/features/workspaces/api/use-get-workspaces";
import { Id } from "convex/_generated/dataModel";
import { LogoLoader } from "@/components/Loader";
import { useProtectAuthPage } from "@/hooks/use-protect-auth-page";
import { useEffect } from "react";

export const Route = createFileRoute("/")({
  component: IndexRoute,
});

export function IndexRoute() {
  const navigate = useNavigate();
  const { showAuthContent, isAuthenticated } = useProtectAuthPage();

  const {
    data: workspaces,
    isError,
    isPending: loadingUserWorkspaces,
  } = useGetUserWorkspaces(isAuthenticated);

  useEffect(
    function () {
      if (!loadingUserWorkspaces && !isError && workspaces.length === 0) {
        navigate({
          to: "/workspaces/create",
        });
      }
      if (workspaces && workspaces.length > 0) {
        navigate({
          to: "/workspaces/$workspaceId",
          params: {
            workspaceId: workspaces[0]._id,
          },
        });
      }
    },
    [loadingUserWorkspaces, isError, workspaces]
  );

  if (loadingUserWorkspaces) {
    return <LogoLoader />;
  }

  if (!showAuthContent) return null;

  if (workspaces === null || isError) {
    return <p>Error Occured</p>;
  }
  return <LogoLoader />;
}

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
