import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeftIcon, MoreVerticalIcon } from "lucide-react";
import { DottedSeparator } from "@/components/doted-separator";
import { useGetUserWorkspaceIdMembers } from "@/features/members/api/use-get-members";
import { Fragment } from "react";
import { MemberAvatar } from "@/features/members/components/member-avatar";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useDeleteMember } from "@/features/members/api/use-delete-member";
import { Id } from "convex/_generated/dataModel";
import { useUpdateMember } from "@/features/members/api/use-update-member";
import { useConfirm } from "@/hooks/use-confirm";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Link, useNavigate } from "@tanstack/react-router";
import { useGetMember } from "@/features/members/api/use-get-member";
import { useLeaveWorkspace } from "../api/use-leave-workspace";

type MemberType = {
  userName: string | undefined;
  userEmail: string | undefined;
  _id: Id<"members">;
  _creationTime: number;
  userId: Id<"users">;
  workspaceId: Id<"workspaces">;
  role: "admin" | "member";
};

export const MembersList = ({
  workspaceId,
}: {
  workspaceId: Id<"workspaces">;
}) => {
  const {
    data: members,
    isPending,
    isLoading,
  } = useGetUserWorkspaceIdMembers(workspaceId);
  const navigate = useNavigate();

  const { mutate: removeMember, isPending: isRemovingMember } =
    useDeleteMember();
  const { mutateAsync: leaveWorkspace, isPending: leavingWorkspace } =
    useLeaveWorkspace();
  const { mutate: updateMember, isPending: isUpdatingMember } =
    useUpdateMember();
  const { data: workspaceMember, isLoading: LoadingMember } =
    useGetMember(workspaceId);

  const [confirmRemoveMember, RemoveMemberConfirmationModal] = useConfirm({
    title: "Remove this member",
    description:
      "This will permanently remove this member from this workspace ",
    variant: "destructive",
  });
  const [confirmLeaveWorkspace, LeaveWorkspaceConfirmationModal] = useConfirm({
    title: "Leave Workspace",
    description: "This will permanently remove you from this workspace ",
    variant: "destructive",
  });

  const handleUpdateMember = (
    memberId: Id<"members">,
    role: "admin" | "member",
    memberRole: "admin" | "member"
  ) => {
    if (role === memberRole) {
      toast(
        `The user is  already ${
          memberRole === "admin" ? "an" : "a"
        } ${memberRole} `
      );
      return;
    }
    updateMember({ memberId, memberRole: role, workspaceId });
  };

  const handleRemoveMember = async (memberId: Id<"members">) => {
    const ok = await confirmRemoveMember();

    if (!ok) return;
    removeMember({
      memberId,
      workspaceId,
    });
    navigate({
      to: "/workspaces/$workspaceId",
      params: {
        workspaceId,
      },
    });
  };

  const handleLeaveWorkspace = async (workspaceId: Id<"workspaces">) => {
    const ok = await confirmLeaveWorkspace();

    if (!ok) return;
    const { success } = await leaveWorkspace({
      workspaceId,
    });
    if (success) {
      navigate({
        to: "/",
      });
    }
  };

  if (
    isLoading ||
    isPending ||
    members === undefined ||
    LoadingMember ||
    workspaceMember === undefined
  ) {
    return <MemberListSkeleton />;
  }

  if (members === null) {
    return <p>No members found for this workspace</p>;
  }

  // if a user is an admin, we show  the dropdown menu with the option of downgrading themselves to a member and an option to push other members to admin
  // also they cannot remove themselves unless they are members. Therefore we only show the "remove member" option for non-admins
  // Basically, before  you remove a member, you must demote them to member role
  // if the user is a member, they can only see the option to leave the workspace and no other option

  const memberRole = workspaceMember.role;

  function renderOptions(member: MemberType) {
    const memberIsNotAdmin = member.role === "member";
    if (memberRole === "member") {
      return (
        <DropdownMenuItem
          className={"font-medium cursor-pointer"}
          onClick={() => handleLeaveWorkspace(workspaceId)}
          disabled={leavingWorkspace}
        >
          Leave Workspace
        </DropdownMenuItem>
      );
    } else if (memberRole === "admin") {
      return (
        <>
          <DropdownMenuItem
            className={"font-medium cursor-pointer"}
            onClick={() =>
              handleUpdateMember(member._id, "member", member.role)
            }
            disabled={isUpdatingMember}
          >
            {/* {member._id === workspaceMember?._id &&
              "Downgrade Yourself to Member"} */}
            {member._id !== workspaceMember?._id && memberIsNotAdmin
              ? "Upgrade to Admin"
              : "Downgrade to Member"}
          </DropdownMenuItem>
          {member.role === "member" && (
            <DropdownMenuItem
              className={
                "font-medium text-amber-700 cursor-pointer focus:text-amber-700 "
              }
              onClick={() => handleRemoveMember(member._id)}
              disabled={isRemovingMember}
            >
              Remove {member.userName}
            </DropdownMenuItem>
          )}
        </>
      );
    }
  }
  return (
    <>
      <RemoveMemberConfirmationModal />
      <LeaveWorkspaceConfirmationModal />
      <Card className={"w-full h-full border-none shadow-none"}>
        <CardHeader className=" flex flex-row  gap-x-4 space-y-0 p-7 items-center ">
          <Button size={"sm"} variant={"secondary"} asChild>
            <Link
              to="/"
              // className={`px-2 py-1 bg-gray-600 dark:bg-gray-700 rounded text-white uppercase font-extrabold`}
              onClick={(e) => {
                e.preventDefault();
                window.history.back();
              }}
            >
              <ArrowLeftIcon className={"size-4 mr-2"} />
              Back
            </Link>
          </Button>
          <CardTitle className={"text-xl font-bold"}>Members List</CardTitle>
        </CardHeader>
        <div className={"px-7"}>
          <DottedSeparator />
        </div>
        <CardContent className={"p-7"}>
          {members.map((member, index) => (
            <Fragment key={member._id}>
              <div className={"flex items-center gap-2"}>
                <MemberAvatar
                  name={member.userName!}
                  className="size-10"
                  fallbackClassname={"text-lg"}
                />

                <div className={"flex flex-col"}>
                  <p className={"text-sm font-medium"}>{member.userName}</p>
                  <p className={"text-xs text-muted-foreground"}>
                    {member.userEmail}
                  </p>
                </div>

                {/* create a badge for displaying the members role */}
                <Badge
                  variant={"outline"}
                  className={cn(
                    "ml-3 self-end",
                    member.role === "admin" && "bg-green-500",
                    member.role === "member" && "bg-gray-500"
                  )}
                >
                  {member.role}
                </Badge>

                {memberRole === "member" &&
                  member._id === workspaceMember._id && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant={"secondary"}
                          className={"ml-auto"}
                          size={"icon"}
                        >
                          <MoreVerticalIcon
                            className={"size-4 text-muted-foreground"}
                          />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        className={""}
                        side={"bottom"}
                        align={"end"}
                      >
                        {renderOptions(member)}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}

                {memberRole === "admin" && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant={"secondary"}
                        className={"ml-auto"}
                        size={"icon"}
                      >
                        <MoreVerticalIcon
                          className={"size-4 text-muted-foreground"}
                        />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      className={""}
                      side={"bottom"}
                      align={"end"}
                    >
                      {renderOptions(member)}
                      {/* <DropdownMenuItem
                      className={"font-medium cursor-pointer"}
                      onClick={() =>
                        handleUpdateMember(member._id, "admin", member.role)
                      }
                      disabled={isUpdatingMember}
                    >
                      Set as Administrator
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className={"font-medium cursor-pointer"}
                      onClick={() =>
                        handleUpdateMember(member._id, "member", member.role)
                      }
                      disabled={isUpdatingMember}
                    >
                      Set as Member
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className={
                        "font-medium text-amber-700 cursor-pointer focus:text-amber-700 "
                      }
                      onClick={() => handleRemoveMember(member._id)}
                      disabled={isRemovingMember}
                    >
                      Remove {member.userName}
                    </DropdownMenuItem> */}
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
              {index < members.length - 1 && <Separator className={"my-2.5"} />}
            </Fragment>
          ))}
        </CardContent>
      </Card>
    </>
  );
};

export const MemberListSkeleton = () => {
  return (
    <Card className={"w-full h-full border-none shadow-none"}>
      <CardHeader className="flex flex-row gap-x-4 space-y-0 p-7 items-center">
        <Button size={"sm"} variant={"secondary"} disabled>
          <ArrowLeftIcon className={"size-4 mr-2"} />
          Back
        </Button>
        <Skeleton className="h-6 w-32" />
      </CardHeader>
      <div className={"px-7"}>
        <DottedSeparator />
      </div>
      <CardContent className={"p-7"}>
        {Array.from({ length: 5 }).map((_, index) => (
          <Fragment key={index}>
            <div className={"flex items-center gap-2"}>
              <Skeleton className="size-10 rounded-full" />
              <div className={"flex flex-col gap-2"}>
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-40" />
              </div>
              <Skeleton className="ml-auto size-8 rounded-full" />
            </div>
            {index < 4 && <Separator className={"my-2.5"} />}
          </Fragment>
        ))}
      </CardContent>
    </Card>
  );
};
