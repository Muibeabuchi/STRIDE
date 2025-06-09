import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format, isAfter, isBefore, startOfDay } from "date-fns";
import { useState } from "react";

export interface CardUser {
  id: string;
  name: string;
  avatar?: string;
}

export interface CardLabel {
  id: string;
  name: string;
  color: "orange" | "blue" | "red" | "green" | "purple" | "yellow";
}

export type CardPriority = "urgent" | "high" | "medium" | "low";
export type CardStatus =
  | "backlog"
  | "todo"
  | "in-progress"
  | "done"
  | "canceled";

export interface Card {
  id: string;
  identifier: string;
  title: string;
  status: CardStatus;
  priority?: CardPriority;
  assignee?: CardUser;
  labels?: CardLabel[];
  dueDate?: string;
  hasSubtasks?: boolean;
  subtaskCount?: number;
  completedSubtasks?: number;
  estimatePoints?: number;
}

interface CardPriorityIconProps {
  priority: CardPriority;
  className?: string;
}

export const CardPriorityIcon: React.FC<CardPriorityIconProps> = ({
  priority,
  className = "",
}) => {
  const getIconColor = () => {
    switch (priority) {
      case "urgent":
        return "text-red-500";
      case "high":
        return "text-orange-500";
      case "medium":
        return "text-yellow-500";
      case "low":
        return "text-slate-400";
      default:
        return "text-slate-400";
    }
  };

  return (
    <div className={`flex items-center justify-center w-4 h-4 ${className}`}>
      <div className={`w-2 h-2 rounded-full ${getIconColor()}`}>
        <svg viewBox="0 0 8 8" className="w-full h-full fill-current">
          <circle cx="4" cy="4" r="4" />
        </svg>
      </div>
    </div>
  );
};

// export  CardPriorityIcon;

interface CardLabelProps {
  label: CardLabel;
  size?: "sm" | "md";
}

export const CardLabelComponent: React.FC<CardLabelProps> = ({
  label,
  size = "sm",
}) => {
  const getColorClasses = (color: CardLabel["color"]) => {
    const colorMap = {
      orange: "bg-orange-100 text-orange-700 border-orange-200",
      blue: "bg-blue-100 text-blue-700 border-blue-200",
      red: "bg-red-100 text-red-700 border-red-200",
      green: "bg-green-100 text-green-700 border-green-200",
      purple: "bg-purple-100 text-purple-700 border-purple-200",
      yellow: "bg-yellow-100 text-yellow-700 border-yellow-200",
    };
    return colorMap[color];
  };

  const sizeClasses =
    size === "sm" ? "px-1.5 py-0.5 text-xs" : "px-2 py-1 text-sm";

  return (
    <span
      className={`
        inline-flex items-center rounded border font-medium
        ${getColorClasses(label.color)}
        ${sizeClasses}
      `}
    >
      {label.name}
    </span>
  );
};

// export default CardLabel;

interface CardAssigneeProps {
  user: CardUser;
  size?: "sm" | "md";
}

export const CardAssignee: React.FC<CardAssigneeProps> = ({
  user,
  size = "sm",
}) => {
  const sizeClasses = size === "sm" ? "h-5 w-5" : "h-6 w-6";

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Avatar className={sizeClasses}>
      {user.avatar ? (
        <AvatarImage src={user.avatar} alt={user.name} />
      ) : (
        <AvatarFallback className="text-xs">
          {getInitials(user.name)}
        </AvatarFallback>
      )}
    </Avatar>
  );
};

// export default CardAssignee;

interface CardSubtasksProps {
  subtaskCount: number;
  completedSubtasks: number;
}

export const CardSubtasks: React.FC<CardSubtasksProps> = ({
  subtaskCount,
  completedSubtasks,
}) => {
  return (
    <div className="flex items-center space-x-1 text-xs text-slate-500">
      <svg
        className="w-3 h-3"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
        />
      </svg>
      <span>
        {completedSubtasks}/{subtaskCount}
      </span>
    </div>
  );
};

// export default CardSubtasks;

interface CardEstimateProps {
  points: number;
}

