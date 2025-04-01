import { useSuspenseQuery } from "@tanstack/react-query";
import {
  Await,
  createFileRoute,
  Link,
  useRouter,
} from "@tanstack/react-router";
import { Suspense, use } from "react";
import { Board } from "@/components/Board";
import { Loader } from "@/components/Loader";
import { boardQueries } from "@/queries";
import { fetchPosts, fetchPostsOnClient, PostType } from "@/utils/posts";

import { ErrorBoundary } from "react-error-boundary";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/boards_/$boardId")({
  component: Home,
  errorComponent: ({ error, reset }) => {
    return (
      <div>
        {error.message}
        <button
          onClick={() => {
            // Reset the router error boundary
            reset();
          }}
        >
          retry
        </button>
      </div>
    );
  },
  pendingComponent: PendingComponent,
  pendingMs: 0,
  pendingMinMs: 1000 * 4,
  // preload: true,

  // errorComponent: () => <NotFound />,
  loader: async ({ params, context: { queryClient } }) => {
    console.log("Triggered only in client side navigation");

    await queryClient.ensureQueryData(boardQueries.detail(params.boardId));
    // await new Promise((resolve) => setTimeout(resolve, 3000));

    // await queryClient.resetQueries();

    // queryClient.prefetchQuery({
    //   queryKey: ["posts"],
    //   queryFn: fetchPosts,
    // });
    // new Promise((resolve) => setTimeout(resolve, 6000)).then(() => {
    // new Promise((resolve) => {
    //   setTimeout(() => {
    //     resolve(queryClient.prefetchQuery(boardQueries.detail(params.boardId)));
    //   }, 5000);
    //   // });
    // });
  },
});

function Home() {
  const { boardId } = Route.useParams();
  console.log("Home Component", Date.now());
  const router = useRouter();
  const { queryClient } = Route.useRouteContext();

  return (
    <div className="p-8 space-y-2">
      <h1 className="text-2xl font-black">Boards</h1>
      <div className="flex gap-2">
        <Button variant={"outline"} onClick={() => router.invalidate()}>
          Invalidate Router
        </Button>
        <Button
          variant={"outline"}
          onClick={() => queryClient.refetchQueries({ queryKey: ["posts"] })}
        >
          Refetch Queries
        </Button>
      </div>
      <Suspense fallback={<Loader />}>
        <Board boardId={boardId} />
      </Suspense>
      <h2 className="text-xl font-bold">Posts</h2>
      <Suspense fallback={<Loader />}>
        <ErrorBoundary fallback={<div>Error</div>}>
          <PostsList />
        </ErrorBoundary>
      </Suspense>
    </div>
  );
}

function PostsList() {
  const { data: posts } = useSuspenseQuery({
    queryKey: ["posts"],
    queryFn: fetchPostsOnClient,
  });

  console.log("PostsList Component", Date.now());
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {posts.map((post: PostType) => (
        <div
          key={post.id}
          className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
            {post.title}
          </h3>
          <p className="text-gray-600 line-clamp-3">{post.body}</p>
          <div className="mt-4">
            <Link to="/posts/$postId" params={{ postId: post.id }}>
              <button className="text-blue-600 hover:text-blue-800 font-medium">
                Read more
              </button>
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}

function PendingComponent() {
  return (
    <div className="p-8 space-y-2">
      <h1 className="text-2xl font-black">
        <Skeleton className="h-8 w-32" />
      </h1>
      <Skeleton className="h-64 w-full rounded-lg" />
      <h2 className="text-xl font-bold">
        <Skeleton className="h-7 w-24" />
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md p-6">
            <Skeleton className="h-6 w-3/4 mb-2" />
            <Skeleton className="h-4 w-full mb-1" />
            <Skeleton className="h-4 w-full mb-1" />
            <Skeleton className="h-4 w-2/3 mb-1" />
            <div className="mt-4">
              <Skeleton className="h-5 w-24" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
