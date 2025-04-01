import { useSuspenseQuery } from "@tanstack/react-query";
import { Await, createFileRoute, Link } from "@tanstack/react-router";
import { Suspense, use } from "react";
import { Board } from "~/components/Board";
import { Loader } from "~/components/Loader";
import { boardQueries } from "~/queries";
import { fetchPosts, fetchPostsOnClient, PostType } from "~/utils/posts";

import { ErrorBoundary } from "react-error-boundary";

export const Route = createFileRoute("/boards_/$boardId")({
  component: Home,
  pendingComponent: () => <div>Loading...</div>,
  // preload: "intent",
  // errorComponent: () => <NotFound />,
  loader: async ({ params, context: { queryClient } }) => {
    const time1 = Date.now();
    queryClient.prefetchQuery({
      queryKey: ["posts"],
      queryFn: fetchPosts,
    });
    await new Promise((resolve) => setTimeout(resolve, 5000));
    await queryClient.ensureQueryData(boardQueries.detail(params.boardId));
    console.log("time taken by loader ", (Date.now() - time1) / 1000);
  },
});

function Home() {
  const { boardId } = Route.useParams();
  console.log("Home Component", Date.now());

  return (
    <div className="p-8 space-y-2">
      <h1 className="text-2xl font-black">Boards</h1>
      <Board boardId={boardId} />
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
    queryFn: fetchPosts,
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
