import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { Button } from "@/components/ui/button";
import { ArrowLeftIcon, MoreVerticalIcon } from "lucide-react";
import { Link } from "@tanstack/react-router";
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

export const MembersList = () => {
  // const navigate = useNavigate();
  const workspaceId = useWorkspaceId();
  const {
    data: members,
    isPending: isLoadingMembers,
    isError,
  } = useGetUserWorkspaceIdMembers(workspaceId);

  const { mutate: removeMember, isPending: isRemovingMember } =
    useDeleteMember();
  const { mutate: updateMember, isPending: isUpdatingMember } =
    useUpdateMember();

  const [confirmRemoveMember, RemoveMemberConfirmationModal] = useConfirm({
    title: "Remove this member",
    description:
      "This will permanently remove this member from this workspace ",
    variant: "destructive",
  });

  const handleUpdateMember = (
    memberId: Id<"members">,
    role: "admin" | "member"
  ) => {
    updateMember({ memberId, memberRole: role });
  };

  const handleRemoveMember = async (memberId: Id<"members">) => {
    const ok = await confirmRemoveMember();

    if (!ok) return;
    removeMember({
      memberId,
    });
  };

  if (isLoadingMembers) {
    return <p>Loading...</p>;
  }

  if (isError) {
    return <p>There was error whiles loading the members data</p>;
  }

  if (!members) {
    return <p>No members found for this workspace</p>;
  }

  return (
    <>
      <RemoveMemberConfirmationModal />
      <Card className={"w-full h-full border-none shadow-none"}>
        <CardHeader className=" flex flex-row  gap-x-4 space-y-0 p-7 items-center ">
          <Button size={"sm"} variant={"secondary"} asChild>
            <Link to={"/"}>
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
          {/* {members.map((member, index) => (
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
                    <DropdownMenuItem
                      className={"font-medium cursor-pointer"}
                      onClick={() => handleUpdateMember(member._id, "admin")}
                      disabled={isUpdatingMember}
                    >
                      Set as Administrator
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className={"font-medium cursor-pointer"}
                      onClick={() => handleUpdateMember(member._id, "member")}
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
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              {index < members.length - 1 && <Separator className={"my-2.5"} />}
            </Fragment>
          ))} */}
        </CardContent>
      </Card>
    </>
  );
};
