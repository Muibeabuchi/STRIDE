import { ReactQueryDevtools } from "@tanstack/react-query-devtools/production";
import {
  Outlet,
  createRootRouteWithContext,
  HeadContent,
  Scripts,
  useRouteContext,
  useRouterState,
  redirect,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import * as React from "react";
import { queryOptions, type QueryClient } from "@tanstack/react-query";
import { DefaultCatchBoundary } from "@/components/DefaultCatchBoundary";
import { NotFound } from "@/components/NotFound";
import { seo } from "@/utils/seo";
import appCss from "@/styles/app.css?url";
import { ClerkProvider, useAuth } from "@clerk/tanstack-react-start";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { ConvexReactClient } from "convex/react";
import { ConvexQueryClient } from "@convex-dev/react-query";
import { fetchClerkAuth } from "@/utils/auth";
import { Toaster } from "sonner";

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient;
  convexClient: ConvexReactClient;
  convexQueryClient: ConvexQueryClient;
}>()({
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      ...seo({
        title:
          "TanStack Start | Type-Safe, Client-First, Full-Stack React Framework",
        description: `TanStack Start is a type-safe, client-first, full-stack React framework. `,
      }),
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      {
        rel: "apple-touch-icon",
        sizes: "180x180",
        href: "/apple-touch-icon.png",
      },
      {
        rel: "icon",
        type: "image/png",
        sizes: "32x32",
        href: "/favicon-32x32.png",
      },
      {
        rel: "icon",
        type: "image/png",
        sizes: "16x16",
        href: "/favicon-16x16.png",
      },
      { rel: "manifest", href: "/site.webmanifest", color: "#fffff" },
      { rel: "icon", href: "/favicon.ico" },
    ],
  }),
  beforeLoad: async (ctx) => {
    await ctx.context.queryClient.fetchQuery({
      staleTime: 1000 * 60 * 2,
      queryKey: ["user"],
      queryFn: async () => {
        const auth = await fetchClerkAuth();
        if (auth?.token) {
          ctx.context.convexQueryClient.serverHttpClient?.setAuth(auth.token);
        }
        return auth;
      },
    });

    // const user:
    //   | {
    //       userId: string | null;
    //       token: string | null;
    //     }
    //   | undefined = await ctx.context.queryClient.getQueryData(["user"]);

    // console.log("user", user);
    // if (user && user.userId) {
    //   redirect({
    //     to: "/",
    //   });

    //   return;
    // }
    // if (!user) {
    //   redirect({
    //     to: "/sign-in/$",
    //   });
    //   return;
    // }
    // if (!user.userId) {
    //   redirect({
    //     to: "/sign-in/$",
    //   });
    //   return;
    // }
  },

  errorComponent: (props) => {
    return (
      <RootDocument>
        <DefaultCatchBoundary {...props} />
      </RootDocument>
    );
  },
  notFoundComponent: () => <NotFound />,
  component: RootComponent,
});

function RootComponent() {
  const context = useRouteContext({ from: Route.id });

  const pk = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
  return (
    <ClerkProvider publishableKey={pk!}>
      <ConvexProviderWithClerk useAuth={useAuth} client={context.convexClient}>
        <RootDocument>
          <Outlet />
        </RootDocument>
      </ConvexProviderWithClerk>
    </ClerkProvider>
  );
}

function RootDocument({ children }: { children: React.ReactNode }) {
  const loading = useRouterState({
    select: (state) => state.isLoading,
  });
  return (
    <html>
      <head>
        <script src="https://unpkg.com/react-scan/dist/auto.global.js" />
        <HeadContent />
      </head>
      <body>
        <div className="h-full flex flex-col">
          <Toaster />
          <div className="flex-grow  h-full flex flex-col">
            {loading && (
              <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 pointer-events-none">
                <div className="animate-spin h-8 w-8 border-[3px] border-primary border-dashed rounded-full"></div>
              </div>
            )}
            {children}
          </div>
        </div>
        <ReactQueryDevtools position="bottom" />
        <TanStackRouterDevtools position="bottom-left" />
        <Scripts />
      </body>
    </html>
  );
}
