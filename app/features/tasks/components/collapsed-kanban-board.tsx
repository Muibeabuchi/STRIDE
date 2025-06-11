import { cn } from "@/lib/utils";
import {
  CircleArrowDown,
  CircleArrowRight,
  CircleChevronRight,
  EyeClosed,
} from "lucide-react";
import { useState } from "react";
import CollapsedTaskStatusCard from "./collapsed-task-status-card";
import { useCollapsedColumn } from "@/hooks/use-collapsed-column";
import { useProjectId } from "@/features/projects/hooks/use-project-id";
import { Id } from "convex/_generated/dataModel";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

type CollapsedKanbanBoardProps = {
  collapsedStatus: {
    statusName: string;
    length: number;
  }[];
  noBoards?: boolean;
  projectId: Id<"projects">;
};

export default function CollapsedKanbanBoard({
  collapsedStatus,
  noBoards,
  projectId,
}: CollapsedKanbanBoardProps) {
  const [showHidden, setShowHidden] = useState(false);

  const handleToggleShowHidden = () => {
    // e.target.preventDefault();
    setShowHidden((prev) => !prev);
  };

  //   const projectId = useProjectId(false);

  const restoreBoard = useCollapsedColumn(
    (state) => state.deleteSingleProjectCollapsedColumn
  );

  const handleRestore = (statusName: string) => {
    restoreBoard({
      projectId,
      columnName: statusName,
    });
  };

  console.log(collapsedStatus);
  return (
    <>
      <div
        className={cn(" justify-self-end min-w-[300px] ", {
          "ml-auto": noBoards,
        })}
      >
        {/* <DropdownMenu> */}
        {/* <DropdownMenuTrigger asChild> */}
        {/* <Button
          variant="outline"
          onClick={handleToggleShowHidden}
          className="size-[40px] rounded-lg "
        >
          <EyeClosed />
        </Button> */}
        {/* <span className="text-xs">Collapsed Columns</span> */}
        {/* </DropdownMenuTrigger> */}
        {/* <DropdownMenuContent align="center" className="w-[250px] p-0">
            <DropdownMenuGroup> */}
        {/* <div className="flex w-full flex-col gap-y-1 p-0">
          {!showHidden
            ? collapsedStatus.map((status) => {
                return (
                  <div
                    className={cn("w-full rounded-md")}
                    key={status.statusName}
                  >
                    <CollapsedTaskStatusCard
                      onRestore={() => handleRestore(status.statusName)}
                      taskCount={status.length}
                      taskStatusName={status.statusName}
                    />
                  </div>
                );
                // <div>collapsed-kanban-board : {status}</div>;
              })
            : null}
        </div> */}
        {/* </DropdownMenuGroup>
          </DropdownMenuContent> */}
        {/* </DropdownMenu> */}
        <div className="w-full mb-4">
          <button
            className="flex items-center justify-start gap-x-2"
            onClick={handleToggleShowHidden}
          >
            {showHidden ? (
              <CircleArrowDown className="size-4" />
            ) : (
              <CircleArrowRight className="size-4" />
            )}
            <span className="text-sm font-medium">Hidden Columns</span>
          </button>
        </div>
        <div className="flex w-full  flex-col gap-y-2">
          {showHidden
            ? collapsedStatus.map((status) => {
                return (
                  <div
                    className={cn("w-full rounded-md")}
                    key={status.statusName}
                  >
                    <CollapsedTaskStatusCard
                      onRestore={() => handleRestore(status.statusName)}
                      taskCount={status.length}
                      taskStatusName={status.statusName}
                    />
                  </div>
                );
                // <div>collapsed-kanban-board : {status}</div>;
              })
            : null}
        </div>
      </div>
    </>
  );
}
