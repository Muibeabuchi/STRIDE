import { Id } from "convex/_generated/dataModel";
import { create } from "zustand";

// Workspace Modal Store
interface WorkspaceModalStore {
  isOpen: boolean;
  open: () => void;
  close: () => void;
}

export const useWorkspaceModalStore = create<WorkspaceModalStore>((set) => ({
  isOpen: false,
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
}));

// Project Modal Store
interface ProjectModalStore {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  selectedProjectId: string | null;
  setSelectedProjectId: (id: string | null) => void;
}

export const useProjectModalStore = create<ProjectModalStore>((set) => ({
  isOpen: false,
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
  selectedProjectId: null,
  setSelectedProjectId: (id) => set({ selectedProjectId: id }),
}));

interface TaskModalStore {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  // selectedProjectId: string | null;
  // setSelectedProjectId: (id: string | null) => void;
}

export const useTaskModalStore = create<TaskModalStore>((set) => ({
  isOpen: false,
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
  // selectedProjectId: null,
  // setSelectedProjectId: (id) => set({ selectedProjectId: id }),
}));

interface EditTaskModalStore {
  // if at askId exists, then the modal should be open
  taskId: Id<"tasks"> | null;
  openEditTaskModal: (taskId: Id<"tasks">) => void;
  closeEditTaskModal: () => void;
}

export const useEditTaskModalStore = create<EditTaskModalStore>((set) => ({
  taskId: null,
  openEditTaskModal: (taskId) =>
    set({
      taskId,
    }),
  closeEditTaskModal: () => set({ taskId: null }),
}));
