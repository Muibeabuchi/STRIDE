import { useRouterState } from "@tanstack/react-router";
import { MobileSidebar } from "./mobile-sidebar";
import { UserButton } from "./userButton";
import { SidebarTrigger } from "./ui/sidebar";

const pathnameMap = {
  tasks: {
    title: "My Tasks",
    description: "Monitor all of your Workspace Tasks  here",
  },
  projects: {
    title: "My Projects",
    description: "Monitor all of your Workspace Projects  here",
  },
};

function Navbar() {
  const { location } = useRouterState();

  // split the location.pathname string by "/" and check in the array to see if it includes "tasks" or "projects"
  const pathnameArray = location.pathname.split("/");

  const pathnameData = pathnameArray.includes("tasks")
    ? pathnameMap.tasks
    : pathnameArray.includes("projects")
    ? pathnameMap.projects
    : null;

  return (
    <div className="w-full items-center flex justify-between">
      <SidebarTrigger className="ml-2 z-50 mt-4" />
      <nav className="pt-4 w-full px-6 flex items-center justify-between">
        <div className="lg:flex hidden flex-col">
          <h1 className="text-2xl font-semibold">
            {pathnameData ? pathnameData.title : "Home"}
          </h1>
          <p className="text-muted-foreground">
            {pathnameData
              ? pathnameData.description
              : "Monitor all of your Tasks and Projects here"}
          </p>
        </div>
        {/* <MobileSidebar /> */}
        <div className="ml-auto lg:ml-0">
          <UserButton />
        </div>
      </nav>
    </div>
  );
}

export default Navbar;
