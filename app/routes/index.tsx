import { Navigate, createFileRoute } from "@tanstack/react-router";
import { Loader } from "@/components/Loader";

export const Route = createFileRoute("/")({
  component: Home,
  pendingComponent: () => <Loader />,
});

function Home() {
  return <Navigate to="/dashboard" />;
}
