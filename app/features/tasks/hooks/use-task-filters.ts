import { getRouteApi } from "@tanstack/react-router";
import { StatusSchemaType } from "../schema";

const useTaskFilters = () => {
  // !This API might give some headache
  // ! Should probably switch to "useSearch" and "useNavigate" with a less strict type
  const { useNavigate, useSearch } = getRouteApi(
    "/(dashboard)/_dashboard/workspaces_/$workspaceId/projects/$projectId"
  );
  const navigate = useNavigate();
  const { status, assigneeId, projectId, dueDate, taskView } = useSearch();

  const onStatusChange = (value: StatusSchemaType) => {
    navigate({
      to: ".",
      search: (search) => ({
        ...search,
        status: value,
      }),
    });
  };

  const onAssigneeIdChange = (value: string | undefined) => {
    navigate({
      to: ".",
      search: (search) => ({
        ...search,
        assigneeId: value === "All" ? undefined : value,
      }),
    });
  };

  const onProjectIdChange = (value: string | undefined) => {
    navigate({
      to: ".",
      search: (search) => ({
        ...search,
        projectId: value === "All" ? undefined : value,
      }),
    });
  };

  const onDueDateChange = (value: string | undefined) => {
    navigate({
      to: ".",
      search: (search) => ({
        ...search,
        dueDate: value,
      }),
    });
  };

  return {
    taskView,
    status,
    onStatusChange,
    assigneeId,
    onAssigneeIdChange,
    projectId,
    onProjectIdChange,
    dueDate,
    onDueDateChange,
  };
};

export default useTaskFilters;
