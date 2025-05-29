import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { useGetUserWorkspaces } from "@/features/workspaces/api/use-get-workspaces";
import { Id } from "convex/_generated/dataModel";
import { LogoLoader } from "@/components/Loader";
import { useProtectAuthPage } from "@/hooks/use-protect-auth-page";
import { useEffect } from "react";
import { useLocalStorage } from "usehooks-ts";

export const lastWorkspaceLocalStorageKey = "stride-user-last-workspace";

export const Route = createFileRoute("/")({
  component: IndexRoute,
});

export function IndexRoute() {
  const navigate = useNavigate();
  const { showAuthContent, isAuthenticated } = useProtectAuthPage();
  const [lastWorkspace, setLastWorkspace] = useLocalStorage(
    lastWorkspaceLocalStorageKey,
    ""
  );

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
        // Todo: First check in local storage if there is a value for the last workspace the user visited
        // Todo: If it exists, check if it exists in the user workspaces and  navigate the user to the workspace, else navigate to the first workspace they belong to

        const isLocalStorageWorkspaceValid = workspaces.find(
          (workspace) => workspace._id === lastWorkspace
        );
        const validWorkspace = isLocalStorageWorkspaceValid
          ? (isLocalStorageWorkspaceValid._id as Id<"workspaces">)
          : workspaces[0]._id;
        // const WorkspaceToRedirect = lastWorkspace
        //   ? (lastWorkspace as Id<"workspaces">)
        //   : workspaces[0]._id;

        setLastWorkspace(workspaces[0]._id);

        navigate({
          to: "/workspaces/$workspaceId",
          params: {
            workspaceId: validWorkspace,
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
