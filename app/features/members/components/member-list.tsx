import { Id } from "convex/_generated/dataModel";
import { formatDistanceToNow } from "date-fns";
import { SettingsIcon } from "lucide-react";

import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { DottedSeparator } from "@/components/doted-separator";
import { Card, CardContent } from "@/components/ui/card";
import { useProjectModalStore } from "@/store/project-modal-store";
import { useGetUserWorkspaceIdMembers } from "../api/use-get-members";
import { MemberAvatar } from "./member-avatar";
import PeopleListSkeleton from "./member-list-skeleton";
interface MemberListProps {
  workspaceId: Id<"workspaces">;
}

const MemberList = ({ workspaceId }: MemberListProps) => {
  const {
    data: members,
    isLoading,
    isPending,
  } = useGetUserWorkspaceIdMembers(workspaceId);

  if (isLoading || isPending || members === undefined) {
    return <PeopleListSkeleton />;
  }
  // function that truuncates a text if the lenght is longer than 15
  const truncateText = (text: string, length: number = 20) => {
    if (text.length > length) {
      return text.substring(0, length) + "...";
    }
    return text;
  };

  return (
    <div className="flex flex-col gap-y-4 col-span-1">
      <div className="bg-white border rounded-lg p-4">
        <div className="flex items-center justify-between">
          <p className="text-lg font-semibold">People ({members.length})</p>
          <Button variant="secondary" size="icon">
            <Link
              to="/workspaces/$workspaceId/members"
              params={{
                workspaceId,
              }}
            >
              <SettingsIcon className="size-4 text-neutral-400" />
            </Link>
          </Button>
        </div>

        <DottedSeparator className="my-4" />

        <ul className="grid grid-cols-1 lg:grid-cols-3 sm:grid-cols-2 gap-4">
          {members.map((member) => (
            <li key={member._id}>
              <Card className="shadow-none rounded-lg overflow-hidden">
                <CardContent className="p-3 flex flex-col items-center gap-x-2">
                  <MemberAvatar
                    className="size-12"
                    name={member.userName ?? ""}
                  />
                  <div className="flex items-center overflow-hidden flex-col">
                    <p className="font-medium text-[9px] truncate line-clamp-1 sm:hidden lg:block">
                      {truncateText(member?.userEmail ?? "")}
                      {/* <span className="text-xs text-muted-foreground">
                        {member.userEmail.split("@")[1]}
                      </span> */}
                    </p>
                    <p className="text-sm text-muted-foreground line-clamp-1">
                      {member.userName}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </li>
          ))}

          <li className="text-sm  text-muted-foreground text-center hidden first-of-type:block">
            No Member Found
          </li>
        </ul>
      </div>
    </div>
  );
};

export default MemberList;
