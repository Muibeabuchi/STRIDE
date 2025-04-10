import { getRouteApi } from "@tanstack/react-router";
import { StatusSchemaType } from "../schema";

const useTaskFilters = () => {
  const { useNavigate, useSearch } = getRouteApi(
    "/(dashboard)/_dashboard/workspaces_/$workspaceId/projects/$projectId"
  );
  const navigate = useNavigate();
  const { status } = useSearch();

  console.log(status);

  const onStatusChange = (value: StatusSchemaType) => {
    navigate({
      to: ".",
      search: (search) => ({
        ...search,
        status: value,
      }),
    });
  };

  return {
    status,
    onStatusChange,
  };
};

export default useTaskFilters;
