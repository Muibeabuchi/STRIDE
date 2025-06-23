import { ReactNode } from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

interface CustomToolTipProps {
  children: ReactNode;
  content: string;
  delayDuration?: number;
}

export function CustomToolTip({
  children,
  content,
  delayDuration = 300,
}: CustomToolTipProps) {
  return (
    <Tooltip delayDuration={delayDuration}>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent>
        <p>{content}</p>
      </TooltipContent>
    </Tooltip>
  );
}
