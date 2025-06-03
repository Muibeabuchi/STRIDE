import { DottedSeparator } from "@/components/doted-separator";
import { Button } from "@/components/ui/button";
import { Doc } from "convex/_generated/dataModel";
import { PencilIcon } from "lucide-react";
import OverviewProperty from "./overview-property";
import { MemberAvatar } from "@/features/members/components/member-avatar";
import { getTaskByIdResponse } from "convex/schema";
import TaskDate from "./task-date";
import { Badge } from "@/components/ui/badge";
import { snakeCaseToTitleCase } from "@/lib/utils";
// import { TaskStatus } from "../schema";
import { useEditTask } from "../api/use-edit-task";
import { useEditTaskModalStore } from "@/store/store";

interface TaskOverviewProps {
  task: getTaskByIdResponse;
}

const TaskOverview = ({ task }: TaskOverviewProps) => {
  const { openEditTaskModal } = useEditTaskModalStore();
  return (
    <div className="flex flex-col gap-y-4 col-span-1">
      <div className="bg-muted p-4 rounded-lg">
        <div className="flex items-center justify-between">
          <p className="text-lg font-semibold">Overview</p>
          <Button
            size={"sm"}
            onClick={() => openEditTaskModal(task._id)}
            variant={"secondary"}
          >
            <PencilIcon className="size-4 mr-2" />
            Edit
          </Button>
        </div>
        <DottedSeparator className="my-4 " />
        <div className="flex flex-col gap-y-4">
          <OverviewProperty label="Assignee">
            <MemberAvatar name={task.assignee.name} className="size-6" />
            <p className="text-sm font-medium">{task.assignee.name}</p>
          </OverviewProperty>
          <OverviewProperty label="Due Date">
            <TaskDate value={task.dueDate} className="text-sm font-medium" />
          </OverviewProperty>
          <OverviewProperty label="Due Date">
            <Badge>{snakeCaseToTitleCase(task.status)}</Badge>
          </OverviewProperty>
        </div>
      </div>
    </div>
  );
};

export default TaskOverview;
