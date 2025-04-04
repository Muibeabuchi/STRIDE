// import { PlusCircle } from "lucide-react";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { useGetUserWorkspaces } from "@/features/workspaces/api/use-get-workspaces";
// import { WorkspaceAvatar } from "@/features/workspaces/components/workspace-avatar";
// import { Id } from "@/convex/_generated/dataModel";
// import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
// import { useCreateWorkspaceModal } from "@/features/workspaces/hooks/use-create-workspace-modal";
// import { Loader } from "lucide-react";
// import { useRouter } from "@tanstack/react-router";

// type Props = {};

// export default function WorkspaceSwitcher({}: Props) {
//   const router = useRouter();
//   const workspaceId = useWorkspaceId();
//   const { data: workspaces, error, isPending } = useGetUserWorkspaces();
//   const { open, isOpen, setIsOpen } = useCreateWorkspaceModal();

//   const onSelect = (workspaceId: Id<"workspaces">) => {
//     router.navigate({ to: `/workspaces/${workspaceId}` });
//   };
//   // if (isPending) return;

//   // console.log(workspaces);
//   // if (!workspaces) return null;
//   // {
//   //   workspaces === null && null;
//   // }
//   return (
//     <div className="flex flex-col gap-y-2">
//       <div className="flex items-center justify-between">
//         <p className="text-xs uppercase text-neutral-500">Workspaces</p>
//         <PlusCircle
//           onClick={open}
//           className="size-5 text-neutral-500 cursor-pointer hover:opacity-75 transition"
//         />
//       </div>

//       {isPending && (
//         <div className="flex w-full justify-center items-center">
//           <Loader className="size-4 animate-spin text-muted-foreground" />
//         </div>
//       )}

//       {workspaces && workspaces.length > 0 ? (
//         <Select value={workspaceId} onValueChange={onSelect}>
//           <SelectTrigger className="w-full p-1 font-medium bg-neutral-200">
//             <SelectValue placeholder="No workspace selected" />
//           </SelectTrigger>
//           <SelectContent>
//             {workspaces?.map((workspace) => (
//               <SelectItem key={workspace._id} value={workspace._id}>
//                 <div className="flex items-center justify-start gap-3 font-medium">
//                   <WorkspaceAvatar
//                     name={workspace.workspaceName}
//                     image={workspace.workspaceAvatar ?? ""}
//                   />
//                   <span className="truncate">{workspace.workspaceName}</span>
//                 </div>
//               </SelectItem>
//             ))}
//           </SelectContent>
//         </Select>
//       ) : null}
//     </div>
//   );
// }
