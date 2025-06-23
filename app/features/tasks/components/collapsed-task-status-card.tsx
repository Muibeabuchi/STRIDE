import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CircleDashed, Ellipsis } from "lucide-react";

interface CollapsedTaskStatusCardProps {
  taskStatusName: string;
  taskCount: number;
  onRestore: () => void;
}

const CollapsedTaskStatusCard = ({
  onRestore,
  taskCount,
  taskStatusName,
}: CollapsedTaskStatusCardProps) => {
  return (
    <div className=" shadow-xs p-1.5 rounded-lg w-full ">
      <div className="flex items-center justify-between px-4">
        <div className="flex items-center gap-x-2">
          {/* icon */}
          <CircleDashed className="size-4" />
          {/* Tsk Status Name */}
          <p className="text-sm text-accent-foreground">{taskStatusName}</p>
        </div>

        <div className="flex items-center gap-x-3">
          {/* Task Count */}
          <span className="text-muted-foreground text-xs">{taskCount}</span>
          {/* Dropdown Menu */}
          {taskCount > 0 && (
            <DropdownMenu>
              <DropdownMenuTrigger className="cursor-pointer rounded-sm p-0.5 hover:bg-muted">
                <Ellipsis className="size-5" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="p-0 " side="bottom" align="end">
                <DropdownMenuItem className="p-[2.8px] w-full" asChild>
                  <Button
                    variant={"ghost"}
                    className="w-full p-0 h-7"
                    onClick={onRestore}
                  >
                    Show
                  </Button>
                  {/* Show */}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </div>
  );
};

export default CollapsedTaskStatusCard;
