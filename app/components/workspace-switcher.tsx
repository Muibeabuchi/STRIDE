import {
  ChevronRight,
  MoreHorizontal,
  PlusCircle,
  StarIcon,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGetUserWorkspaces } from "@/features/workspaces/api/use-get-workspaces";
import { WorkspaceAvatar } from "@/features/workspaces/components/workspace-avatar";
import { Id } from "convex/_generated/dataModel";
import { useCreateWorkspaceModal } from "@/features/workspaces/hooks/use-create-workspace-modal";
import { useNavigate } from "@tanstack/react-router";
import { Skeleton } from "@/components/ui/skeleton";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { use, useState } from "react";
import { useLocalStorage } from "usehooks-ts";
import { lastWorkspaceLocalStorageKey } from "@/routes";
import CustomToolBar from "@/features/tasks/components/custom-tool-bar";
import { CustomToolTip } from "./custom-tooltip";
import { truncateString } from "@/utils/truncate-words";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./ui/command";
import { Button } from "./ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

export function WorkspaceSwitcherSkeleton() {
  return (
    <div className="flex flex-col gap-y-2 ">
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-24 bg-white" />
        <Skeleton className="size-5 rounded-full bg-white" />
      </div>
      <Skeleton className="w-full h-9 bg-white" />
    </div>
  );
}

export default function WorkspaceSwitcher() {
  const navigate = useNavigate();
  const workspaceId = useWorkspaceId();
  const [lastWorkspace, setLastWorkspace] = useLocalStorage(
    lastWorkspaceLocalStorageKey,
    ""
  );
  const [open, setOpen] = useState(false);

  const { data: workspaces } = useGetUserWorkspaces();
  const { open: openWorkspaceModal } = useCreateWorkspaceModal();

  const currentWorkspaceInfo = workspaces?.find((w) => w._id === workspaceId);

  const onSelect = (workspaceName: string) => {
    if (!workspaces) return;
    const workspace = workspaces.find((w) => w.workspaceName === workspaceName);

    if (!workspace) return;
    setLastWorkspace(workspace._id);
    navigate({
      to: `/workspaces/$workspaceId`,
      params: { workspaceId: workspace._id },
    });
  };
  if (!workspaceId) throw new Error("WorkspaceId not found");
  return (
    <div className="flex flex-col gap-y-2">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          Workspaces
        </p>
        <CustomToolTip content="New">
          <PlusCircle
            onClick={openWorkspaceModal}
            className="size-5 text-neutral-500 cursor-pointer hover:opacity-75 transition"
          />
        </CustomToolTip>
      </div>

      {/* {workspaces && workspaces.length > 0 ? ( */}
      {currentWorkspaceInfo?.workspaceName ? (
        <>
          <div className="flex items-center w-full border rounded-md p-1 pl-2 py-2 justify-between gap-3 font-medium ">
            <Popover open={open} modal onOpenChange={setOpen}>
              <PopoverTrigger className="w-full">
                <div className="flex items-center w-full gap-2">
                  <WorkspaceAvatar
                    name={truncateString(
                      currentWorkspaceInfo?.workspaceName,
                      1,
                      10
                    )}
                    image={currentWorkspaceInfo?.workspaceAvatar ?? ""}
                  />
                  <span className="truncate">
                    {truncateString(currentWorkspaceInfo?.workspaceName, 1, 10)}
                  </span>
                </div>
              </PopoverTrigger>

              <PopoverContent
                align="start"
                className="w-[150px] p-0 lg:w-[250px]"
              >
                <Command className="w-full">
                  <CommandInput
                    placeholder="Find Workspace"
                    autoFocus={true}
                    className="h-9"
                  />
                  <CommandList>
                    <CommandEmpty>No Workspace found.</CommandEmpty>
                    <CommandGroup>
                      {workspaces?.map((label) => (
                        <CommandItem
                          key={label._id}
                          value={label.workspaceName}
                          onSelect={(value) => {
                            onSelect(value);
                            setOpen(false);
                          }}
                        >
                          {truncateString(label.workspaceName, 1, 10)}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>
        </>
      ) : null}
    </div>
  );
}
