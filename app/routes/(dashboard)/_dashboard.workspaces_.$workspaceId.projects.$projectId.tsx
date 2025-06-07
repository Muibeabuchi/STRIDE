import { Button } from "@/components/ui/button";
import { useGetProjectById } from "@/features/projects/api/use-get-projects-by-id";
import { ProjectAvatar } from "@/features/projects/components/project-avatar";
import {
  tabSchema,
  TaskViewSwitcher,
} from "@/features/tasks/components/task-view-switcher";
import { convexQuery } from "@convex-dev/react-query";
import { Outlet } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { createFileRoute } from "@tanstack/react-router";
import { api } from "convex/_generated/api";
import { Id } from "convex/_generated/dataModel";
import {
  CalendarDays,
  Cog,
  Columns3,
  Kanban,
  PencilIcon,
  SlidersHorizontal,
  Table,
} from "lucide-react";
import { z } from "zod";
import { zodValidator } from "@tanstack/zod-adapter";
import {
  StatusSchemaType,
  taskViewSearchSchema,
} from "../../features/tasks/schema";
import { Suspense } from "react";
import ProjectAnalytics from "@/features/projects/components/project-analytics";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetMember } from "@/features/members/api/use-get-member";
import { truncateString } from "@/utils/truncate-words";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useIsMobile } from "@/hooks/use-advanced-is-mobile";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FcDisplay } from "react-icons/fc";
import { CustomToolTip } from "@/components/custom-tooltip";
import { cn } from "@/lib/utils";
// import { useIsMobile } from "@/hooks/use-mobile";
// import { truncateWords } from "@/utils/truncate-words";

export const Route = createFileRoute(
  "/(dashboard)/_dashboard/workspaces_/$workspaceId/projects/$projectId"
)({
  validateSearch: zodValidator(taskViewSearchSchema),
  params: {
    parse: (params) => {
      return {
        projectId: params.projectId as Id<"projects">,
        workspaceId: params.workspaceId as Id<"workspaces">,
      };
    },
  },
  loaderDeps: ({ search }) => ({
    ...search,
  }),
  component: RouteComponent,
});

function ProjectInfoSkeleton() {
  return (
    <div className="flex items-center gap-x-2 animate-pulse">
      <Skeleton className="size-8 rounded-md" />
      <Skeleton className="h-6 w-40" />
    </div>
  );
}

function RouteComponent() {
  const { projectId: projId, workspaceId } = Route.useParams();
  const { status, taskView, assigneeId, dueDate, projectId } =
    Route.useSearch();
  const navigate = Route.useNavigate();
  const {
    data: project,
    isLoading,
    isPending,
  } = useGetProjectById({
    projectId: projId,
    workspaceId,
  });

  const isMobile = useIsMobile();

  const { data: workspaceMember, isLoading: isLoadingWorkspaceMember } =
    useGetMember(workspaceId);

  const handleTaskViewChange = (tab: string) => {
    navigate({
      to: ".",
      search: {
        taskView: tabSchema.parse(tab),

        //? What does this change
        projectId: projId,
        // projectId,
      },
    });
  };

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

  return (
    <div className="flex flex-col h-full  gap-y-4 ">
      <Tabs
        // className="flex-1 w-full h-full border rounded-lg"
        defaultValue={taskView}
        value={taskView}
        onValueChange={handleTaskViewChange}
        className="h-full"
      >
        <div className="flex items-center  pb-4 justify-between  ml-10">
          {project === undefined ||
          isLoading ||
          isPending ||
          workspaceMember === undefined ||
          isLoadingWorkspaceMember ? (
            <ProjectInfoSkeleton />
          ) : (
            <div className="flex items-center gap-x-2 ">
              <ProjectAvatar
                name={project.projectName}
                image={project.projectImage}
                className="size-8"
              />
              <p className="text-lg font-semibold">
                {truncateString(project.projectName)}
              </p>
            </div>
          )}

          <div className="flex gap-x-4 h-full items-center">
            {/* dropdown */}
            <DropdownMenu>
              <CustomToolTip content="Display">
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost">
                    <SlidersHorizontal className="size-5" />
                  </Button>
                </DropdownMenuTrigger>
              </CustomToolTip>
              <DropdownMenuContent className="w-auto p-3" align="end">
                <div className="flex gap-x-3 items-center">
                  <DropdownMenuGroup className="flex gap-x-3 items-center">
                    <DropdownMenuItem asChild className="!focus:bg-none">
                      <Button
                        className={cn(
                          " flex-col bg-sidebar-primary !hover:bg-sidebar-primary/70  border   w-40 h-15",
                          {
                            "bg-muted hover:bg-muted-foreground/70":
                              taskView !== "table",
                          }
                        )}
                        onClick={() => handleTaskViewChange("table")}
                      >
                        <Table
                          className={cn("size-5 text-foreground", {
                            "text-white/60 ": taskView !== "kanban",
                          })}
                        />
                        <p
                          className={cn("text-[10px] text-foreground ", {
                            "text-white/60 ": taskView !== "kanban",
                          })}
                        >
                          Table
                        </p>
                      </Button>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>

                  <DropdownMenuGroup className="flex gap-x-3 items-center">
                    <DropdownMenuItem className="!focus:bg-none" asChild>
                      <Button
                        className={cn(
                          " flex-col  border bg-sidebar-primary hover:bg-sidebar-primary/70 w-40 h-15",
                          {
                            "bg-muted  hover:bg-muted-foreground/70":
                              taskView !== "kanban",
                          }
                        )}
                        onClick={() => handleTaskViewChange("kanban")}
                      >
                        <Kanban
                          className={cn("size-5  text-foreground", {
                            "text-white/60 ": taskView !== "table",
                          })}
                        />
                        <p
                          className={cn("text-[10px] text-foreground ", {
                            "text-white/60 ": taskView !== "table",
                          })}
                        >
                          Kanban
                        </p>
                        {/* <p className="text-[10px]  dark:text-foreground text-white">
                      
                    </p> */}
                      </Button>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Todo: Hide this buttonLink for non-admin users */}
            {workspaceMember?.role === "admin" && (
              <CustomToolTip content="Settings">
                <Button size="sm" className="p-0" asChild>
                  <Link
                    to={"/workspaces/$workspaceId/projects/$projectId/settings"}
                    params={{
                      projectId: projId,
                      workspaceId,
                    }}
                    className="flex items-center justify-center "
                  >
                    <Cog className="size-4 " />
                  </Link>
                </Button>
              </CustomToolTip>
            )}
          </div>
        </div>
        {/* Analytics component */}
        {/* <ProjectAnalytics workspaceId={workspaceId} projectId={projId} /> */}

        {/* TabList */}

        <TaskViewSwitcher
          // ? Changing this has what effect?
          projectId={projId}
          workspaceId={workspaceId}
          hideProjectFilter={true}
          status={status}
          assigneeId={assigneeId}
          dueDate={dueDate}
          taskView={taskView}
          onAssigneeIdChange={onAssigneeIdChange}
          onDueDateChange={onDueDateChange}
          onProjectIdChange={onProjectIdChange}
          onStatusChange={onStatusChange}
          handleTaskViewChange={handleTaskViewChange}
        />
        <Outlet />
      </Tabs>
    </div>
  );
}
