import { useParams } from "@tanstack/react-router";
import { Id } from "convex/_generated/dataModel";

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
  const params2 = useParams({
    from: "/(dashboard)/_dashboard/workspaces_/$workspaceId/tasks",
    shouldThrow: false,
  });
  const params3 = useParams({
    from: "/(dashboard)/_dashboard/workspaces_/$workspaceId_/tasks_/$taskId",
    shouldThrow: false,
  });

  const workspaceId =
    (ProjectWorkspaceId?.workspaceId ||
      workspaceLayoutWorkspaceId?.workspaceId ||
      params1?.workspaceId ||
      params2?.workspaceId ||
      params3?.workspaceId) ??
    null;

  if (!workspaceId) throw new Error("WorkspaceId does not exist");

  return workspaceId as Id<"workspaces">;
}
