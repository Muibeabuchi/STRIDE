import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface WorkspaceAvatarProps {
  image?: string;
  name: string;
  className?: string;
}

export const WorkspaceAvatar = ({
  name,
  className,
  image,
}: WorkspaceAvatarProps) => {
  const avatarFallback = name.charAt(0).toUpperCase();

  if (image) {
    return (
      <div
        className={cn("size-7 rounded-md relative overflow-hidden", className)}
      >
        <img src={image} alt={name} className="object-cover" />
      </div>
    );
  }
  return (
    <Avatar className={cn("size-7 rounded-md", className)}>
      {/* not using the avatar image component due to noticeable flickering effect */}
      <AvatarFallback className="text-white rounded-md  bg-blue-600 font-semibold text-lg uppercase">
        {avatarFallback}
      </AvatarFallback>
    </Avatar>
  );
};
