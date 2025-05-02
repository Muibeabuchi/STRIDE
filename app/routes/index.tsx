import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { useGetUserWorkspaces } from "@/features/workspaces/api/use-get-workspaces";
import { Id } from "convex/_generated/dataModel";
import { LogoLoader } from "@/components/Loader";
import { useProtectAuthPage } from "@/hooks/use-protect-auth-page";

export const Route = createFileRoute("/")({
  component: IndexRoute,
});

export function IndexRoute() {
  const navigate = useNavigate();
  const { showAuthContent } = useProtectAuthPage();

  const {
    data: workspaces,
    isError,
    isPending: loadingUserWorkspaces,
  } = useGetUserWorkspaces();

  if (loadingUserWorkspaces) {
    return <LogoLoader />;
  }
  if (isError) {
    return <p>Error loading the users workspaces</p>;
  }
  if (!loadingUserWorkspaces && !isError && workspaces.length === 0) {
    navigate({
      to: "/workspaces/create",
    });
  } else {
    navigate({
      to: "/workspaces/$workspaceId",
      params: {
        workspaceId: workspaces[0]._id,
      },
    });
  }
  if (!showAuthContent) return null;

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
