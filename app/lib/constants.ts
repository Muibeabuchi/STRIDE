import {
  CircleDashed,
  SettingsIcon,
  Shield,
  SignalHigh,
  SignalLow,
  SignalMedium,
  UsersIcon,
} from "lucide-react";

import { Home, HomeIcon } from "lucide-react";

export const TaskPriorityIconMapper = {
  0: CircleDashed,
  1: SignalLow,
  2: SignalMedium,
  3: SignalHigh,
  4: Shield,
} as const;

export const Routes = [
  {
    label: "Home",
    to: "",
    FilledIcon: HomeIcon,
    Icon: Home,
  },
  // {
  //   label: "My Tasks",
  //   to: "/tasks",
  //   Icon: CheckCircle,
  //   FilledIcon: CheckCircle2,
  // },
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
