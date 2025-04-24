import { SignUp } from "@clerk/tanstack-react-start";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(auth)/_auth/sign-up/$")({
  component: Page,
});

function Page() {
  return <SignUp fallbackRedirectUrl={"/"} />;
}
