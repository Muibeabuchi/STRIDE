import {
  MembersList,
  MemberListSkeleton,
} from "@/features/workspaces/components/members-list";
import { convexQuery } from "@convex-dev/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { api } from "convex/_generated/api";
import { Id } from "convex/_generated/dataModel";
import { Suspense } from "react";

export const Route = createFileRoute(
  "/(dashboard)/(standalone)/_dashboard_/_standalone/workspaces/$workspaceId/members"
)({
  component: RouteComponent,
  loader: async ({ context, params }) => {
    await context.queryClient.ensureQueryData(
      convexQuery(api.workspaces.getWorkspaceById, {
        workspaceId: params.workspaceId as Id<"workspaces">,
      })
    );
  },
});

function RouteComponent() {
  const params = Route.useParams();
  return (
    <div className={"w-full lg:max-w-xl"}>
      <Suspense fallback={<MemberListSkeleton />}>
        <MembersList workspaceId={params.workspaceId as Id<"workspaces">} />
      </Suspense>
    </div>
  );
}
