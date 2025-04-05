import axios from "redaxios";

import { createServerFn } from "@tanstack/react-start";
import { Id } from "convex/_generated/dataModel";
import { z } from "zod";
import { notFound } from "@tanstack/react-router";
import { getAuth } from "@clerk/tanstack-react-start/server";
import { fetchClerkAuth } from "@/utils/auth";

const CONVEX_URL = "https://cheery-walrus-760.convex.site";

// import { Id } from "@/convex/_generated/dataModel";
// import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server";
// import { api } from "@/convex/_generated/api";

// type getWorkspaceInfoProps = {
//   workspaceId: Id<"workspaces">;
// };

// export async function getWorkspaceInfo({ workspaceId }: getWorkspaceInfoProps) {
//   return await fetchQuery(
//     api.workspaces.getWorkspaceInfo,
//     { workspaceId },
//     {
//       token: convexAuthNextjsToken(),
//     },
//   );
// }

const getWorkspaceInfoSchema = z.object({
  workspaceId: z.string(),
});

export const getWorkspaceInfo = createServerFn({ method: "GET" })
  .validator(getWorkspaceInfoSchema)
  .handler(async ({ data }) => {
    const { token } = await fetchClerkAuth();
    try {
      const response = await axios.get(
        `${CONVEX_URL}/workspace/${data.workspaceId}/get-info`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response.data);
      if (!response) throw notFound();
      return response.data;
    } catch (error) {
      console.log(error);
    }
  });
