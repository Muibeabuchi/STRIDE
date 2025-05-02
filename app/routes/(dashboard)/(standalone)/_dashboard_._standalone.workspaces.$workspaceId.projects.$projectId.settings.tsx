import { useGetProjectById } from "@/features/projects/api/use-get-projects-by-id";
import { UpdateProjectForm } from "@/features/projects/components/update-project-form";
import ProjectSettingsSkeleton from "@/features/projects/components/update-project-skeleton";
import { createFileRoute } from "@tanstack/react-router";
import { Id } from "convex/_generated/dataModel";

export const Route = createFileRoute(
  "/(dashboard)/(standalone)/_dashboard_/_standalone/workspaces/$workspaceId/projects/$projectId/settings"
)({
  component: RouteComponent,
  params: {
    parse: (params) => {
      return {
        projectId: params.projectId as Id<"projects">,
        workspaceId: params.workspaceId as Id<"workspaces">,
      };
    },
  },
  pendingComponent: () => <p>Loading...</p>,
});

function RouteComponent() {
  const { projectId, workspaceId } = Route.useParams();
  const {
    data: project,
    isLoading,
    isPending,
  } = useGetProjectById({ projectId, workspaceId });

  if (project === undefined || isPending || isLoading) {
    return (
      <div className="w-full lg:max-w-xl">
        <ProjectSettingsSkeleton />;
      </div>
    );
  }
  return (
    <div className="w-full lg:max-w-xl">
      <UpdateProjectForm
        initialValues={{
          ...project,
          projectImage: project.projectImage,
        }}
        projectId={projectId}
        workspaceId={workspaceId}
      />
    </div>
  );
}
