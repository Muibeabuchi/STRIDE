import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { CalendarIcon, ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

interface CustomToolBarProps {
  date: Date;
  onNavigate: (action: "PREV" | "NEXT" | "TODAY") => void;
}

const CustomToolBar = ({ date, onNavigate }: CustomToolBarProps) => {
  return (
    <div className="flex mb-4 gap-x-2 items-center w-full lg:w-auto justify-center lg:justify-start">
      <Button
        onClick={() => onNavigate("PREV")}
        variant={"secondary"}
        size="icon"
        className="flex items-center"
      >
        <ChevronLeftIcon className="size-4" />
      </Button>
      <div className="flex items-center border border-input h-8 rounded-md px-3 py-2 lg:w-auto justify-center w-full ">
        <CalendarIcon className="size-4 mr-2" />
        <p className="text-sm ">{format(date, "MMM yyyy")}</p>
        {/* <Button></Button> */}
      </div>
      <Button
        onClick={() => onNavigate("NEXT")}
        variant={"secondary"}
        size="icon"
        className="flex items-center"
      >
        <ChevronRightIcon className="size-4" />
      </Button>
    </div>
  );
};

export default CustomToolBar;
