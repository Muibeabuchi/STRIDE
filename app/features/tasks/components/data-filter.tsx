import { Id } from "convex/_generated/dataModel";
import { useGetTaskFormData } from "./create-task-form-wrapper";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectSeparator,
} from "@/components/ui/select";
import DatePicker from "@/components/date-picker";
import {
  AlertCircle,
  Bug,
  FolderArchiveIcon,
  ListChecksIcon,
  ListFilter,
  ListOrdered,
  UserIcon,
  XIcon,
} from "lucide-react";
import {
  StatusSchema,
  StatusSchemaType,
  // TaskStatus,
  taskViewSearchType,
} from "../schema";
import useTaskFilters from "../hooks/use-task-filters";
import { MemberAvatar } from "@/features/members/components/member-avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { useIsMobile } from "@/hooks/use-advanced-is-mobile";
import { ProjectAvatar } from "@/features/projects/components/project-avatar";
import { TaskPriorityType } from "convex/schema";
import { TaskPriority, TaskPriorityMapper } from "convex/constants";
// import { useIsMobile } from "@/hooks/use-mobile";

export const NO_FILTER_CONSTANT = "no-filter";

interface DataFilterProps {
  hideProjectFilter?: boolean;
  status: StatusSchemaType;
  assigneeId: string | undefined;
  onAssigneeIdChange: (value: string | undefined) => void;
  onProjectIdChange: (value: string | undefined) => void;
  onPriorityChange: (value: TaskPriorityType | undefined) => void;
  projectId: string | undefined;
  dueDate: string | undefined;
  priority: TaskPriorityType | undefined;
  onDueDateChange: (value: string | undefined) => void;
  onStatusChange: (value: StatusSchemaType) => void;
}

