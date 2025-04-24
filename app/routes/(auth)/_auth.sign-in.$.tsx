import { SignIn } from "@clerk/tanstack-react-start";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(auth)/_auth/sign-in/$")({
  component: Page,
});

function Page() {
  return <SignIn fallbackRedirectUrl={"/"} />;
}
