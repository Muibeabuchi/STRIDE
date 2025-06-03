import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  BarChart2,
  Calendar,
  CheckSquare,
  Home,
  LayoutDashboard,
  Plus,
  Settings,
} from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Suspense } from "react";
import WorkspaceSwitcher, {
  WorkspaceSwitcherSkeleton,
} from "./workspace-switcher";
import { DottedSeparator } from "./doted-separator";
import Navigation from "./navigation";
import Projects from "./projects";

export function AdvancedSidebar() {
  return (
    <Sidebar
      variant="sidebar"
      collapsible="offcanvas"
      className="bg-secondary border-r border-border"
    >
      <SidebarHeader className="border-b border-border p-4">
        <Link to="/" className="flex items-center gap-x-2">
          <p className="font-bold text-muted-foreground text-2xl px-2 font-cursive">
            Stride
          </p>
        </Link>
      </SidebarHeader>

      <SidebarContent className="p-2">
        <SidebarGroup>
          <Suspense fallback={<WorkspaceSwitcherSkeleton />}>
            <WorkspaceSwitcher />
          </Suspense>
        </SidebarGroup>

        <DottedSeparator />

        <SidebarGroup>
          <SidebarGroupContent>
            <Navigation />

            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  tooltip="Reports"
                  className="flex items-center gap-2.5 p-2.5  cursor-pointer  font-medium transition rounded-md "
                >
                  <BarChart2 className="h-5 w-5" />
                  <span>Analytics</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  tooltip="Calendar"
                  className="flex items-center gap-2.5 p-2.5  cursor-pointer  font-medium transition rounded-md "
                >
                  <Calendar className="h-5 w-5" />
                  <span>Calendar</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <Projects />
      </SidebarContent>

      <SidebarFooter className="border-t border-border p-4">
        <div className="flex items-center space-x-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src="/placeholder.svg?height=32&width=32" alt="User" />
            <AvatarFallback className="bg-primary text-primary-foreground">
              JD
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-sidebar-foreground truncate">
              John Doe
            </p>
            <p className="text-xs text-muted-foreground truncate">Admin</p>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
