import { PlusIcon, CalendarIcon, SettingsIcon } from "lucide-react";
import { PaginatedTasksResponse } from "convex/schema";

import { Button } from "@/components/ui/button";
import { DottedSeparator } from "@/components/doted-separator";

import { TaskStatus } from "../schema";
import { Link } from "@tanstack/react-router";
import { Card, CardContent } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";
import { Id } from "convex/_generated/dataModel";
import { useGetHomePageTasks } from "../api/use-get-tasks";
import { useTaskModalStore } from "@/store/store";
// import { useGetTasks } from "../hooks/use-get-tasks";
interface TaskListProps {
  workspaceId: Id<"workspaces">;
}

const TaskList = ({ workspaceId }: TaskListProps) => {
  const { tasks: homeTasks } = useGetHomePageTasks({ workspaceId });
  // const { tasks: homeTasks } = useGetTasks({
  //   workspaceId,
  //   projectId: undefined,
  // });
  const { open } = useTaskModalStore();

  if (homeTasks === undefined) return null;

  if (homeTasks === null) return <p>Error loading tasks</p>;

  return (
    <div className="flex flex-col gap-y-4 col-span-1">
      <div className="bg-muted rounded-lg p-4">
        <div className="flex items-center justify-between">
          <p className="text-lg font-semibold">Tasks ({homeTasks.length})</p>
          <Button variant={"muted"} size="icon" onClick={() => open("ALL")}>
            <PlusIcon className="size-4 text-neutral-400" />
          </Button>
        </div>

        <DottedSeparator className="my-4" />

        <ul className="flex flex-col gap-y-4">
          {homeTasks.slice(0, 4).map((task) => (
            <li key={task._id}>
              <Link
                to="/workspaces/$workspaceId/tasks/$taskId"
                params={{
                  taskId: task._id,
                  workspaceId: task.workspaceId,
                }}
              >
                <Card className="shadow-none rounded-lg hover:opacity-75 transition">
                  <CardContent className="p-4">
                    <p className="truncate text-lg font-medium">
                      {task.taskName}
                    </p>
                    <div className="flex items-center gap-x-4">
                      <p>{task.taskProject.projectName}</p>
                      <div className="rounded-full size-1 bg-neutral-300 " />
                      <div className="text-sm text-muted-foreground flex items-center">
                        <CalendarIcon className="size-3 mr-2 " />
                        <span className="truncate">
                          {formatDistanceToNow(task.dueDate)}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </li>
          ))}

          <li className="text-sm  text-muted-foreground text-center hidden first-of-type:block">
            No Tasks Found
          </li>
        </ul>
        {homeTasks.length > 0 && (
          <Button variant={"muted"} className="mt-4 w-full" asChild>
            <Link
              to="/workspaces/$workspaceId/tasks"
              params={{
                workspaceId,
              }}
            >
              Show All
            </Link>
          </Button>
        )}
      </div>
    </div>
  );
};

export default TaskList;
