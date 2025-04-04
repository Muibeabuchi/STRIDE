// import { PlusCircle } from "lucide-react";
// import { useGetWorkspaceProjects } from "@/features/projects/api/use-get-projects";
// import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
// import { usePathname } from "next/navigation";
// import Link from "next/link";
// import { cn } from "@/lib/utils";
// import { useCreateProjectModal } from "@/features/projects/hooks/use-create-project-modal";
// import { ProjectAvatar } from "@/features/projects/components/project-avatar";
// import { Loader } from "lucide-react";

// interface projectsProps {}

// const Projects = (props: projectsProps) => {
//   const pathname = usePathname();
//   const workspaceId = useWorkspaceId();
//   const { open } = useCreateProjectModal();
//   const { data: projects, isPending: isLoadingProjects } =
//     useGetWorkspaceProjects(workspaceId);
//   return (
//     <div className="flex flex-col gap-y-2">
//       <div className="flex items-center justify-between">
//         <p className="text-xs uppercase text-neutral-500">Projects</p>
//         <RiAddCircleFill
//           onClick={open}
//           className="size-5 text-neutral-500 cursor-pointer hover:opacity-75 transition"
//         />
//       </div>

//       {isLoadingProjects && (
//         <div className="flex w-full justify-center items-center">
//           <Loader className="size-4 animate-spin text-muted-foreground" />
//         </div>
//       )}

//       {projects && projects.length > 0
//         ? projects.map((project) => {
//             const href = `/workspaces/${project.workspaceId}/projects/${project._id}`;
//             const isActive = pathname === href;

//             return (
//               <Link key={project._id} href={href}>
//                 <div
//                   className={cn(
//                     "flex items-center gap-2.5 p-2.5 rounded-md hover:opacity-75 transition cursor-pointer text-neutral-500",
//                     isActive &&
//                       "bg-white shadow-sm hover:opacity-100 text-primary"
//                   )}
//                 >
//                   <ProjectAvatar
//                     image={project.projectImage}
//                     name={project.projectName}
//                   />
//                   <span className="truncate">{project.projectName}</span>
//                 </div>
//               </Link>
//             );
//           })
//         : null}
//     </div>
//   );
// };

// export default Projects;
