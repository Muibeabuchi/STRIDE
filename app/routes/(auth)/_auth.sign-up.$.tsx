import { SignUpCard } from "@/features/auth/components/sign-up-card";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(auth)/_auth/sign-up/$")({
  component: Page,
});

function Page() {
  return <SignUpCard />;
}
