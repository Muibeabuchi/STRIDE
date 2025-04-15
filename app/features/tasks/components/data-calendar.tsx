import { PaginatedTasksResponse } from "convex/schema";

import {
  format,
  getDay,
  parse,
  startOfWeek,
  addMonths,
  subMonths,
} from "date-fns";
import { enUS } from "date-fns/locale";
import React, { useState } from "react";

import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import EventCard from "./event-card";
import { useNavigate } from "@tanstack/react-router";
import { Id } from "convex/_generated/dataModel";
import CustomToolBar from "./custom-tool-bar";
// import "data-calendar.css";

const locales = {
  "en-US": enUS,
};

const localizer = dateFnsLocalizer({
  format,
  startOfWeek,
  locales,
  getDay,
  parse,
});

interface DataCalendarProps {
  data: PaginatedTasksResponse[];
}

const DataCalendar = ({ data }: DataCalendarProps) => {
  const [value, setValue] = useState(
    data.length > 0 ? new Date(data[0].dueDate) : new Date()
  );

  const events = data.map((task) => ({
    start: new Date(task.dueDate),
    end: new Date(task.dueDate),
    title: task.taskName,
    project: task.taskProject,
    status: task.status,
    assignee: task.memberUser.user._id,
    id: task._id,
  }));

  const handleNavigation = (action: "PREV" | "NEXT" | "TODAY") => {
    if (action === "PREV") {
      setValue(subMonths(value, 1));
    }
    if (action === "NEXT") {
      setValue(addMonths(value, 1));
    }
    if (action === "TODAY") {
      setValue(new Date());
    }
  };
  const navigate = useNavigate();
  const handleEventCardClick = (
    e: React.MouseEvent<HTMLDivElement>,
    taskId: Id<"tasks">,
    workspaceId: Id<"workspaces">
  ) => {
    e.preventDefault();
    navigate({
      // ? Navigate to "workspaces/$workspaceId/tasks/$taskId"
      to: "/workspaces/$workspaceId/tasks/$taskId",
      params: {
        workspaceId,
        taskId,
      },
    });
  };
  return (
    <Calendar
      localizer={localizer}
      date={value}
      events={events}
      views={["month"]}
      defaultView="month"
      toolbar
      showAllEvents
      className="h-full"
      max={new Date(new Date().setFullYear(new Date().getFullYear() + 1))}
      formats={{
        weekdayFormat: (date, culture, localizer) =>
          localizer?.format(date, "EEE", culture) ?? "",
      }}
      components={{
        eventWrapper: ({ event }) => (
          <EventCard {...event} onClick={handleEventCardClick} />
        ),
        toolbar: () => (
          <CustomToolBar date={value} onNavigate={handleNavigation} />
        ),
      }}
    />
  );
};

export default DataCalendar;
