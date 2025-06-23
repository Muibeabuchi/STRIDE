import { Loader as PendingComponent } from "@/components/Loader";
import { UserButton } from "@/components/userButton";
import { useProtectAuthPage } from "@/hooks/use-protect-auth-page";
// import { UserButton } from "@clerk/tanstack-react-start";
import {
  createFileRoute,
  ErrorComponent,
  Link,
  Outlet,
  redirect,
} from "@tanstack/react-router";

export const Route = createFileRoute(
  "/(dashboard)/(standalone)/_dashboard_/_standalone"
)({
  component: StandaloneLayout,
  errorComponent: ErrorComponent,
  pendingComponent: PendingComponent,
});

function StandaloneLayout() {
  const { showAuthContent } = useProtectAuthPage();
  if (!showAuthContent) return null;
  return (
    <main className=" min-h-screen w-full">
      <div className="mx-auto max-w-screen-2xl p-4">
        <nav className="flex items-center justify-between h-[73px]">
          <Link to="/">
            <img src="/logo.svg" alt="logo" width={50} height={50} />
          </Link>
          <UserButton />
        </nav>
        <div className="flex w-full py-4 flex-col justify-center h-full items-center">
          <Outlet />
        </div>
      </div>
    </main>
  );
}
