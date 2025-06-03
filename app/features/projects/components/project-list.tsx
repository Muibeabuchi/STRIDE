import { Id } from "convex/_generated/dataModel";
import { PlusIcon } from "lucide-react";

import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { DottedSeparator } from "@/components/doted-separator";
import { Card, CardContent } from "@/components/ui/card";
import { useGetWorkspaceProjects } from "../api/use-get-projects";
import { useProjectModalStore } from "@/store/project-modal-store";
import { ProjectAvatar } from "./project-avatar";
import ProjectListSkeleton from "./project-list-component";

interface ProjectListProps {
  workspaceId: Id<"workspaces">;
}

const ProjectList = ({ workspaceId }: ProjectListProps) => {
  const {
    data: projects,
    isLoading,
    isPending,
  } = useGetWorkspaceProjects(workspaceId);
  const { open } = useProjectModalStore();

  if (isLoading || isPending || projects === undefined) {
    return <ProjectListSkeleton />;
  }
  return (
    <div className="flex flex-col gap-y-4 col-span-1">
      <div className="space-y-5 bg-muted border rounded-lg p-4">
        <div className="flex items-center justify-between">
          <p className="text-lg font-semibold">Projects ({projects.length})</p>
          <Button variant={"outline"} size="icon" onClick={open}>
            <PlusIcon className="size-4 text-neutral-400" />
          </Button>
        </div>

        {/* <DottedSeparator className="my-4" /> */}

        <ul className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {projects.map((project) => (
            <li key={project._id}>
              <Link
                to="/workspaces/$workspaceId/projects/$projectId"
                params={{
                  projectId: project._id,
                  workspaceId: project.workspaceId,
                }}
              >
                <Card className="shadow-none rounded-lg hover:opacity-75 transition p-0">
                  <CardContent className="p-4 flex items-center gap-x-2.5">
                    <ProjectAvatar
                      className="size-12"
                      fallbackClassName="text-lg"
                      name={project.projectName}
                      image={project.projectImage}
                    />
                    <p className="font-medium text-lg truncate">
                      {project.projectName}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            </li>
          ))}

          <li className="text-sm w-full text-muted-foreground  hidden first-of-type:block">
            You Currently have no Projects
          </li>
        </ul>
      </div>
    </div>
  );
};

export default ProjectList;