export const CardEstimate: React.FC<CardEstimateProps> = ({ points }) => {
  return (
    <div className="flex items-center space-x-1 text-xs text-slate-500">
      <svg
        className="w-3 h-3"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M13 10V3L4 14h7v7l9-11h-7z"
        />
      </svg>
      <span>{points}</span>
    </div>
  );
};

// export default CardEstimate;

interface CardDueDateProps {
  dueDate: string;
}

export const CardDueDate: React.FC<CardDueDateProps> = ({ dueDate }) => {
  const date = new Date(dueDate);
  const today = startOfDay(new Date());
  const isOverdue = isBefore(date, today);
  const isDueToday = format(date, "yyyy-MM-dd") === format(today, "yyyy-MM-dd");

  const getDateColor = () => {
    if (isOverdue) return "text-red-600 bg-red-50";
    if (isDueToday) return "text-orange-600 bg-orange-50";
    return "text-slate-500 bg-slate-50";
  };

  return (
    <div
      className={`inline-flex items-center space-x-1 px-1.5 py-0.5 rounded text-xs ${getDateColor()}`}
    >
      <svg
        className="w-3 h-3"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
        />
      </svg>
      <span>{format(date, "MMM d")}</span>
    </div>
  );
};

// export default CardDueDate;

interface KanbanCardProps {
  card: Card;
  onCardClick?: (card: Card) => void;
  onCardUpdate?: (cardId: string, updates: Partial<Card>) => void;
}

const AdvancedKanbanCard: React.FC<KanbanCardProps> = ({
  card,
  onCardClick,
  onCardUpdate,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const handleCardClick = () => {
    onCardClick?.(card);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleCardClick();
    }
  };

  return (
    <div
      className={`
        group relative bg-white border border-slate-200 rounded-md p-3 
        cursor-pointer transition-all duration-200 ease-in-out
        hover:border-slate-300 hover:shadow-sm
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1
        ${isDragging ? "shadow-lg scale-105 rotate-2" : ""}
        ${isHovered ? "shadow-sm" : ""}
      `}
      onClick={handleCardClick}
      onKeyDown={handleKeyDown}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      tabIndex={0}
      role="button"
      aria-label={`Open card ${card.identifier}: ${card.title}`}
      draggable
      onDragStart={() => setIsDragging(true)}
      onDragEnd={() => setIsDragging(false)}
    >
      {/* Card Header */}
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center space-x-2">
          {card.priority && <CardPriorityIcon priority={card.priority} />}
          <span className="text-xs font-medium text-slate-500 tracking-wide">
            {card.identifier}
          </span>
        </div>

        {/* Card Actions (visible on hover) */}
        <div
          className={`
          flex items-center space-x-1 transition-opacity duration-200
          ${isHovered ? "opacity-100" : "opacity-0"}
        `}
        >
          <button
            className="p-1 rounded hover:bg-slate-100 text-slate-400 hover:text-slate-600"
            onClick={(e) => {
              e.stopPropagation();
              // Handle card menu
            }}
            aria-label="Card options"
          >
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Card Title */}
      <h3 className="text-sm font-medium text-slate-900 leading-5 mb-3 line-clamp-2">
        {card.title}
      </h3>

      {/* Card Labels */}
      {card.labels && card.labels.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {card.labels.map((label) => (
            <CardLabelComponent key={label.id} label={label} />
          ))}
        </div>
      )}

      {/* Card Footer */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {card.hasSubtasks && card.subtaskCount && (
            <CardSubtasks
              subtaskCount={card.subtaskCount}
              completedSubtasks={card.completedSubtasks || 0}
            />
          )}

          {card.estimatePoints && <CardEstimate points={card.estimatePoints} />}

          {card.dueDate && <CardDueDate dueDate={card.dueDate} />}
        </div>

        {card.assignee && <CardAssignee user={card.assignee} />}
      </div>

      {/* Mobile touch indicator */}
      <div className="sm:hidden absolute inset-0 bg-transparent" />
    </div>
  );
};

export default AdvancedKanbanCard;