const DataFilter = ({
  hideProjectFilter,
  status,
  assigneeId,
  priority,
  onAssigneeIdChange,
  onProjectIdChange,
  projectId,
  dueDate,
  onDueDateChange,
  onPriorityChange,
  onStatusChange,
}: DataFilterProps) => {
  const [projects, members] = useGetTaskFormData();

  const isMobile = useIsMobile(534);
  const hidePriority = useIsMobile(720);

  const isLoading = projects.isPending || members.isPending;

  const error = projects.error || members.error;

  if (projects.isError || members.isError) throw error;
  if (isLoading) return <DataFilterSkeleton />;

  const projectOptions = projects.data.map((project) => ({
    id: project._id,
    name: project.projectName,
    imageUrl: project.projectImage,
  }));
  const memberOptions = members.data.map((member) => ({
    id: member.userId,
    name: member.userName,
    imageUrl: member.userImage,
  }));

  const projectTaskStatus = projects.data[0]?.projectTaskStatus;

  return (
    <div className="flex flex-row gap-2 flex-wrap md:flex-nowrap w-full  md:w-fit items-center">
      <Select
        defaultValue={status || "ALL"}
        value={status}
        onValueChange={(value) => {
          try {
            const parsedStatus = StatusSchema.parse(value);
            onStatusChange(parsedStatus);
          } catch (error) {
            return;
          }
        }}
      >
        <SelectTrigger className="w-full lg:w-auto h-8">
          <div className="flex pr-2 items-center">
            <ListChecksIcon className="size-4 mr-2" />
            {
              <SelectValue
                placeholder="All Status"
                className="hidden lg:flex"
              />
            }
          </div>
        </SelectTrigger>
        {projectTaskStatus === null ? null : (
          <SelectContent>
            <SelectItem value={"ALL"}>ALL</SelectItem>
            <SelectSeparator />
            {/*TODO: Fix this Later after migrations */}
            {projectTaskStatus?.map((status) => (
              <SelectItem key={status.issueName} value={status.issueName}>
                {status.issueName}
              </SelectItem>
            ))}
          </SelectContent>
        )}
      </Select>

      <Select
        defaultValue={assigneeId || "All"}
        value={assigneeId || "All"}
        onValueChange={onAssigneeIdChange}
      >
        <SelectTrigger className="w-full lg:w-auto h-8">
          <div className="flex pr-2 items-center">
            <UserIcon className="size-4 mr-2" />
            {<SelectValue placeholder="All Assignees" />}
          </div>
        </SelectTrigger>
        <SelectContent>
          <SelectItem key={"All-Assignees"} value={"All"}>
            All Assignees
          </SelectItem>
          <SelectSeparator />
          {memberOptions.map((member) => {
            return (
              <SelectItem key={member.id} value={member.id}>
                <div className="flex items-center gap-x-2">
                  <MemberAvatar
                    name={member.name}
                    className="size-6"
                    imageUrl={member.imageUrl}
                  />
                  {member.name}
                </div>
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>

      <Select
        defaultValue={NO_FILTER_CONSTANT}
        value={priority?.toLocaleString()}
        onValueChange={(value) => {
          const priority =
            value === NO_FILTER_CONSTANT
              ? undefined
              : (Number(value) as TaskPriorityType);
          onPriorityChange(priority);
        }}
      >
        <SelectTrigger className="w-full lg:w-auto h-8">
          <div className="flex pr-2 items-center">
            <ListFilter className="size-4 mr-2" />
            {<SelectValue placeholder="Priority" />}
            {/* <SelectValue placeholder="Priority" /> */}
          </div>
        </SelectTrigger>
        <SelectContent>
          <SelectItem key={NO_FILTER_CONSTANT} value={NO_FILTER_CONSTANT}>
            NO FILTERS
          </SelectItem>
          <SelectSeparator />
          {/* <SelectItem key={"All-Assignees"} value={"All"}>
            All Assignees
          </SelectItem> */}
          {/* <SelectSeparator /> */}
          {TaskPriority.map((priority) => {
            return (
              <SelectItem key={priority} value={priority.toLocaleString()}>
                <div className="flex items-center gap-x-2">
                  {/* <MemberAvatar
                    name={priority.name}
                    className="size-6"
                    imageUrl={priority.imageUrl}
                  /> */}
                  {TaskPriorityMapper[priority]}
                </div>
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>

      {!hideProjectFilter && (
        <Select
          defaultValue={projectId || "All"}
          value={projectId || "All"}
          onValueChange={onProjectIdChange}
        >
          <SelectTrigger className=" lg:w-auto w-fit h-8">
            <div className="flex pr-2 items-center w-auto">
              <FolderArchiveIcon className="size-4 mr-2" />
              {isMobile && <SelectValue placeholder="All Projects" />}
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem key={"All-Projects"} value={"All"}>
              All Projects
            </SelectItem>
            <SelectSeparator />
            {projectOptions.map((project) => {
              return (
                <SelectItem key={project.id} value={project.id}>
                  <div className="flex items-center gap-x-2">
                    <ProjectAvatar name={project.name} className="size-6" />
                    {project.name}
                  </div>
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
      )}
      <div className="relative">
        <DatePicker
          value={dueDate ? new Date(dueDate) : undefined}
          onChange={(date) => {
            onDueDateChange(date ? date.toISOString() : undefined);
          }}
          className="h-8 w-full lg:w-auto"
          placeholder="Due Date"
          create={false}
        />
        {dueDate && (
          <XIcon
            className="size-4 p-0.5 absolute -top-1 -right-2 border border-muted-foreground    rounded-full"
            onClick={() => onDueDateChange(undefined)}
          />
        )}
      </div>
    </div>
  );
};

export default DataFilter;

export const DataFilterSkeleton = () => {
  return (
    <div className="flex flex-col lg:flex-row gap-2">
      {/* Status Filter Skeleton */}
      <div className="w-full lg:w-auto h-8 relative bg-muted rounded-md flex items-center px-3">
        <ListChecksIcon className="size-4 mr-2 text-muted-foreground" />
        <Skeleton className="h-4 w-24" />
        <div className="ml-auto">
          <Skeleton className="h-4 w-4" />
        </div>
      </div>

      {/* Assignee Filter Skeleton */}
      <div className="w-full lg:w-auto h-8 relative bg-muted rounded-md flex items-center px-3">
        <UserIcon className="size-4 mr-2 text-muted-foreground" />
        <Skeleton className="h-4 w-24" />
        <div className="ml-auto">
          <Skeleton className="h-4 w-4" />
        </div>
      </div>

      {/* Project Filter Skeleton - Only shown if not hidden */}
      <div className="w-full lg:w-auto h-8 relative bg-muted rounded-md flex items-center px-3">
        <FolderArchiveIcon className="size-4 mr-2 text-muted-foreground" />
        <Skeleton className="h-4 w-24" />
        <div className="ml-auto">
          <Skeleton className="h-4 w-4" />
        </div>
      </div>

      {/* Date Picker Skeleton */}
      <div className="w-full lg:w-auto h-8 relative bg-muted rounded-md flex items-center px-3">
        <Skeleton className="h-4 w-24" />
        <div className="ml-auto">
          <Skeleton className="h-4 w-4" />
        </div>
      </div>
    </div>
  );
};
