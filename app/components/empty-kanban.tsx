import { useTaskModalStore } from "@/store/store";
import { PlusIcon } from "lucide-react";

const EmptyKanbanState = ({ message }: { message?: string }) => {
  const { open } = useTaskModalStore();
  function handleOpenTaskModal() {
    open("All");
  }
  return (
    <div className="flex flex-col items-center justify-center w-full min-h-[60vh] px-4 py-8 text-center">
      <div className="relative mb-6">
        <img
          src="/public/undraw_scrum-board_uqku.png"
          width={300}
          height={300}
          alt="No tasks available image"
          className="hidden lg:block"
        />
      </div>

      {/* Main Message */}
      <div className="max-w-sm md:max-w-md">
        {!message && (
          <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-2">
            No tasks yet
          </h3>
        )}
        <p className="text-sm md:text-base text-gray-500 leading-relaxed mb-6">
          {message
            ? message
            : "Your kanban board is empty. Create your first task to get started and organize your workflow."}
        </p>
      </div>

      {/* Action Button */}
      {!message && (
        <button
          onClick={handleOpenTaskModal}
          className="inline-flex items-center px-4 py-2.5 bg-gray-900 hover:bg-gray-800 text-white text-sm font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-900  focus:ring-offset-2"
        >
          <PlusIcon size={26} className="pr-2" />
          Create first task
        </button>
      )}

      {/* Subtle background pattern */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-gradient-to-r from-blue-50 to-purple-50 rounded-full blur-3xl opacity-30"></div>
        <div className="absolute bottom-1/3 right-1/4 w-24 h-24 bg-gradient-to-r from-gray-50 to-blue-50 rounded-full blur-2xl opacity-20"></div>
      </div>
    </div>
  );
};

export default EmptyKanbanState;
