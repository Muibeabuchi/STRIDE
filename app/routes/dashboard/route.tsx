// import { fetchClerkAuth } from "@/utils/auth";
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard")({
  beforeLoad: async ({ context: { userId } }) => {
    // const auth = await fetchClerkAuth();
    // const { userId, token } = auth;

    // // During SSR only (the only time serverHttpClient exists),
    // // set the Clerk auth token to make HTTP queries with.
    // if (token) {
    //   ctx.context.convexQueryClient.serverHttpClient?.setAuth(token);
    // }

    if (!userId) {
      throw redirect({
        to: "/sign-in/$",
      });
    }

    // return {
    //   userId,
    //   token,
    // };
  },
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/dashboard"!</div>;
}
