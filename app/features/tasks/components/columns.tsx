import { Button } from "@/components/ui/button";
import { MemberAvatar } from "@/features/members/components/member-avatar";
import { ProjectAvatar } from "@/features/projects/components/project-avatar";
import { ColumnDef } from "@tanstack/react-table";
import { PaginatedTasksResponse } from "convex/schema";
import { ArrowUpDown, MoreVerticalIcon } from "lucide-react";
import { Row } from "react-day-picker";
import TaskDate from "./task-date";
import { Badge } from "@/components/ui/badge";
import { snakeCaseToTitleCase } from "@/lib/utils";
// import { TaskStatus } from "../schema";
import TaskActions from "./task-actions";
import { truncateString } from "@/utils/truncate-words";

export const columns: ColumnDef<PaginatedTasksResponse>[] = [
  {
    accessorKey: "taskName",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Task Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const name = row.original.taskName;

      return (
        <p className="line-clamp-1 pl-2">{truncateString(name, 10, 30)}</p>
      );
    },
  },
  {
    accessorKey: "projectId",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          // className="ml-3"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Project
          <ArrowUpDown className="ml-2  h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const project = row.original.taskProject;

      return (
        <div className="flex   ml-3  items-center gap-x-2 text-sm font-medium">
          <ProjectAvatar
            name={project.projectName}
            image={project.projectImage}
            className="size-6"
          />
          <p className="line-clamp-1"> {truncateString(project.projectName)}</p>
        </div>
      );
    },
  },

  {
    accessorKey: "dueDate",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Due Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const dueDate = row.original.dueDate;

      return <TaskDate className="pl-3" value={dueDate} />;
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Status
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const status = row.original.status;

      return <Badge className="ml-5">{snakeCaseToTitleCase(status)}</Badge>;
    },
  },
  {
    id: "action",
    cell: ({ row }) => (
      <TaskActions
        id={row.original._id}
        projectId={row.original.taskProject._id}
        workspaceId={row.original.workspaceId}
      >
        <Button variant={"ghost"} className="size-8  p-0">
          <MoreVerticalIcon className="size-4" />
        </Button>
      </TaskActions>
    ),
  },
];
