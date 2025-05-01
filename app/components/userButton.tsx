import { Loader, LogOut } from "lucide-react";
import { redirect, useNavigate } from "@tanstack/react-router";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { DottedSeparator } from "@/components/doted-separator";
import { Authenticated, AuthLoading } from "convex/react";
import { useQueryClient } from "@tanstack/react-query";
import { useAuthActions } from "@convex-dev/auth/react";
import { useCurrentUser } from "@/features/auth/api/get-current-user";

export const UserButton = () => {
  const { signOut } = useAuthActions();
  const navigate = useNavigate();

  // Todo: Fetch the user data here
  const { data: user, isPending: loadingUser } = useCurrentUser();

  if (loadingUser) {
    return (
      <div className="size-10 rounded-full flex items-center justify-center bg-neutral-200 border border-neutral-300">
        <Loader className="size-4 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const logOut = async () => {
    // ? I don't think i need to store the user in the queryCache anymore
    await signOut();
    setTimeout(() => {
      navigate({
        to: "/sign-in/$",
      });
    }, 100);
  };

  const avatarCallback = user?.name
    ? user?.name.charAt(0).toUpperCase()
    : user?.email?.charAt(0).toUpperCase();

  return (
    <>
      <AuthLoading>
        <div className="size-10 rounded-full flex items-center justify-center bg-neutral-200 border border-neutral-300">
          <Loader className="size-4 animate-spin text-muted-foreground" />
        </div>
      </AuthLoading>
      <Authenticated>
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger className="outline-none relative">
            <Avatar className="size-10 hover:opacity-75 border border-neutral-300 transition">
              <AvatarImage src={user?.image} />
              <AvatarFallback className="font-medium flex items-center justify-center bg-neutral-200 text-neutral-500">
                {avatarCallback}
              </AvatarFallback>
              <AvatarImage />
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            side="bottom"
            className="w-50"
            sideOffset={10}
          >
            <div className="flex flex-col items-center gap-2 px-2.5 justify-center py-4">
              <Avatar className="size-[52px]  border border-neutral-300 ">
                <AvatarImage src={user?.image} />
                <AvatarFallback className="text-xl font-medium flex items-center justify-center bg-neutral-200 text-neutral-500">
                  {avatarCallback}
                </AvatarFallback>
                <AvatarImage />
              </Avatar>
              <div className="flex flex-col items-center justify-center">
                <p className="text-sm font-medium text-neutral-900 ">
                  {user?.name || "User"}
                </p>
                <p className="text-xs text-neutral-500 ">
                  {user?.email || "User Email"}
                </p>
              </div>
            </div>
            <DottedSeparator className="mb-1" />
            <DropdownMenuItem
              className="h-10 items-center justify-center flex text-amber-700 font-medium cursor-pointer"
              onClick={() => logOut()}
            >
              <LogOut className="size-4 mr-2" />
              Log Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </Authenticated>
    </>
  );
};
