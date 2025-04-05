import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(dashboard)/_dashboard/workspaces/$workspaceId')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_dashboard/workspaces/$workspaceId"!</div>
}
