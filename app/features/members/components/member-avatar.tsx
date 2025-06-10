import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface MemberAvatarProps {
  name: string | undefined;
  className?: string;
  fallbackClassname?: string;
  imageUrl?: string;
}

export const MemberAvatar = ({
  fallbackClassname,
  className,
  name,
  imageUrl,
}: MemberAvatarProps) => {
  const avatarFallback = name?.charAt(0).toUpperCase();

  return (
    <Avatar
      className={cn(
        "size-5 transition border border-neutral-300 rounded-full",
        className
      )}
    >
      <AvatarImage src={imageUrl ?? ""} />
      {/* not using the avatar image component due to noticeable flickering effect */}
      <AvatarFallback
        className={cn(
          "bg-neutral-200 font-medium text-neutral-500 items-center justify-center ",
          fallbackClassname
        )}
      >
        {avatarFallback} || "Member"
      </AvatarFallback>
    </Avatar>
  );
};
