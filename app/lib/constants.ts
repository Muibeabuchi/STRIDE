import { SettingsIcon, UsersIcon } from "lucide-react";

import { CheckCircle, CheckCircle2, Home, HomeIcon } from "lucide-react";

export const Routes = [
  {
    label: "Home",
    to: "",
    FilledIcon: HomeIcon,
    Icon: Home,
  },
  {
    label: "My Tasks",
    to: "/tasks",
    Icon: CheckCircle,
    FilledIcon: CheckCircle2,
  },
  {
    label: "Settings",
    to: "/settings",
    FilledIcon: SettingsIcon,
    Icon: SettingsIcon,
  },
  {
    label: "Users",
    to: "/members",
    FilledIcon: UsersIcon,
    Icon: UsersIcon,
  },
] as const;

// type Mutable<T> = {
//   -readonly [P in keyof T]: T[P];
// };

// export type RoutesType = Mutable<typeof Routes>;
