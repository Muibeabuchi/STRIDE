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
import { ListChecksIcon } from "lucide-react";
import { StatusSchema, TaskStatus } from "../schema";
import useTaskFilters from "../hooks/use-task-filters";

interface DataFilterProps {
  hideProjectFilter?: boolean;
  workspaceId: Id<"workspaces">;
}

const DataFilter = ({ hideProjectFilter, workspaceId }: DataFilterProps) => {
  const response = useGetTaskFormData();
  const { onStatusChange, status } = useTaskFilters();

  const [projects, members] = response;

  const isLoading = projects.isPending || members.isPending;

  const error = projects.error || members.error;

  if (projects.isError || members.isError) throw error;
  if (isLoading) return <p>Loading...</p>;

  const projectOptions = projects.data.map((project) => ({
    id: project._id,
    name: project.projectName,
    imageUrl: project.projectImage,
  }));
  const memberOptions = members.data.map((member) => ({
    id: member.userId,
    name: member.userName,
  }));

  return (
    <div className="flex flex-col lg:flex-row gap-2">
      <Select
        defaultValue={status || "ALL"}
        value={status}
        onValueChange={(value) => {
          try {
            const parsedStatus = StatusSchema.parse(value);
            onStatusChange(parsedStatus);
          } catch (error) {
            console.error(
              "Error parsing the value of status from the select component"
            );
          }
        }}
      >
        <SelectTrigger className="w-full lg:w-auto h-8">
          <div className="flex pr-2 items-center">
            <ListChecksIcon className="size-4 mr-2" />
            <SelectValue placeholder="All Statuses" />
          </div>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="ALL">All Statuses</SelectItem>
          <SelectSeparator />
          <SelectItem value={TaskStatus.BACKLOG}>BACKLOG</SelectItem>
          <SelectItem value={TaskStatus.DONE}>DONE</SelectItem>
          <SelectItem value={TaskStatus.IN_PROGRESS}>IN PROGRESS</SelectItem>
          <SelectItem value={TaskStatus.IN_REVIEW}>IN REVIEW</SelectItem>
          <SelectItem value={TaskStatus.TODO}>TODO</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default DataFilter;
