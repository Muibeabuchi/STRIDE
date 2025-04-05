import { DottedSeparator } from "./doted-separator";
import Navigation from "./navigation";
import WorkspaceSwitcher, {
  WorkspaceSwitcherSkeleton,
} from "./workspace-switcher";
import { Link } from "@tanstack/react-router";
import { Suspense } from "react";
// import Projects from "./projects";

function Sidebar() {
  return (
    <aside className="h-full bg-neutral-100 p-4 w-full ">
      <Link to="/">
        <div className="flex items-center gap-x-2">
          <img src="/logo.svg" alt="logo" width={50} height={50} />
          <p>INRI-TEAM</p>
        </div>
      </Link>
      <DottedSeparator className="my-4" />
      <Suspense fallback={<WorkspaceSwitcherSkeleton />}>
        <WorkspaceSwitcher />
      </Suspense>
      <DottedSeparator className="my-4" />
      <Navigation />
      <DottedSeparator className="my-4" />
      {/* <Suspense fallback={<ProjectsSkeleton />}>
        <Projects />
      </Suspense> */}
    </aside>
  );
}

export default Sidebar;
