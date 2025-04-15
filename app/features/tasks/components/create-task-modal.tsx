import { ResponsiveModal } from "@/components/responsive-modal";
import { useTaskModalStore } from "@/store/store";
import {
  CreateTaskFormWrapper,
  CreateTaskFormWrapperSkeleton,
} from "./create-task-form-wrapper";
// import { Suspense } from "react";

export const CreateTaskModal = () => {
  const { taskStatus, close } = useTaskModalStore();
  return (
    <>
      <ResponsiveModal open={!!taskStatus} onOpenChange={close}>
        <CreateTaskFormWrapper />
      </ResponsiveModal>
    </>
  );
};
