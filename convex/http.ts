import type { WebhookEvent } from "@clerk/backend";
import { Webhook } from "svix";

import { Hono, HonoRequest } from "hono";
import { HonoWithConvex, HttpRouterWithHono } from "convex-helpers/server/hono";
import { ActionCtx } from "./_generated/server";
import { api, internal } from "./_generated/api";
import { Id } from "./_generated/dataModel";

const app: HonoWithConvex<ActionCtx> = new Hono();

const HonoConvexHttp = new HttpRouterWithHono(app);

app.post("/clerk-users-webhook", async (c) => {
  try {
    const request = c.req;
    const event = await validateRequest(request);
    console.log(event);
    if (!event) {
      return new Response("Error occured", { status: 400 });
    }

    switch (event.type) {
      case "user.created": // intentional fallthrough
      case "user.updated":
        await c.env.runMutation(internal.users.upsertFromClerk, {
          data: event.data,
        });
        break;

      // handle sessions
      case "session.created": {
        const clerkSessionId = event.data.id!;
        const clerkUserId = event.data.user_id!;
        await c.env.runAction(internal.clerkSessions.clearClerkSessions, {
          userId: clerkUserId,
          sessionId: clerkSessionId,
        });

        break;
      }

      case "user.deleted": {
        const clerkUserId = event.data.id!;
        await c.env.runMutation(internal.users.deleteFromClerk, {
          clerkUserId,
        });
        break;
      }
      default:
        console.log("Ignored Clerk webhook event", event.type);
    }
  } catch (error) {
    console.log(error);
  }

  return c.body(null, 200);
});

app.get("/workspace/:workspaceId/get-info", async (c) => {
  const workspaceId = c.req.param("workspaceId");
  const workspace = await c.env.runQuery(api.workspaces.getWorkspaceById, {
    workspaceId: workspaceId as Id<"workspaces">,
  });
  if (!workspace) {
    return c.json({ error: "Workspace not found" }, 404);
  }
  return c.json(workspace);
});
app.get("/tasks", async (c) => {
  // const taskId = c.req.param("taskId");
  // const {} = c.body;
  // const tasks = await c.env.runQuery(api.tasks.get, {
  //   workspaceId: workspaceId as Id<"workspaces">,
  // });
  // if (!workspace) {
  //   return c.json({ error: "Workspace not found" }, 404);
  // }
  // return c.json(workspace);
});

async function validateRequest(
  request: HonoRequest
): Promise<WebhookEvent | null> {
  const payloadString = await request.text();
  const svixHeaders = {
    "svix-id": request.header("svix-id")!,
    "svix-timestamp": request.header("svix-timestamp")!,
    "svix-signature": request.header("svix-signature")!,
  } as const;

  const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET!);
  try {
    return wh.verify(payloadString, svixHeaders) as unknown as WebhookEvent;
  } catch (error) {
    console.error("Error verifying webhook event", error);
    return null;
  }
}

export default HonoConvexHttp;
