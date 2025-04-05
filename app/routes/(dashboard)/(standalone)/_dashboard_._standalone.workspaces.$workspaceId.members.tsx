import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/(dashboard)/(standalone)/_dashboard_/_standalone/workspaces/$workspaceId/members',
)({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div>Hello "/_dashboard_/_standalone/workspaces/$workspaceId/members"!</div>
  )
}
