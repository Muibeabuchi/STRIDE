import { useSuspenseQuery } from "@tanstack/react-query";
import { Link, createFileRoute } from "@tanstack/react-router";
import { convexQuery } from "@convex-dev/react-query";
import { api } from "convex/_generated/api";
import { Loader } from "~/components/Loader";
import { Suspense } from "react";
import { boardQueries } from "~/queries";
import { Authenticated, Unauthenticated } from "convex/react";
import {
  SignIn,
  SignInButton,
  SignOutButton,
  SignUpButton,
  UserButton,
  UserProfile,
} from "@clerk/tanstack-react-start";

export const Route = createFileRoute("/")({
  component: Home,
  loader: async ({ context: { queryClient, userId } }) => {
    await queryClient.ensureQueryData(boardQueries.list());
    return {
      userId,
    };
  },
  pendingComponent: () => <Loader />,
});

function Home() {
  const userId = Route.useLoaderData().userId;

  console.log(userId);
  return (
    <div className="p-8 space-y-2">
      <Authenticated>
        <p>Authenticated: {userId}</p>
        {/* <UserProfile /> */}
        <div className="flex items-center justify-center gap-6 w-full">
          <UserButton />
          <SignOutButton>Log Out</SignOutButton>
        </div>
      </Authenticated>

      <Unauthenticated>
        <div className="flex items-center justify-center gap-4">
          <SignInButton>Sign In</SignInButton>
          <SignUpButton>Register</SignUpButton>
        </div>
      </Unauthenticated>

      <h1 className="text-2xl font-black">Boards</h1>
      <ul className="flex flex-wrap list-disc">
        <Suspense fallback={<Loader />}>
          <BoardList />
        </Suspense>
      </ul>
    </div>
  );
}

function BoardList() {
  const boardsQuery = useSuspenseQuery(convexQuery(api.board.getBoards, {}));

  return (
    <ul className="flex flex-wrap list-disc">
      {boardsQuery.data.map((board) => (
        <li key={board.id} className="ml-4">
          <Link
            to="/boards/$boardId"
            params={{
              boardId: board.id,
            }}
            className="font-bold text-blue-500"
          >
            {board.name}
          </Link>
        </li>
      ))}
    </ul>
  );
}
