import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import {
  Outlet,
  createRootRouteWithContext,
  HeadContent,
  Scripts,
  useRouterState,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import * as React from "react";
import { type QueryClient } from "@tanstack/react-query";
import { DefaultCatchBoundary } from "@/components/DefaultCatchBoundary";
import { NotFound } from "@/components/NotFound";
import { seo } from "@/utils/seo";
import appCss from "@/styles/app.css?url";
import { ConvexReactClient } from "convex/react";
import { ConvexQueryClient } from "@convex-dev/react-query";
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
        content:
          "width=device-width, initial-scale=1 , maximum-scale=1.0, user-scalable=no",
      },
      ...seo({
        title: "Stride",
        description: `A Project Management and productivity app for students `,
      }),
    ],
    links: [
      //       <link rel="apple-touch-icon" sizes="57x57" href="/apple-icon-57x57.png">
      // <link rel="apple-touch-icon" sizes="60x60" href="/apple-icon-60x60.png">
      // <link rel="apple-touch-icon" sizes="72x72" href="/apple-icon-72x72.png">
      // <link rel="apple-touch-icon" sizes="76x76" href="/apple-icon-76x76.png">
      // <link rel="apple-touch-icon" sizes="114x114" href="/apple-icon-114x114.png">
      // <link rel="apple-touch-icon" sizes="120x120" href="/apple-icon-120x120.png">
      // <link rel="apple-touch-icon" sizes="144x144" href="/apple-icon-144x144.png">
      // <link rel="apple-touch-icon" sizes="152x152" href="/apple-icon-152x152.png">
      // <link rel="apple-touch-icon" sizes="180x180" href="/apple-icon-180x180.png"></link>
      { rel: "stylesheet", href: appCss },
      {
        rel: "apple-touch-icon",
        sizes: "57x57",
        href: "/apple-icon-57x57.png",
      },
      {
        rel: "apple-touch-icon",
        sizes: "60x60",
        href: "/apple-icon-60x60.png",
      },
      {
        rel: "apple-touch-icon",
        sizes: "72x72",
        href: "/apple-icon-72x72.png",
      },
      {
        rel: "apple-touch-icon",
        sizes: "114x114",
        href: "/apple-icon-114x114.png",
      },
      {
        rel: "apple-touch-icon",
        sizes: "120x120",
        href: "/apple-icon-120x120.png",
      },
      {
        rel: "apple-touch-icon",
        sizes: "144x144",
        href: "/apple-icon-144x144.png",
      },
      {
        rel: "apple-touch-icon",
        sizes: "152x152",
        href: "/apple-icon-152x152.png",
      },
      {
        rel: "apple-touch-icon",
        sizes: "180x180",
        href: "/apple-icon-180x180.png",
      },
      //       <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
      // <link rel="icon" type="image/png" sizes="96x96" href="/favicon-96x96.png">
      // <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png"></link>
      {
        rel: "icon",
        type: "image/png",
        sizes: "32x32",
        href: "/favicon-32x32.png",
      },
      {
        rel: "icon",
        type: "image/png",
        sizes: "96x96",
        href: "/favicon-96x96.png",
      },
      {
        rel: "icon",
        type: "image/png",
        sizes: "16x16",
        href: "/favicon-16x16.png",
      },
      { rel: "manifest", href: "/site.webmanifest", color: "#000" },
      {
        rel: "icon",
        href: "/favicon.ico",
      },
    ],
  }),
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
  return (
    <RootDocument>
      <Outlet />
    </RootDocument>
  );
}

function RootDocument({ children }: { children: React.ReactNode }) {
  const loading = useRouterState({
    select: (state) => state.isLoading,
  });
  return (
    <html>
      <head>
        {/* <script src="https://unpkg.com/react-scan/dist/auto.global.js" /> */}
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
