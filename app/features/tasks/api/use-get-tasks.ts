// ? THIS HOOK IS GOING TO ONLY TO BE MOUNTED ON THE HOME PAGE

import { api } from "convex/_generated/api";
import { Id } from "convex/_generated/dataModel";
import { useQuery } from "convex-helpers/react/cache";

interface useGetTasksProps {
  workspaceId: Id<"workspaces">;
}

export function useGetHomePageTasks({
  workspaceId,
}: {
  workspaceId: Id<"workspaces">;
}) {
  const tasks = useQuery(api.tasks.get, {
    workspaceId,
  });

  return {
    tasks,
    taskIsPending: tasks === undefined,
    taskIsError: tasks === null,
  };
}

// export function useGetHomePageTasks({ workspaceId }: useGetTasksProps) {
//   return useSuspenseQuery(
//     convexQuery(api.tasks.get, {
//       workspaceId,
//       projectId: undefined,
//     })
//   );
// }
