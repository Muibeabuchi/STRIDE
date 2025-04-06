import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines multiple class names into a single string, merging Tailwind CSS classes efficiently.
 * This utility function is used throughout the application for conditional class name handling.
 *
 * @param inputs - Class values to be combined (strings, objects, arrays, etc.)
 * @returns A merged string of class names optimized for Tailwind CSS
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

// import { useGetProjectById } from "@/features/projects/api/use-get-projects-by-id";
// import { UpdateProjectForm } from "@/features/projects/components/update-project-form";
// import { createFileRoute } from "@tanstack/react-router";
// import { Id } from "convex/_generated/dataModel";

// export const Route = createFileRoute(
//   "/(dashboard)/(standalone)/_dashboard_/_standalone/workspaces/$workspaceId/projects_/$projectId_/settings"
// )({
//   component: RouteComponent,
//   params: {
//     parse: (params) => {
//       return {
//         projectId: params.projectId as Id<"projects">,
//         workspaceId: params.workspaceId as Id<"workspaces">,
//       };
//     },
//   },
// });

// function RouteComponent() {
//   const { projectId, workspaceId } = Route.useParams();
//   const { data: project } = useGetProjectById({ projectId, workspaceId });
//   return (
//     <div className="w-full lg:max-w-xl">
//       <UpdateProjectForm
//         initialValues={{
//           ...project,
//           projectImage: project.projectImage,
//         }}
//         projectId={projectId}
//         workspaceId={workspaceId}
//       />
//     </div>
//   );
// }
