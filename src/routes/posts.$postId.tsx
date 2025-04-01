import { Await, createFileRoute, Link } from "@tanstack/react-router";
import { Suspense, use } from "react";
import { fetchSinglePost } from "~/utils/posts";

export const Route = createFileRoute("/posts/$postId")({
  component: RouteComponent,
  loader: ({ params: { postId } }) => {
    const postItem = fetchSinglePost(Number(postId));
    return {
      postItem,
    };
  },
  staleTime: 1_000_000,
  gcTime: Infinity,
});

function RouteComponent() {
  const postId = Route.useParams().postId;
  return (
    <div>
      Welcome to the single Post Page {postId}
      <Suspense fallback={<p>Loading....</p>}>
        <TestSuspense />
      </Suspense>
    </div>
  );
}

function TestSuspense() {
  const postItem = Route.useLoaderData().postItem;
  const postItemData = use(postItem);

  return (
    <div className="p-8 space-y-6">
      <div className="flex gap-4">
        <Link
          to="/boards/$boardId"
          params={{ boardId: "1" }}
          className="text-blue-600 hover:text-blue-800 font-medium"
        >
          ← Back to Posts
        </Link>
        <Link
          to="/users"
          className="text-blue-600 hover:text-blue-800 font-medium"
        >
          View All Users
        </Link>
        <Link
          to="/users/$userId"
          params={{ userId: postItemData.userId }}
          className="text-blue-600 hover:text-blue-800 font-medium"
        >
          View Author
        </Link>
      </div>

      <article className="bg-white rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          {postItemData.title}
        </h1>
        <p className="text-gray-600 text-lg leading-relaxed">
          {postItemData.body}
        </p>
        <div className="mt-6 text-sm text-gray-500">
          Post ID: {postItemData.id}
          <br />
          Author ID: {postItemData.userId}
        </div>
      </article>
    </div>
  );
}
