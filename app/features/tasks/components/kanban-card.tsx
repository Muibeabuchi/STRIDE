import { PaginatedTasksResponse } from "convex/schema";
import TaskActions from "./task-actions";
import { MoreHorizontalIcon } from "lucide-react";
import { DottedSeparator } from "@/components/doted-separator";
import { MemberAvatar } from "@/features/members/components/member-avatar";
import TaskDate from "./task-date";
import { ProjectAvatar } from "@/features/projects/components/project-avatar";
import { truncateString } from "@/utils/truncate-words";
import { Card } from "@/components/ui/card";
import { TaskPriorityMapper } from "convex/constants";
import { TaskPriorityIconMapper } from "@/lib/constants";
import { StatusCombobox } from "./status-switcher";
import { Id } from "convex/_generated/dataModel";

interface KanbanCardProps {
  task: PaginatedTasksResponse;
  canEditStatus: (assigneeId: Id<"users">) => boolean;
}

const KanbanCard = ({ task, canEditStatus }: KanbanCardProps) => {
  const Icon = TaskPriorityIconMapper[task.priority ?? 0];

  const showStatus = canEditStatus(task.memberUser.user._id);
  return (
    <div className="p-2.5 rounded-lg pb-3  mb-1.5 border border-accent w-full dark:bg-card mr-1.5 bg-[#FAFAFA] shadow-sm space-y-3">
      <div className="flex items-start justify-between gap-x-2">
        <p>{truncateString(task.taskName, 15, 40)}</p>
        <div className="flex gap-x-2 items-center ">
          {showStatus && (
            <StatusCombobox
              taskId={task._id}
              workspaceId={task.workspaceId}
              value={task.status}
              projectId={task.taskProject._id}
            />
          )}
          <TaskActions
            id={task._id}
            workspaceId={task.workspaceId}
            projectId={task.taskProject._id}
          >
            <MoreHorizontalIcon className="size-[18px] stroke-1 shrink-0 text-neutral-700 hover:opacity-75 transition" />
          </TaskActions>
        </div>
      </div>
      {/* <DottedSeparator /> */}
      <div className="flex  items-center gap-x-1.5">
        <MemberAvatar
          name={task.memberUser.user.name}
          fallbackClassname="text-[10px]"
          imageUrl={task.memberUser.user.image}
        />
        <div className="rounded-full bg-neutral-300 size-1 " />
        <TaskDate value={task.dueDate} className="text-xs" />
      </div>
      <div className="flex items-center gap-x-1.5">
        <ProjectAvatar
          name={task.taskProject.projectName}
          fallbackClassName="text-[10px]"
          image={task.taskProject.projectImage}
        />
        <span className="text-xs truncate font-medium">
          {truncateString(task.taskProject.projectName, 3, 15)}
        </span>
        {/* <div className="rounded-full bg-neutral-300 size-1 " /> */}
        <div className="flex items-center gap-x-1.5">
          <span className="text-xs truncate  font-medium">{}</span>
          <Icon className="size-4" />
        </div>
      </div>
    </div>
  );
};

export default KanbanCard;
