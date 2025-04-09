import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon, Calendar as CalenderIcon } from "lucide-react";
import { Button } from "./ui/button";
import { Calendar } from "./ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { toast } from "sonner";

interface DatePickerProps {
  value: Date | undefined;
  onChange: (date: Date) => void;
  className?: string;
  placeholder?: string;
}

const DatePicker = ({
  onChange,
  value,
  className,
  placeholder = "Select Date",
}: DatePickerProps) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          size="sm"
          variant={"secondary"}
          className={cn(
            "w-full justify-start text-left font-normal px-3",
            !value && "text-muted-foreground",
            className
          )}
        >
          <CalendarIcon className="mr-2 w-4 h-4" />
          {value ? format(value, "PPP") : <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={value}
          initialFocus
          onSelect={(date) => {
            if (!date) return;
            return Date.now() - 24 * 60 * 60 * 1000 >= date.getTime()
              ? toast("Select a date in the future ", {
                  position: "top-center",
                })
              : onChange(date as Date);
          }}
        />
      </PopoverContent>
    </Popover>
  );
};

export default DatePicker;
