import { SettingsIcon, UsersIcon } from "lucide-react";

import { CheckCircle, CheckCircle2, Home, HomeIcon } from "lucide-react";

export const Routes = [
  {
    label: "Home" as const,
    to: "" as const,
    FilledIcon: HomeIcon,
    Icon: Home,
  },
  // {
  //   label: "My Tasks" as const,
  //   to: "/tasks" as const,
  //   Icon: CheckCircle,
  //   FilledIcon: CheckCircle2,
  // },
  {
    label: "Settings" as const,
    to: "/settings",
    FilledIcon: SettingsIcon,
    Icon: SettingsIcon,
  },
  {
    label: "Users" as const,
    to: "/members",
    FilledIcon: UsersIcon,
    Icon: UsersIcon,
  },
];
