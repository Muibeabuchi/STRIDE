import {
  createFileRoute,
  Link,
  Outlet,
  redirect,
  useMatch,
} from "@tanstack/react-router";
import { useConvexAuth } from "convex/react";
import { useEffect } from "react";

export const Route = createFileRoute("/(auth)/_auth")({
  component: RouteComponent,
});

function RouteComponent() {
  const { isAuthenticated, isLoading } = useConvexAuth();

  const signInPageMatch = useMatch({
    from: "/(auth)/_auth/sign-in/$",
    shouldThrow: false,
  });
  const signUpPageMatch = useMatch({
    from: "/(auth)/_auth/sign-up/$",
    shouldThrow: false,
  });

  // Todo: Write logic that redirects the user to the index page if they are authenticated
  useEffect(
    function () {
      if (isAuthenticated) {
        redirect({
          to: "/",
        });
      }
    },
    [isAuthenticated]
  );

  return (
    <main className="bg-neutral-100 min-h-screen w-full">
      <div className="mx-auto max-w-screen-2xl p-4 h-full">
        <nav className="flex justify-between items-center ">
          <img src="/logo.svg" alt="logo" width={50} height={50} />
          <>
            {signInPageMatch && (
              <Link to="/sign-up/$" className="font-semibold">
                Sign Up
              </Link>
            )}
            {signUpPageMatch && (
              <Link to="/sign-in/$" className="font-semibold  ">
                Sign In
              </Link>
            )}
          </>
        </nav>
        <div className="flex flex-col items-center justify-center pt-4 md:pt-10">
          <Outlet />
        </div>
      </div>
    </main>
  );
}
