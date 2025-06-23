import { useGetMember } from "@/features/members/api/use-get-member";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { Routes } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "./ui/sidebar";

function Navigation() {
  const [routes, setRoutes] = useState(Routes);
  const workspaceId = useWorkspaceId();
  const { data: workspaceMember, isLoading } = useGetMember(workspaceId);

  useEffect(
    function () {
      if (workspaceMember?.role === "member") {
        // TODO: Fix the typescript error
        // @ts-expect-error
        setRoutes((routes) =>
          routes.filter((route) => route.to !== "/settings")
        );
      } else {
        setRoutes(Routes);
      }
    },
    [workspaceMember?.role]
  );

  if (isLoading) {
    return null;
  }

  return (
    <SidebarMenu>
      {/* <SidebarMenuItem className=""> */}
      {routes.map(({ FilledIcon, Icon, label, to }) => {
        const fullHref = `/workspaces/${workspaceId}${to}`;

        return (
          <Link
            key={label}
            to={fullHref}
            activeOptions={{ exact: true, includeSearch: false }}
            // search={(search) => ({
            //   ...search,
            //   taskView: "kanban",
            // })}
            className="cursor-pointer flex flex-col gap-y-2"
          >
            {({ isActive }) => {
              return (
                <div
                  // tooltip={label}
                  className={cn(
                    "flex items-center gap-2.5 p-2.5  cursor-pointer  font-medium transition rounded-md ",
                    isActive &&
                      "shadow-sm text-background hover:text-background hover:bg-primary bg-primary  "
                  )}
                >
                  {isActive ? (
                    <FilledIcon className="size-5" />
                  ) : (
                    <Icon className="size-5 " />
                  )}
                  {label}
                </div>
              );
            }}
          </Link>
        );
      })}
      {/* </SidebarMenuItem> */}
    </SidebarMenu>
  );
}

export default Navigation;
