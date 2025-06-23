import { useParams } from "@tanstack/react-router";

export function useProjectId(createTask: boolean) {
  const params = useParams({
    from: "/(dashboard)/_dashboard/workspaces_/$workspaceId/projects/$projectId",
    shouldThrow: false,
  });
  const params1 = useParams({
    from: "/(dashboard)/(standalone)/_dashboard_/_standalone/workspaces/$workspaceId/projects/$projectId/settings",
    shouldThrow: false,
  });

  if (createTask) return null;

  const projectId = (params?.projectId || params1?.projectId) ?? null;

  if (!projectId && createTask) return null;
  // if (!projectId) throw new Error("projectId does not exist");

  return projectId;
}
