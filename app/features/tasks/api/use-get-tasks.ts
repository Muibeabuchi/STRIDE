// ? THIS HOOK IS GOING TO ONLY TO BE MOUNTED ON THE HOME PAGE

import { convexQuery } from "@convex-dev/react-query";
import { useSuspenseQuery } from "@tanstack/react-query";
import { api } from "convex/_generated/api";
import { Id } from "convex/_generated/dataModel";
import { useQuery } from "convex-helpers/react/cache";
import { StatusSchemaType } from "../schema";

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
