import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { Routes } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { Link } from "@tanstack/react-router";

function Navigation() {
  const workspaceId = useWorkspaceId();

  return (
    <ul className="flex flex-col gap-y-2">
      {Routes.map(({ FilledIcon, Icon, label, to }) => {
        const fullHref = `/workspaces/${workspaceId}${to}`;
        return (
          <Link key={label} to={fullHref} activeOptions={{ exact: true }}>
            {({ isActive }) => {
              return (
                <div
                  className={cn(
                    "flex items-center gap-2.5 p-2.5 font-medium transition rounded-md hover:text-primary text-neutral-500",
                    isActive &&
                      "bg-white shadow-sm hover:opacity-100 text-primary"
                  )}
                >
                  {isActive ? (
                    <FilledIcon className="size-5" />
                  ) : (
                    <Icon className="size-5 text-neutral-500" />
                  )}
                  {label}
                </div>
              );
            }}
          </Link>
        );
      })}
    </ul>
  );
}

export default Navigation;
