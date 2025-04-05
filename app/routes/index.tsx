import { createFileRoute, redirect } from "@tanstack/react-router";
import { Loader } from "@/components/Loader";
import { convexQuery } from "@convex-dev/react-query";
import { api } from "convex/_generated/api";

export const Route = createFileRoute("/")({
  pendingComponent: () => <Loader />,
  beforeLoad: async ({ context: { userId } }) => {
    if (!userId) {
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
