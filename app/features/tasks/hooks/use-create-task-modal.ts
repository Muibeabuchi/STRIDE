import { useWorkspaceModalStore } from "@/store/store";

export const useCreateWorkspaceModal = () => {
  const { isOpen, open, close } = useWorkspaceModalStore();

  return {
    isOpen,
    open,
    close,
    setIsOpen: (value: boolean) => (value ? open() : close()),
  };
};
