import { cn } from "@/lib/utils";
import {
  CircleArrowDown,
  CircleArrowRight,
  CircleChevronRight,
} from "lucide-react";
import { useState } from "react";
import CollapsedTaskStatusCard from "./collapsed-task-status-card";
import { useCollapsedColumn } from "@/hooks/use-collapsed-column";
import { useProjectId } from "@/features/projects/hooks/use-project-id";
import { Id } from "convex/_generated/dataModel";

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
