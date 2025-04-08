"use node";

import { internalAction } from "./_generated/server";
import { v } from "convex/values";

// import { clerkClient as ck } from "@clerk/tanstack-react-start/server";

import { createClerkClient as ck } from "@clerk/backend";
// const clerkClient = createClerkClient({
//   publishableKey: process.env.CLERK_PUBLISHABLE_KEY,
//   secretKey: process.env.CLERK_WEBHOOK_SECRET,
// });

export const clearClerkSessions = internalAction({
  args: { userId: v.string(), sessionId: v.string() },
  async handler(ctx, { userId, sessionId }) {
    const clerkClient = ck({
      publishableKey: process.env.CLERK_PUBLISHABLE_KEY,
      secretKey: process.env.CLERK_SECRET_KEY,
    });

    const userSessions = await clerkClient.sessions.getSessionList({
      userId,
      status: "active",
    });

    await Promise.all(
      userSessions.data.map(async (session) => {
        if (session.id === sessionId) return;
        await clerkClient.sessions.revokeSession(session.id);
      })
    );
  },
});
