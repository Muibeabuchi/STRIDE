import { useParams } from "@tanstack/react-router";

export function useWorkspaceId() {
  const workspaceLayoutWorkspaceId = useParams({
    from: "/(dashboard)/_dashboard/workspaces/$workspaceId",
    shouldThrow: false,
  });
  const ProjectWorkspaceId = useParams({
    from: "/(dashboard)/_dashboard/workspaces_/$workspaceId/projects/$projectId",
    shouldThrow: false,
  });

  const params1 = useParams({
    from: "/(dashboard)/(standalone)/_dashboard_/_standalone/workspaces/$workspaceId/projects/$projectId/settings",
    shouldThrow: false,
  });

  const workspaceId =
    (ProjectWorkspaceId?.workspaceId ||
      workspaceLayoutWorkspaceId?.workspaceId ||
      params1?.workspaceId) ??
    null;

  if (!workspaceId) throw new Error("WorkspaceId does not exist");

  return workspaceId;
}
