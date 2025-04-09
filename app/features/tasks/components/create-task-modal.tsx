import { ResponsiveModal } from "@/components/responsive-modal";
import { useTaskModalStore } from "@/store/store";
import {
  CreateTaskFormWrapper,
  CreateTaskFormWrapperSkeleton,
} from "./create-task-form-wrapper";
import { Suspense } from "react";

export const CreateTaskModal = () => {
  const { isOpen, close } = useTaskModalStore();
  return (
    <>
      <ResponsiveModal open={isOpen} onOpenChange={close}>
        <Suspense fallback={<CreateTaskFormWrapperSkeleton />}>
          <CreateTaskFormWrapper />
        </Suspense>
      </ResponsiveModal>
    </>
  );
};
