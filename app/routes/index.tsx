import { createFileRoute, redirect } from "@tanstack/react-router";
import { Loader } from "@/components/Loader";
import { convexQuery } from "@convex-dev/react-query";
import { api } from "convex/_generated/api";
import { fetchClerkAuth } from "@/utils/auth";

export const Route = createFileRoute("/")({
  beforeLoad: async ({ context: { queryClient, convexQueryClient } }) => {
    const user:
      | {
          userId: string | null;
          token: string | null;
        }
      | undefined = await queryClient.getQueryData(["user"]);

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
