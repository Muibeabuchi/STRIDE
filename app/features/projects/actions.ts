// import { fetchQuery } from "convex/nextjs";

// import { Id } from "@/convex/_generated/dataModel";
// import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server";
// import { api } from "@/convex/_generated/api";

// type getProjectProps = {
//   projectId: Id<"projects">;
//   workspaceId: Id<"workspaces">;
// };

// export async function getProject({ projectId, workspaceId }: getProjectProps) {
//   return await fetchQuery(
//     api.projects.getById,
//     { workspaceId, projectId },
//     {
//       token: convexAuthNextjsToken(),
//     }
//   );
// }
