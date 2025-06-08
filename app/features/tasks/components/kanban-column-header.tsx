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

interface KanbanColumnHeaderProps {
  board: string;
  taskCount: number;
  projectId: Id<"projects">;
}

// const StatusIconMap: Record<TaskStatus, ReactNode> = {
//   [TaskStatus.BACKLOG]: (
//     <CircleDashedIcon className="size-[18px] text-pink-400 " />
//   ),
//   [TaskStatus.TODO]: <CircleIcon className="size-[18px] text-red-400 " />,
//   [TaskStatus.IN_PROGRESS]: (
//     <CircleDotDashedIcon className="size-[18px] text-yellow-400 " />
//   ),
//   [TaskStatus.IN_REVIEW]: (
//     <CircleDotIcon className="size-[18px] text-blue-400 " />
//   ),
//   [TaskStatus.DONE]: (
//     <CircleCheckIcon className="size-[18px] text-emerald-400 " />
//   ),
// };

const KanbanColumnHeader = ({
  projectId,
  taskCount,
  board,
}: KanbanColumnHeaderProps) => {
  // const icon = StatusIconMap[board];
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
    <div className="flex px-2 py-1.5 items-center justify-between">
      <div className="flex items-center gap-x-2">
        {/* {icon} */}
        <h2 className="text-sm font-medium">{snakeCaseToTitleCase(board)}</h2>
        <div className="size-5 flex items-center justify-center border-foreground text-xs border rounded-full font-medium   ">
          {taskCount}
        </div>
      </div>
      <div className="flex items-center gap-x-3">
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
          className="size-5 cursor-pointer hover:bg-accent-foreground"
        >
          <PlusIcon className="size-4 " />
        </Button>
      </div>
    </div>
  );
};

export default KanbanColumnHeader;
