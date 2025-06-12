import React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import {
  Clock,
  Circle,
  AlertCircle,
  CheckCircle2,
  X,
  Copy,
} from "lucide-react";
import {
  EDIT_TASK_POSITION_ON_SERVER_SIGNAL,
  TaskTypeStrict,
} from "convex/constants";
import { useEditTask } from "../api/use-edit-task";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { Id } from "convex/_generated/dataModel";

interface StatusOption {
  value: TaskTypeStrict;
  label: string;
  icon: React.ReactNode;
  color: string;
  count?: number;
}

interface StatusComboboxProps {
  value?: string;
  placeholder?: string;
  className?: string;
  taskId: Id<"tasks">;
  workspaceId: Id<"workspaces">;
  projectId: Id<"projects">;
}

const statusOptions: StatusOption[] = [
  {
    value: "BACKLOG",
    label: "Backlog",
    icon: <Clock className="h-4 w-4 text-gray-400" />,
    color: "text-gray-600",
    count: 1,
  },
  {
    value: "TODO",
    label: "Todo",
    icon: <Circle className="h-4 w-4 text-gray-400" />,
    color: "text-gray-600",
    count: 2,
  },
  {
    value: "IN_PROGRESS",
    label: "In Progress",
    icon: <AlertCircle className="h-4 w-4 text-yellow-500" />,
    color: "text-gray-900",
    count: 3,
  },
  {
    value: "DONE",
    label: "Done",
    icon: <CheckCircle2 className="h-4 w-4 text-blue-500" />,
    color: "text-gray-900",
    count: 4,
  },
  {
    value: "CANCELLED",
    label: "Canceled",
    icon: <X className="h-4 w-4 text-gray-400" />,
    color: "text-gray-600",
    count: 5,
  },
  {
    value: "IN_REVIEW",
    label: "In Review",
    icon: <Copy className="h-4 w-4 text-gray-400" />,
    color: "text-gray-600",
    count: 6,
  },
];

export const StatusCombobox = ({
  value,
  placeholder = "Search status...",
  className,
  taskId,
  workspaceId,
  projectId,
}: StatusComboboxProps) => {
  const [open, setOpen] = React.useState(false);

  const selectedOption = statusOptions.find((option) => option.value === value);
  // const taskStatus = selectedOption ?  value

  const editTask = useEditTask();

  const handleEditTaskStatus = async (status: string) => {
    // console.log(status);
    await editTask({
      workspaceId,
      taskId,
      taskStatus: status,
      taskPosition: EDIT_TASK_POSITION_ON_SERVER_SIGNAL,
      projectId,
      //   values.status === initialValues.status
      //     ? initialValues.position
      //     : EDIT_TASK_POSITION_ON_SERVER_SIGNAL,
    });
    setOpen(false);
  };
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            " w-fit py-0.5 px-2   gap-0 justify-between flex items-center cursor-pointer",
            className
          )}
        >
          {selectedOption ? (
            <div className="flex items-center gap-1">
              {selectedOption.icon}
              {/* <span className={selectedOption.color}>
                {selectedOption.label}
              </span> */}
            </div>
          ) : (
            <span className="text-gray-500">Change status...</span>
          )}
          {/* <ChevronsUpD/>own className="ml-2 size-3.5 h-4 w-4 shrink-0 opacity-50" /> */}
        </Button>
      </PopoverTrigger>

      <PopoverContent
        className="w-full min-w-[280px] p-0 bg-white border border-gray-200 shadow-lg"
        align="start"
      >
        <Command className="w-full">
          <div className="px-3 py-2 text-sm text-gray-500 border-b border-gray-100">
            Change status...
          </div>

          <CommandInput
            placeholder={placeholder}
            className="border-0 focus:ring-0 focus:border-0"
          />

          <CommandList>
            <CommandEmpty className="py-6 text-center text-sm text-gray-500">
              No status found.
            </CommandEmpty>

            <CommandGroup>
              {statusOptions.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.value}
                  onSelect={(currentValue) => {
                    if (currentValue === value) return;
                    if (!currentValue) return;
                    // const newValue = currentValue === value
                    handleEditTaskStatus(currentValue);
                    // onValueChange?.(newValue);
                    // setOpen(false);
                  }}
                  className="flex items-center justify-between px-3 py-2 hover:bg-gray-50 cursor-pointer aria-selected:bg-gray-50"
                >
                  <div className="flex items-center gap-3 flex-1">
                    {option.icon}
                    <span className={`${option.color} font-medium`}>
                      {option.label}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {value === option.value && (
                      <Check className="h-4 w-4 text-green-500" />
                    )}
                    {option.count && (
                      <Badge
                        variant="secondary"
                        className="text-xs bg-gray-100 text-gray-600 hover:bg-gray-100"
                      >
                        {option.count}
                      </Badge>
                    )}
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

