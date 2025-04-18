import { cn } from "@/lib/utils";
import { Card, CardHeader, CardDescription, CardTitle } from "./ui/card";
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react";

interface AnalyticsCardProps {
  title: string;
  value: number;
  variant: "up" | "down";
  increaseValue: number;
}

const AnalyticsCard = ({
  increaseValue,
  title,
  value,
  variant,
}: AnalyticsCardProps) => {
  const iconColor = variant === "up" ? "text-emerald-500" : "text-red-500";
  const Icon = variant === "up" ? ChevronUpIcon : ChevronDownIcon;

  return (
    <Card className="shadow-none border-none w-full flex-1 flex shrink-0">
      <CardHeader>
        <div className="flex items-center w-full gap-x-2.5">
          <CardDescription className="flex items-center w-full gap-x-2 font-medium overflow-hidden">
            <span className="truncate text-xs lg:text-base ">{title}</span>
          </CardDescription>
          <div className="flex items-center gap-x-1 w-full">
            <Icon className={cn(iconColor, "size-2")} />
            <span
              className={cn(
                iconColor,
                "truncate text-xs lg:text-base w-full font-medium"
              )}
            >
              {increaseValue}
            </span>
          </div>
        </div>
        <CardTitle className=" font-medium w-full">{value}</CardTitle>
      </CardHeader>
    </Card>
  );
};

export default AnalyticsCard;
