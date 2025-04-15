import { getRouteApi, useSearch, useNavigate } from "@tanstack/react-router";
import { StatusSchemaType } from "../schema";

const useTaskFilters = () => {
  // !This API might give some headache
  // ! Should probably switch to "useSearch" and "useNavigate" with a less strict type
  // const { useNavigate, useSearch } = getRouteApi(
  //   "/(dashboard)/_dashboard/workspaces_/$workspaceId/projects/$projectId",

  // );

  const navigate = useNavigate();
  const searchParams1 = useSearch({
    from: "/(dashboard)/_dashboard/workspaces_/$workspaceId/projects/$projectId",
    shouldThrow: false,
  });
  const searchParams2 = useSearch({
    from: "/(dashboard)/_dashboard/workspaces_/$workspaceId/tasks",
    shouldThrow: false,
  });

  const status = searchParams1?.status || searchParams2?.status;
  const assigneeId = searchParams1?.assigneeId || searchParams2?.assigneeId;
  const dueDate = searchParams1?.dueDate || searchParams2?.dueDate;
  const projectId = searchParams1?.projectId || searchParams2?.projectId;
  const taskView = searchParams1?.taskView || searchParams2?.taskView;

  // if (!status || !assigneeId || !dueDate || !projectId || !taskView) {
  //   throw new Error("Task Filter is  mounted in wrong route");
  // }

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
