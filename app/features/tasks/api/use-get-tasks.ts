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
  status = undefined,
  assigneeId,
  projectId,
  dueDate,
}: {
  workspaceId: Id<"workspaces">;
  status?: StatusSchemaType;
  assigneeId?: Id<"users">;
  projectId?: Id<"projects">;
  dueDate?: string;
}) {
  const tasks = useQuery(api.tasks.get, {
    workspaceId,
    status: status === "ALL" ? undefined : status,
    assigneeId: assigneeId,
    projectId: projectId,
    dueDate,
  });

  return {
    tasks,
    taskIsPending: tasks === undefined,
    taskIsError: tasks === null,
  };
  // return useSuspenseQuery(
  //   convexQuery(api.tasks.get, {
  //     workspaceId,
  //     status: status === "ALL" ? undefined : status,
  //     assigneeId: assigneeId as Id<"users"> | undefined,
  //     projectId: projectId as Id<"projects"> | undefined,
  //     dueDate,
  //   })
  // );
}

// export function useGetHomePageTasks({ workspaceId }: useGetTasksProps) {
//   return useSuspenseQuery(
//     convexQuery(api.tasks.get, {
//       workspaceId,
//       projectId: undefined,
//     })
//   );
// }
