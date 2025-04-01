import { Await, createFileRoute, Link } from "@tanstack/react-router";
import { Suspense, use } from "react";
import { fetchSinglePost, fetchSinglePostOnServer } from "@/utils/posts";
import { Loader } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export const Route = createFileRoute("/posts/$postId")({
  component: RouteComponent,
  pendingComponent: () => <TestSuspenseSkeleton />,

  loader: async ({ params: { postId } }) => {
    const postItem = fetchSinglePostOnServer({ data: postId });
    return {
      postItem,
    };
  },
  staleTime: 100_000_000,
  // staleTime: 1_000_000,
  // gcTime: Infinity,
});

function SinglePostSkeleton() {
  return (
    <div>
      <div className="p-8 space-y-6">
        <div className="flex gap-4">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-6 w-32" />
        </div>

        <article className="bg-white rounded-lg shadow-md p-8">
          <Skeleton className="h-10 w-3/4 mb-4" />
          <div className="space-y-2">
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-3/4" />
          </div>
          <div className="mt-6 space-y-1">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-32" />
          </div>
        </article>
      </div>
    </div>
  );
}

function RouteComponent() {
  const postId = Route.useParams().postId;
  return (
    <div>
      Welcome to the single Post Page {postId}
      <Suspense fallback={<TestSuspenseSkeleton />}>
        <TestSuspense />
      </Suspense>
    </div>
  );
}
function TestSuspenseSkeleton() {
  return (
    <div className="p-8 space-y-6">
      <div className="flex gap-4">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-6 w-32" />
      </div>

      <article className="bg-white rounded-lg shadow-md p-8">
        <Skeleton className="h-10 w-3/4 mb-4" />
        <div className="space-y-2">
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-3/4" />
        </div>
        <div className="mt-6 space-y-1">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-32" />
        </div>
      </article>
    </div>
  );
}

function TestSuspense() {
  const postItem = Route.useLoaderData().postItem;
  const postItemData = use(postItem);

  return (
    // <Await
    //   promise={postItem}
    //   fallback={<Loader className="w-10 h-10 animate-spin" />}
    // >
    //   {(postItemData) => (
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
    //   )}
    // </Await>
  );
}
