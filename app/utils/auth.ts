import { getAuth } from "@clerk/tanstack-react-start/server";
import { createServerFn } from "@tanstack/react-start";
import { getWebRequest } from "@tanstack/react-start/server";

export const fetchClerkAuth = createServerFn({ method: "GET" }).handler(
  async () => {
    const request = getWebRequest();

    const sk = import.meta.env.CLERK_SECRET_KEY;
    const pk = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
    console.log(sk);
    console.log(pk);
    if (!request) throw new Error("No request found");
    const auth = await getAuth(request, {
      secretKey: sk,
    });
    const token = await auth.getToken({ template: "convex" });

    return {
      userId: auth.userId,
      token,
    };
  }
);
