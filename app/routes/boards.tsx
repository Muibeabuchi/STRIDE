import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/boards")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      Hello "/boards"!
      <Outlet />
    </div>
  );
}
