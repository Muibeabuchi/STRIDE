import { PlusCircle } from "lucide-react";
import { useGetWorkspaceProjects } from "@/features/projects/api/use-get-projects";
import { cn } from "@/lib/utils";
import { useCreateProjectModal } from "@/features/projects/hooks/use-create-project-modal";
import { ProjectAvatar } from "@/features/projects/components/project-avatar";
import { Link, useParams } from "@tanstack/react-router";
import { Skeleton } from "@/components/ui/skeleton";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";

const Projects = () => {
  // ? INVESTIGATE THE ROUTE OF THIS HOOK

  const workspaceId = useWorkspaceId();
  const { open } = useCreateProjectModal();

  const { data: projects } = useGetWorkspaceProjects(workspaceId);

  return (
    <div className="flex flex-col gap-y-2">
      <div className="flex items-center justify-between">
        <p className="text-xs uppercase text-neutral-500">Projects</p>
        <PlusCircle
          onClick={open}
          className="size-5 text-neutral-500 cursor-pointer hover:opacity-75 transition"
        />
      </div>
      {projects && projects.length > 0 ? (
        projects.map((project) => {
          const href = `/workspaces/${workspaceId}/projects/${project._id}`;
          return (
            <Link key={project._id} to={href} activeOptions={{ exact: true }}>
              {({ isActive }) => {
                return (
                  <div
                    className={cn(
                      "flex items-center gap-2.5 p-2.5 rounded-md hover:opacity-75 transition cursor-pointer text-neutral-500",
                      isActive &&
                        "bg-white shadow-sm hover:opacity-100 text-primary"
                    )}
                  >
                    <ProjectAvatar
                      image={project.projectImage}
                      name={project.projectName}
                      className=""
                    />
                    <span className="truncate">{project.projectName}</span>
                  </div>
                );
              }}
            </Link>
          );
        })
      ) : (
        <div className="flex flex-col items-center justify-center p-4 text-center text-neutral-500 rounded-md bg-neutral-50 mt-2">
          <p className="text-sm">No projects found</p>
          <p className="text-xs mt-1">
            Click the + icon to create your first project
          </p>
        </div>
      )}
    </div>
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
