import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface MemberAvatarProps {
  name: string;
  className?: string;
  fallbackClassname?: string;
}

export const MemberAvatar = ({
  fallbackClassname,
  className,
  name,
}: MemberAvatarProps) => {
  const avatarFallback = name.charAt(0).toUpperCase();

  return (
    <Avatar
      className={cn(
        "size-5 transition border border-neutral-300 rounded-full",
        className,
      )}
    >
      {/* not using the avatar image component due to noticeable flickering effect */}
      <AvatarFallback
        className={cn(
          "bg-neutral-200 font-medium text-neutral-500 items-center justify-center ",
          fallbackClassname,
        )}
      >
        {avatarFallback}
      </AvatarFallback>
    </Avatar>
  );
};
