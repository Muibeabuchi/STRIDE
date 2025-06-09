import { CircleDashed } from "lucide-react";

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
    <div className=" shadow-xs p-1.5 rounded-lg ">
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-x-2">
          {/* icon */}
          <CircleDashed className="size-4" />
          {/* Tsk Status Name */}
          <p className="text-sm text-accent-foreground">{taskStatusName}</p>
        </div>

        <div className="flex items-center gap-x-2">
          {/* Tas Count */}
          <span className="text-muted-foreground">{taskCount}</span>
          {/* Dropdown Menu */}
        </div>
      </div>
    </div>
  );
};

export default CollapsedTaskStatusCard;
