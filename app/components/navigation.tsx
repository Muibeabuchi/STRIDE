// // "use client";

// import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
// import { Routes } from "@/lib/constants";
// import { cn } from "@/lib/utils";
// import Link from "next/link";
// import { usePathname } from "next/navigation";

// function Navigation() {
//   const workspaceId = useWorkspaceId();
//   const pathname = usePathname();
//   return (
//     <ul className="flex flex-col ">
//       {Routes.map((route) => {
//         const fullHref = `/workspaces/${workspaceId}${route.href}`;
//         const isActive = pathname === fullHref;
//         const Icon = isActive ? route.filledIcon : route.Icon;
//         return (
//           <Link key={route.href} href={fullHref}>
//             <div
//               className={cn(
//                 "flex items-center gap-2.5 p-2.5 font-medium transition rounded-md hover:text-primary text-neutral-500",
//                 isActive && "bg-white shadow-sm hover:opacity-100 text-primary"
//               )}
//             >
//               <Icon className="size-5 text-neutral-500" />
//               {route.label}
//             </div>
//           </Link>
//         );
//       })}
//     </ul>
//   );
// }

// export default Navigation;
