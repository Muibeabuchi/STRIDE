import { PlusIcon } from "lucide-react";

const EmptyKanbanState = () => {
  return (
    <div className="flex flex-col items-center justify-center w-full min-h-[60vh] px-4 py-8 text-center">
      {/* Icon Container */}
      <div className="relative mb-6">
        {/* <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center shadow-sm"> */}
        {/* <svg
            className="w-8 h-8 md:w-10 md:h-10 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg> */}
        {/* </div> */}
        {/* Subtle decoration dots */}
        {/* <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full opacity-20"></div>
        <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-purple-500 rounded-full opacity-20"></div> */}
        <img
          src="/public/undraw_scrum-board_uqku.png"
          width={300}
          height={300}
          alt="No tasks available image"
        />
      </div>

      {/* Main Message */}
      <div className="max-w-sm md:max-w-md">
        <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-2">
          No tasks yet
        </h3>
        <p className="text-sm md:text-base text-gray-500 leading-relaxed mb-6">
          Your kanban board is empty. Create your first task to get started and
          organize your workflow.
        </p>
      </div>

      {/* Action Button */}
      <button className="inline-flex items-center px-4 py-2.5 bg-gray-900 hover:bg-gray-800 text-white text-sm font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-900  focus:ring-offset-2">
        {/* <svg
          className="w-4 h-4 mr-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 4v16m8-8H4"
          />
        </svg> */}
        <PlusIcon size={26} className="pr-2" />
        Create first task
      </button>

      {/* Secondary Actions */}
      {/* <div className="flex flex-col sm:flex-row items-center gap-4 mt-8 text-sm text-gray-400">
        <button className="hover:text-gray-600 transition-colors duration-200 flex items-center">
          <svg
            className="w-4 h-4 mr-1.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          Learn about kanban
        </button>

        <div className="hidden sm:block w-1 h-1 bg-gray-300 rounded-full"></div>

        <button className="hover:text-gray-600 transition-colors duration-200 flex items-center">
          <svg
            className="w-4 h-4 mr-1.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"
            />
          </svg>
          Import tasks
        </button>
      </div> */}

      {/* Subtle background pattern */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-gradient-to-r from-blue-50 to-purple-50 rounded-full blur-3xl opacity-30"></div>
        <div className="absolute bottom-1/3 right-1/4 w-24 h-24 bg-gradient-to-r from-gray-50 to-blue-50 rounded-full blur-2xl opacity-20"></div>
      </div>
    </div>
  );
};

export default EmptyKanbanState;
