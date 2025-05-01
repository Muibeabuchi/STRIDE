import { MembersList } from "@/features/workspaces/components/members-list";
import { createFileRoute } from "@tanstack/react-router";
import { Id } from "convex/_generated/dataModel";

export const Route = createFileRoute(
  "/(dashboard)/(standalone)/_dashboard_/_standalone/workspaces/$workspaceId/members"
)({
  params: {
    parse: (params) => {
      return {
        workspaceId: params.workspaceId as Id<"workspaces">,
      };
    },
  },
  component: RouteComponent,
});

function RouteComponent() {
  const params = Route.useParams();
  return (
    <div className={"w-full lg:max-w-xl"}>
      <MembersList workspaceId={params.workspaceId} />
    </div>
  );
}
