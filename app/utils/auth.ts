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

    // if (!auth.userId) {
    //   // This will error because you're redirecting to a path that doesn't exist yet
    //   // You can create a sign-in route to handle this
    //   // See https://clerk.com/docs/references/tanstack-start/custom-sign-in-or-up-page
    //   throw redirect({
    //     to: "/sign-in/$",
    //   });
    // }
    const token = await auth.getToken({ template: "convex" });

    return {
      userId: auth.userId,
      token,
    };
  }
);
