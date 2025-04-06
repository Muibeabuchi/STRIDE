import { create } from "zustand";

interface ProjectModalStore {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  setIsOpen: (value: boolean) => void;
}

export const useProjectModalStore = create<ProjectModalStore>((set) => ({
  isOpen: false,
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
  setIsOpen: (value) => set({ isOpen: value }),
}));
