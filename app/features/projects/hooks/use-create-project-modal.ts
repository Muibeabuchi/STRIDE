import { useProjectModalStore } from "@/store/project-modal-store";

export const useCreateProjectModal = () => {
  const { isOpen, open, close, setIsOpen } = useProjectModalStore();

  return {
    isOpen,
    open,
    close,
    setIsOpen,
  };
};
