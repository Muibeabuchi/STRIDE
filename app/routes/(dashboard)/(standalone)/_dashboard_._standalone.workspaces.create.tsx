import { CreateWorkspaceForm } from "@/features/workspaces/components/create-workspace-form";
import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/(dashboard)/(standalone)/_dashboard_/_standalone/workspaces/create")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="w-full lg:max-w-xl">
      <Link to="/" className="text-blue-500 hover:underline">
        Home
      </Link>
      <CreateWorkspaceForm />
    </div>
  );
}
