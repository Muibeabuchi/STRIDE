import Navbar from "@/components/navbar";
import { CreateWorkspaceModal } from "@/features/workspaces/components/create-workspace-modal";
import { Outlet } from "@tanstack/react-router";
import { createFileRoute } from "@tanstack/react-router";
import { CreateProjectModal } from "@/features/projects/components/create-project-modal";
import { CreateTaskModal } from "@/features/tasks/components/create-task-modal";
import { EditTaskModal } from "@/features/tasks/components/edit-task-modal";
import { useProtectAuthPage } from "@/hooks/use-protect-auth-page";
import { AdvancedSidebar } from "@/components/advanced-sidebar";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";

export const Route = createFileRoute("/(dashboard)/_dashboard")({
  component: DashboardLayout,
});

function DashboardLayout() {
  const { showAuthContent } = useProtectAuthPage();
  if (!showAuthContent) return null;
  return (
    <div className="h-screen w-full">
      <CreateWorkspaceModal />
      <CreateProjectModal />
      <CreateTaskModal />
      <EditTaskModal />
      <div className="flex h-screen w-full overflow-y-hidden">
        {/* <div className="fixed left-0 top-0 hidden lg:block lg:w-[264px] h-full overflow-y-auto"> */}
        {/* <Sidebar /> */}
        <AdvancedSidebar />
        {/* </div> */}
        {/* <div className="lg:pl-[264px] w-full"> */}
        <SidebarInset className="flex-1 flex flex-col h-full min-w-0">
          <div className="mx-auto max-w-screen-2xl border-b relative w-full h-full">
            <SidebarTrigger className="ml-5.5 p-4 z-50 mt-5 absolute" />
            <main
              className=" w-full py-4 px-6 
            h-[calc(100%-0px)]
              border-b border-red-600 flex flex-col"
            >
              <Outlet />
            </main>
          </div>
        </SidebarInset>
        {/* </div> */}
      </div>
    </div>
  );
}
