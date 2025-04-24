import { Loader as PendingComponent } from "@/components/Loader";
import { UserButton } from "@/components/userButton";
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
  beforeLoad: async ({ context: { queryClient } }) => {
    const user:
      | {
          userId: string | null;
          token: string | null;
        }
      | undefined = await queryClient.getQueryData(["user"]);

    if (!user || !user.userId) {
      return redirect({
        to: "/sign-in/$",
      });
    }
  },
});

function StandaloneLayout() {
  return (
    <main className="bg-neutral-100 min-h-screen ">
      <div className="mx-auto max-w-screen-2xl p-4">
        <nav className="flex items-center justify-between h-[73px]">
          <Link to="/">
            <img src="/logo.svg" alt="logo" width={50} height={50} />
          </Link>
          <UserButton />
        </nav>
        <div className="flex py-4 flex-col justify-center h-full items-center">
          <Outlet />
        </div>
      </div>
    </main>
  );
}
