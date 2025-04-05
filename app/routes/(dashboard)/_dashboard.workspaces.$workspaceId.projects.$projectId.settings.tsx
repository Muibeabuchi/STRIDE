import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/(dashboard)/_dashboard/workspaces/$workspaceId/projects/$projectId/settings',
)({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div>
      Hello "/_dashboard/workspaces/$workspaceId/projects/$projectId/settings"!
    </div>
  )
}
