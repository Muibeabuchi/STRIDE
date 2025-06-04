import {
  ChevronDown,
  ChevronUp,
  Eye,
  EyeClosedIcon,
  EyeIcon,
  Plus,
  PlusCircle,
  Search,
  SearchCheck,
  SearchCode,
  SearchSlash,
} from "lucide-react";
import { useGetWorkspaceProjects } from "@/features/projects/api/use-get-projects";
import { cn } from "@/lib/utils";
import { useCreateProjectModal } from "@/features/projects/hooks/use-create-project-modal";
import { ProjectAvatar } from "@/features/projects/components/project-avatar";
import { Link, useNavigate, useParams } from "@tanstack/react-router";
import { Skeleton } from "@/components/ui/skeleton";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { Button } from "./ui/button";
import { useState } from "react";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "./ui/sidebar";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./ui/command";
import { Id } from "convex/_generated/dataModel";
import { useProjectId } from "@/features/projects/hooks/use-project-id";
import { FaEye, FaRegEye } from "react-icons/fa";
import { CustomToolTip } from "./custom-tooltip";
import { truncateString } from "@/utils/truncate-words";

const Projects = () => {
  // ? INVESTIGATE THE ROUTE OF THIS HOOK

  const workspaceId = useWorkspaceId();
  const projectId = useProjectId(false);
  const { open } = useCreateProjectModal();
  const { data: projects } = useGetWorkspaceProjects(workspaceId);

  const [openPopover, setOpenPopover] = useState(false);
  const navigate = useNavigate();

  const quickProjects = projects?.filter(
    (project) => project._id !== projectId
  );

  // Add functionality where the current project will always be at the top of the projects side menu items
  const activeSelectedProject = projects?.find(
    (project) => project._id === projectId
  );

  const numberOfRenderedProjects = activeSelectedProject ? 2 : 3;
  const renderedProjects = quickProjects?.slice(0, numberOfRenderedProjects);

  return (
    <SidebarGroup className=" relative ">
      <SidebarGroupLabel className="flex  mb-2 items-center justify-between text-xs font-medium text-muted-foreground uppercase tracking-wider px-2">
        Projects
        <div className="flex items-center gap-1">
          <CustomToolTip content="New">
            <PlusCircle
              onClick={open}
              className="size-5 cursor-pointer hover:opacity-75 transition"
            />
          </CustomToolTip>
          <Popover
            open={openPopover}
            modal={true}
            onOpenChange={setOpenPopover}
          >
            <CustomToolTip content="Search">
              <PopoverTrigger asChild>
                <Search
                  onClick={() => setOpenPopover(true)}
                  className="size-5 cursor-pointer hover:opacity-75 transition"
                />
              </PopoverTrigger>
            </CustomToolTip>

            <PopoverContent className="p-0" side="right" align="end">
              <Command>
                <CommandInput placeholder="Search Your Projects" />
                <CommandList>
                  <CommandEmpty>No results found.</CommandEmpty>
                  <CommandGroup>
                    {projects?.map((project) => (
                      <CommandItem
                        key={project._id}
                        value={project._id}
                        onSelect={(value) => {
                          navigate({
                            to: "/workspaces/$workspaceId/projects/$projectId",
                            params: {
                              workspaceId,
                              projectId: value as Id<"projects">,
                            },
                            //  activeOptions={ exact: true, includeSearch: false },
                            search: (search) => ({
                              ...search,
                              projectId: project._id,
                            }),
                          });
                          setOpenPopover(false);
                        }}
                      >
                        {truncateString(project.projectName)}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
      </SidebarGroupLabel>
      <SidebarMenu className=" flex flex-col gap-y-2">
        {projects && projects.length > 0 ? (
          <>
            {activeSelectedProject && (
              <Link
                key={activeSelectedProject._id}
                to={"/workspaces/$workspaceId/projects/$projectId"}
                params={{
                  projectId: activeSelectedProject._id,
                  workspaceId,
                }}
                activeOptions={{ exact: true, includeSearch: false }}
                search={(search) => ({
                  ...search,
                  projectId: activeSelectedProject._id,
                })}
              >
                {({ isActive }) => {
                  return (
                    <SidebarMenuItem>
                      <SidebarMenuButton
                        tooltip={activeSelectedProject.projectName}
                        className={cn(
                          "flex items-center gap-2.5 p-2.5 rounded-md  transition cursor-pointer ",
                          isActive &&
                            "text-background hover:text-background hover:bg-primary bg-primary shadow-sm"
                        )}
                      >
                        <ProjectAvatar
                          image={activeSelectedProject.projectImage}
                          name={activeSelectedProject.projectName}
                          className=""
                        />
                        <span className="truncate">
                          {activeSelectedProject.projectName}
                        </span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                }}
              </Link>
            )}
            {renderedProjects?.map((project) => {
              return (
                <Link
                  key={project._id}
                  to={"/workspaces/$workspaceId/projects/$projectId"}
                  params={{
                    projectId: project._id,
                    workspaceId,
                  }}
                  activeOptions={{ exact: true, includeSearch: false }}
                  search={(search) => ({
                    ...search,
                    projectId: project._id,
                  })}
                >
                  {({ isActive }) => {
                    return (
                      <SidebarMenuItem>
                        <SidebarMenuButton
                          tooltip={project.projectName}
                          className={cn(
                            "flex items-center gap-2.5 p-2.5 rounded-md  transition cursor-pointer ",
                            isActive &&
                              "text-background hover:text-background hover:bg-primary bg-primary shadow-sm"
                          )}
                        >
                          <ProjectAvatar
                            image={project.projectImage}
                            name={project.projectName}
                            className=""
                          />
                          <span className="truncate">
                            {project.projectName}
                          </span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  }}
                </Link>
              );
            })}
          </>
        ) : (
          // Todo: Change this component UI
          <div className="flex flex-col items-center justify-center p-4 text-center text-neutral-500 rounded-md bg-neutral-50 mt-2">
            <p className="text-sm">No projects found</p>
            <p className="text-xs mt-1">
              Click the + icon to create your first project
            </p>
          </div>
        )}

        {/* Popover to open Command box to search for Projects */}
      </SidebarMenu>
    </SidebarGroup>
  );
};

export const ProjectsSkeleton = () => {
  return (
    <div className="flex flex-col gap-y-2">
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="size-5 rounded-full" />
      </div>
      {Array.from({ length: 3 }).map((_, index) => (
        <div key={index} className="flex items-center gap-2.5 p-2.5 rounded-md">
          <Skeleton className="size-8 rounded-full" />
          <Skeleton className="h-4 w-32" />
        </div>
      ))}
    </div>
  );
};

export default Projects;
