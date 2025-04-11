// import { UserButton } from "@clerk/tanstack-react-start";
import { MobileSidebar } from "./mobile-sidebar";
import { UserButton } from "./userButton";

function Navbar() {
  return (
    <nav className="pt-4 w-full px-6 flex items-center justify-between">
      <div className="lg:flex hidden flex-col">
        <h1 className="text-2xl font-semibold">Home</h1>
        <p className="text-muted-foreground">
          Monitor all of your projects and tasks here
        </p>
      </div>
      <MobileSidebar />
      <UserButton />
    </nav>
  );
}

export default Navbar;
