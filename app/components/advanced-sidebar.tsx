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
import { useTheme } from "next-themes";

export function AdvancedSidebar() {
  const { theme } = useTheme();
  return (
    <Sidebar
      variant="sidebar"
      collapsible="offcanvas"
      className="bg-secondary border-r border-border"
    >
      <SidebarHeader className="border-b border-border p-4">
        {/* <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-semibold text-sm">
              P
            </span>
          </div>
          <span className="font-semibold text-lg text-sidebar-foreground">
            ProjectHub
          </span>
        </div> */}
        <Link to="/" className="flex items-center gap-x-2">
          {/* {theme === "light" ? (
            <img
              src="/public/stride_dark_mode_512x512.png"
              alt="logo"
              width={50}
              height={50}
              className="hidden lg:block"
            />
          ) : (
            <img
              src="/public/ChatGPT Image May 26, 2025, 01_40_32 AM.png"
              alt="logo"
              className="hidden lg:block"
              width={50}
              height={50}
            />
          )} */}
          <p className="font-bold text-muted-foreground text-2xl px-2 font-cursive">
            Stride
          </p>
        </Link>
      </SidebarHeader>

      <SidebarContent className="p-2">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  tooltip="Home"
                  className="w-full justify-start"
                >
                  <Home className="h-5 w-5" />
                  <span>Home</span>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton
                  tooltip="Dashboard"
                  className="w-full justify-start"
                >
                  <LayoutDashboard className="h-5 w-5" />
                  <span>Dashboard</span>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton
                  tooltip="Tasks"
                  className="w-full justify-start"
                >
                  <CheckSquare className="h-5 w-5" />
                  <span>Tasks</span>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton
                  tooltip="Calendar"
                  className="w-full justify-start"
                >
                  <Calendar className="h-5 w-5" />
                  <span>Calendar</span>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton
                  tooltip="Reports"
                  className="w-full justify-start"
                >
                  <BarChart2 className="h-5 w-5" />
                  <span>Reports</span>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton
                  tooltip="Settings"
                  isActive
                  className="w-full justify-start"
                >
                  <Settings className="h-5 w-5" />
                  <span>Settings</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-medium text-muted-foreground uppercase tracking-wider px-2">
            Projects
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  tooltip="mvp-1"
                  className="w-full justify-start"
                >
                  <div className="h-5 w-5 rounded bg-chart-1/20 flex items-center justify-center">
                    <span className="text-xs font-medium text-chart-1">M</span>
                  </div>
                  <span>mvp-1</span>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton
                  tooltip="Website Redesign"
                  className="w-full justify-start"
                >
                  <div className="h-5 w-5 rounded bg-chart-2/20 flex items-center justify-center">
                    <span className="text-xs font-medium text-chart-2">W</span>
                  </div>
                  <span>Website Redesign</span>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton
                  tooltip="Mobile App"
                  className="w-full justify-start"
                >
                  <div className="h-5 w-5 rounded bg-chart-3/20 flex items-center justify-center">
                    <span className="text-xs font-medium text-chart-3">A</span>
                  </div>
                  <span>Mobile App</span>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton
                  tooltip="New Project"
                  className="w-full justify-start"
                >
                  <Plus className="h-5 w-5" />
                  <span>New Project</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
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
