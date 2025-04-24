import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { Loader } from "@/components/Loader";
import { convexQuery } from "@convex-dev/react-query";
import { api } from "convex/_generated/api";
import { fetchClerkAuth } from "@/utils/auth";
import { useGetUserWorkspaces } from "@/features/workspaces/api/use-get-workspaces";
import { Id } from "convex/_generated/dataModel";

export const Route = createFileRoute("/")({
  beforeLoad: async ({ context: { queryClient, convexQueryClient } }) => {
    const user = await queryClient.ensureQueryData({
      queryKey: ["user"],
      queryFn: async () => {
        const auth = await fetchClerkAuth();
        if (auth?.token) {
          convexQueryClient.serverHttpClient?.setAuth(auth.token);
        }
        return auth;
      },
    });

    // console.log("user", user);
    if (!user) {
      throw redirect({
        to: "/sign-in/$",
      });
    }

    if (!user.userId) {
      throw redirect({
        to: "/sign-in/$",
      });
    }
  },
  loader: async ({ context: { queryClient } }) => {
    const workspaces = await queryClient.ensureQueryData(
      convexQuery(api.workspaces.getUserWorkspaces, {})
    );
    if (!workspaces || workspaces.length === 0) {
      throw redirect({
        to: "/workspaces/create",
      });
    } else {
      throw redirect({
        to: "/workspaces/$workspaceId",
        params: {
          workspaceId: workspaces[0]._id,
        },
      });
    }
  },
});

// add a route coponent to watch and check if the workspace exists

export function useWorkspaceExists(workspaceId?: Id<"workspaces">) {
  // execute the same logic in the loader in this component

  const navigate = useNavigate();

  const { data: workspaces } = useGetUserWorkspaces();

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
}

// hook to check if the workspace exists, if it doesnt, we navihgate to a create workspace page
