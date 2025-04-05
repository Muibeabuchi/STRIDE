import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/(dashboard)/(standalone)/_dashboard_/_standalone/workspaces/$workspaceId/join/$joinCode',
)({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div>
      Hello "/_dashboard_/_standalone/workspaces/$workspaceId/join/$joinCode"!
    </div>
  )
}
