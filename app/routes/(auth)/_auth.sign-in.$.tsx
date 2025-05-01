import { SignInCard } from "@/features/auth/components/sign-in-card";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(auth)/_auth/sign-in/$")({
  component: Page,
});

function Page() {
  return <SignInCard />;
}