// Alternative version with search keywords for better search functionality
// export const EnhancedStatusCombobox: React.FC<StatusComboboxProps> = ({
//   value = "in-progress",
//   onValueChange,
//   placeholder = "Search status...",
//   className,
// }) => {
//   const [open, setOpen] = React.useState(false);

//   const selectedOption = statusOptions.find((option) => option.value === value);

//   // Enhanced options with search keywords
//   const enhancedOptions = statusOptions.map((option) => ({
//     ...option,
//     searchValue: `${option.label} ${option.value}`.toLowerCase(),
//   }));

//   return (
//     <Popover open={open} onOpenChange={setOpen}>
//       <PopoverTrigger asChild>
//         <Button
//           variant="outline"
//           role="combobox"
//           aria-expanded={open}
//           className={cn(
//             "w-full max-w-xs justify-between border-gray-200 bg-white hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-transparent",
//             className
//           )}
//         >
//           {selectedOption ? (
//             <div className="flex items-center gap-2">
//               {selectedOption.icon}
//               <span className={selectedOption.color}>
//                 {selectedOption.label}
//               </span>
//             </div>
//           ) : (
//             <span className="text-gray-500">Change status...</span>
//           )}
//           <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
//         </Button>
//       </PopoverTrigger>

//       <PopoverContent
//         className="w-full min-w-[280px] p-0 bg-white border border-gray-200 shadow-lg"
//         align="start"
//       >
//         <Command className="w-full">
//           <div className="px-3 py-2 text-sm text-gray-500 border-b border-gray-100">
//             Change status...
//           </div>

//           <CommandInput
//             placeholder={placeholder}
//             className="border-0 focus:ring-0 focus:border-0"
//           />

//           <CommandList>
//             <CommandEmpty className="py-6 text-center text-sm text-gray-500">
//               No status found.
//             </CommandEmpty>

//             <CommandGroup>
//               {enhancedOptions.map((option) => (
//                 <CommandItem
//                   key={option.value}
//                   value={option.searchValue}
//                   onSelect={() => {
//                     onValueChange?.(option.value);
//                     setOpen(false);
//                   }}
//                   className="flex items-center justify-between px-3 py-2 hover:bg-gray-50 cursor-pointer aria-selected:bg-gray-50"
//                 >
//                   <div className="flex items-center gap-3 flex-1">
//                     {option.icon}
//                     <span className={`${option.color} font-medium`}>
//                       {option.label}
//                     </span>
//                   </div>

//                   <div className="flex items-center gap-2">
//                     {option.count && (
//                       <Badge
//                         variant="secondary"
//                         className="text-xs bg-gray-100 text-gray-600 hover:bg-gray-100"
//                       >
//                         {option.count}
//                       </Badge>
//                     )}
//                     {value === option.value && (
//                       <Check className="h-4 w-4 text-green-500" />
//                     )}
//                   </div>
//                 </CommandItem>
//               ))}
//             </CommandGroup>
//           </CommandList>
//         </Command>
//       </PopoverContent>
//     </Popover>
//   );
// };
