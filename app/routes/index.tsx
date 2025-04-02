import { useSuspenseQuery } from "@tanstack/react-query";
import { Link, createFileRoute } from "@tanstack/react-router";
import { convexQuery } from "@convex-dev/react-query";
import { api } from "convex/_generated/api";
import { Loader } from "@/components/Loader";
import { Suspense } from "react";
import { boardQueries } from "@/queries";
import { Authenticated, Unauthenticated } from "convex/react";
import {
  SignIn,
  SignInButton,
  SignOutButton,
  SignUpButton,
  UserButton,
  UserProfile,
  useReverification,
} from "@clerk/tanstack-react-start";
import {
  isReverificationCancelledError,
  isClerkAPIResponseError,
} from "@clerk/tanstack-react-start/errors";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

import { GoogleOneTap } from "@clerk/tanstack-react-start";
// import { useReverification, useUser } from '@clerk/clerk-react'

export const Route = createFileRoute("/")({
  component: Home,
  loader: async ({
    context: {
      queryClient,
      // userId
    },
  }) => {
    await queryClient.ensureQueryData(boardQueries.list());
    // return {
    //   userId,
    // };
  },
  pendingComponent: () => <Loader />,
});

function Home() {
  // const userId = Route.useLoaderData().userId;
  // conost {} = useReverification()
  // console.log(userId);

  const confirmConsoleLog = useReverification(
    async (emailAddressId: string) => {
      await new Promise((resolve) => {
        setTimeout(() => {
          console.log(emailAddressId);
          resolve(emailAddressId);
        }, 1000);
      });
    }
  );

  const handleClick = async (emailAddressId: string) => {
    try {
      await confirmConsoleLog(emailAddressId);
    } catch (e) {
      // Handle if user cancels the reverification process
      if (isClerkAPIResponseError(e) && isReverificationCancelledError(e)) {
        toast.error("User cancelled reverification");
        console.error("User cancelled reverification", e);
      }

      // Handle other errors
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(e, null, 2));
    }
  };

  return (
    <div className="p-8 space-y-2">
      <Authenticated>
        {/* <p>Authenticated: {userId}</p> */}
        {/* <UserProfile /> */}
        <div className="flex items-center justify-center gap-6 w-full">
          <UserButton />
          <SignOutButton>Log Out</SignOutButton>
        </div>

        <Button variant={"secondary"} onClick={() => handleClick("test")}>
          Confirm Console Log
        </Button>
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
      <Button variant={"secondary"} onClick={() => handleClick("test")}>
        Confirm Console Log
      </Button>
      Google One Tap
      <GoogleOneTap />
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
