import { snakeCaseToTitleCase } from "@/lib/utils";
import {
  CircleCheckIcon,
  CircleDashedIcon,
  CircleDotIcon,
  CircleDotDashedIcon,
  CircleIcon,
  PlusIcon,
  Eclipse,
  Ellipsis,
  X,
  TriangleAlert,
} from "lucide-react";
import { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { useTaskModalStore } from "@/store/store";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Id } from "convex/_generated/dataModel";
import { useCollapsedColumn } from "@/hooks/use-collapsed-column";
import { toast } from "sonner";
import { TaskPriorityType } from "convex/schema";
import { TaskType, TaskTypeStrict } from "convex/constants";

interface KanbanColumnHeaderProps {
  board: string;
  taskCount: number;
  projectId: Id<"projects">;
}

const StatusIconMap: Record<TaskTypeStrict, ReactNode> = {
  BACKLOG: <CircleDashedIcon className="size-[18px] text-pink-400 " />,
  TODO: <CircleIcon className="size-[18px] text-red-400 " />,
  IN_REVIEW: <CircleDotDashedIcon className="size-[18px] text-yellow-400 " />,
  DONE: <CircleCheckIcon className="size-[18px] text-emerald-400 " />,
  IN_PROGRESS: <CircleDotIcon className="size-[18px] text-blue-400 " />,
  SUSPENDED: <TriangleAlert className="size-[18px] text-emerald-400 " />,
  CANCELLED: <X className="size-[18px] " />,
};

const KanbanColumnHeader = ({
  projectId,
  taskCount,
  board,
}: KanbanColumnHeaderProps) => {
  const Icon = StatusIconMap[board as TaskTypeStrict];
  const { open } = useTaskModalStore();
  const addCollapsedColumn = useCollapsedColumn(
    (state) => state.addCollapsedColumn
  );

  function handleAddToCollapsedColumn({
    ColumnProjectId,
    columnName,
  }: {
    ColumnProjectId: Id<"projects">;
    columnName: string;
  }) {
    const value = addCollapsedColumn({
      projectId: ColumnProjectId,
      columnName,
    });
    if (value === null) {
      // ! Temporary code for error handling
      toast.error("Column Name already exists for this project");
    }
  }

  return (
    <div className="flex px-2 py-1.5 items-center justify-between ">
      <div className="flex items-center gap-x-2">
        {Icon}
        <h2 className="text-sm font-medium">{snakeCaseToTitleCase(board)}</h2>
        <div className="size-5 flex items-center justify-center border-foreground text-xs border rounded-full font-medium   ">
          {taskCount}
        </div>
      </div>
      <div className=" items-center gap-x-3  flex   ">
        <DropdownMenu>
          <DropdownMenuTrigger className="cursor-pointer  p-1 rounded-lg hover:bg-accent">
            <Ellipsis className="size-4 " />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="start">
            <DropdownMenuItem
              // onClick={() => open(board)}
              onClick={() =>
                handleAddToCollapsedColumn({
                  columnName: board,
                  ColumnProjectId: projectId,
                })
              }
              className="cursor-pointer hover:bg-muted"
            >
              Hide Column
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button
          variant={"ghost"}
          onClick={() => open(board)}
          size="icon"
          className="size-5 cursor-pointer  hover:bg-accent-foreground "
        >
          <PlusIcon className="size-4 " />
        </Button>
      </div>
    </div>
  );
};

export default KanbanColumnHeader;
