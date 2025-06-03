import { Doc, Id } from "convex/_generated/dataModel";
// import { TaskStatus } from "../schema";
import { PaginatedTasksResponse } from "convex/schema";
import { cn } from "@/lib/utils";
import { MemberAvatar } from "@/features/members/components/member-avatar";
import { ProjectAvatar } from "@/features/projects/components/project-avatar";

interface EventCardProps {
  id: Id<"tasks">;
  title: string;
  assignee: Id<"users">;
  project: PaginatedTasksResponse["taskProject"];
  status: "BACKLOG" | "TODO" | "IN_PROGRESS" | "DONE" | "IN_REVIEW";
  onClick: (
    e: React.MouseEvent<HTMLDivElement>,
    taskId: Id<"tasks">,
    workspaceId: Id<"workspaces">
  ) => void;
}

// const statusColorMap: Record<TaskStatus, string> = {
//   [TaskStatus.BACKLOG]: "border-l-pink-500",
//   [TaskStatus.TODO]: "border-l-red-500",
//   [TaskStatus.IN_PROGRESS]: "border-l-yellow-500",
//   [TaskStatus.IN_REVIEW]: "border-l-blue-500",
//   [TaskStatus.DONE]: "border-l-emerald-500",
// };

const EventCard = ({
  assignee,
  id,
  project,
  status,
  title,
  onClick,
}: EventCardProps) => {
  return (
    <div className="px-2">
      <div
        onClick={(e) => onClick(e, id, project.workspaceId)}
        className={cn(
          "p-1.5 text-sm bg-white text-primary shadow-2xl border-l-6 rounded-md flex flex-col gap-y-1.5 cursor-pointer hover:opacity-75 transition  "
          // statusColorMap[status]
        )}
      >
        <p>{title}</p>
        <div className="flex items-center gap-x-1 ">
          <MemberAvatar name={assignee} />
          <div className="size-1 rounded-full bg-neutral-300"></div>
          <ProjectAvatar
            name={project.projectName}
            image={project.projectImage}
          />
        </div>
      </div>
    </div>
  );
};

export default EventCard;
