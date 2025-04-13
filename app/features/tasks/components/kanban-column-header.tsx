import { snakeCaseToTitleCase } from "@/lib/utils";
import { TaskStatus } from "../schema";
import {
  CircleCheckIcon,
  CircleDashedIcon,
  CircleDotIcon,
  CircleDotDashedIcon,
  CircleIcon,
  PlusIcon,
} from "lucide-react";
import { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { useTaskModalStore } from "@/store/store";

interface KanbanColumnHeaderProps {
  board: TaskStatus;
  taskCount: number;
}

const StatusIconMap: Record<TaskStatus, ReactNode> = {
  [TaskStatus.BACKLOG]: (
    <CircleDashedIcon className="size-[18px] text-pink-400 " />
  ),
  [TaskStatus.TODO]: <CircleIcon className="size-[18px] text-red-400 " />,
  [TaskStatus.IN_PROGRESS]: (
    <CircleDotDashedIcon className="size-[18px] text-yellow-400 " />
  ),
  [TaskStatus.IN_REVIEW]: (
    <CircleDotIcon className="size-[18px] text-blue-400 " />
  ),
  [TaskStatus.DONE]: (
    <CircleCheckIcon className="size-[18px] text-emerald-400 " />
  ),
};

const KanbanColumnHeader = ({ board, taskCount }: KanbanColumnHeaderProps) => {
  const icon = StatusIconMap[board];
  const { open } = useTaskModalStore();

  return (
    <div className="flex px-2 py-1.5 items-center justify-between">
      <div className="flex items-center gap-x-2">
        {icon}
        <h2 className="text-sm font-medium">{snakeCaseToTitleCase(board)}</h2>
        <div className="size-5 flex items-center justify-center rounded-md bg-neutral-200 text-xs text-neutral-700 font-medium   ">
          {taskCount}
        </div>
      </div>
      <Button
        variant={"ghost"}
        onClick={() => open(board)}
        size="icon"
        className="size-5 cursor-pointer hover:bg-accent-foreground"
      >
        <PlusIcon className="size-4 text-neutral-400" />
      </Button>
    </div>
  );
};

export default KanbanColumnHeader;
