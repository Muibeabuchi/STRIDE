import { useQuery } from "convex/react";
import { useRef } from "react";
import { useGetTasks } from "./use-get-tasks";
import { Id } from "convex/_generated/dataModel";
import { StatusSchemaType } from "../schema";
import { TaskPriorityType } from "convex/schema";

export const useStableTasks = ({
  workspaceId,
  status = undefined,
  assigneeId,
  projectId,
  dueDate,
  priority,
}: {
  priority: TaskPriorityType | undefined;
  workspaceId: Id<"workspaces">;
  status?: StatusSchemaType;
  assigneeId?: Id<"users">;
  projectId?: Id<"projects">;
  dueDate?: string;
}) => {
  const { tasks } = useGetTasks({
    workspaceId,
    status,
    assigneeId: assigneeId as Id<"users">,
    projectId: projectId as Id<"projects">,
    dueDate,
    priority,
  });

  const stored = useRef(tasks);

  if (tasks !== undefined) {
    stored.current = tasks;
  }
  //   if (tasks === undefined) {
  //     return <TaskViewSwitcherSkeleton />;
  //   }
  return stored.current;
};
