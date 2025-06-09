import { cn } from "@/lib/utils";
import {
  CircleArrowDown,
  CircleArrowRight,
  CircleChevronRight,
} from "lucide-react";
import { useState } from "react";
import CollapsedTaskStatusCard from "./collapsed-task-status-card";

type CollapsedKanbanBoardProps = {
  collapsedStatus: string[];
  noBoards?: boolean;
};

export default function CollapsedKanbanBoard({
  collapsedStatus,
  noBoards,
}: CollapsedKanbanBoardProps) {
  const [showHidden, setShowHidden] = useState(false);

  const handleToggleShowHidden = () => {
    setShowHidden((prev) => !prev);
  };
  return (
    <>
      <div
        className={cn("min-w-[400px] justify-self-end w-[400px]  h-full", {
          "ml-auto": noBoards,
        })}
      >
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
        <div className="flex w-full flex-col gap-y-2">
          {showHidden
            ? collapsedStatus.map((status) => {
                return (
                  <div className={cn("w-full rounded-md")} key={status}>
                    <CollapsedTaskStatusCard
                      onRestore={() => {}}
                      taskCount={5}
                      taskStatusName={status}
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
