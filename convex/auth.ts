import { convexAuth } from "@convex-dev/auth/server";
import Google from "@auth/core/providers/google";
import Github from "@auth/core/providers/github";

export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers: [Google, Github],
});
