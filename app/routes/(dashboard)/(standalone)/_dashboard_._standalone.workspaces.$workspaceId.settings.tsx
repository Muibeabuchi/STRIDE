import { UpdateWorkspaceForm } from "@/features/workspaces/components/update-workspace-form";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Id } from "convex/_generated/dataModel";
import useGetWorkSpaceById from "@/features/workspaces/api/use-get-workspace-by-id";
import WorkspaceSettingsSkeleton from "@/features/workspaces/components/update-workspace-form-skeleton";
import { useGetMember } from "@/features/members/api/use-get-member";
import Unauthorized from "@/components/unauthorized";

export const Route = createFileRoute(
  "/(dashboard)/(standalone)/_dashboard_/_standalone/workspaces/$workspaceId/settings"
)({
  notFoundComponent: () => {
    return (
      <div>
        <h2>Not Found</h2>
        <p>Could not find requested resource</p>
        <Link to="/">Return Home</Link>
      </div>
    );
  },
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
  const { workspaceId } = Route.useParams();
  const {
    data: workspace,
    isPending,
    isLoading,
  } = useGetWorkSpaceById(workspaceId);

  const navigate = useNavigate();
  const { data: workspaceMember, isLoading: loadingMember } =
    useGetMember(workspaceId);

  if (
    workspace === undefined ||
    isPending ||
    isLoading ||
    loadingMember ||
    workspaceMember === undefined
  ) {
    return (
      <div className="w-full lg:max-w-xl">
        <WorkspaceSettingsSkeleton />;
      </div>
    );
  }
  if (workspaceMember.role === "member") {
    return (
      <Unauthorized
        showBackButton={false}
        onHomeClick={() =>
          navigate({
            to: "/",
          })
        }
      />
    );
  }

  return (
    <div className="w-full lg:max-w-xl">
      <UpdateWorkspaceForm
        workspaceId={workspaceId as Id<"workspaces">}
        initialValues={{
          ...workspace,
          workspaceImage: workspace.workspaceAvatar,
        }}
      />
    </div>
  );
}
