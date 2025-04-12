import { ResponsiveModal } from "@/components/responsive-modal";
import { useEditTaskModalStore } from "@/store/store";
import { EditTaskFormWrapper } from "./edit-task-form-wrapper";

export const EditTaskModal = () => {
  const { taskId, closeEditTaskModal } = useEditTaskModalStore();
  return (
    <>
      <ResponsiveModal open={!!taskId} onOpenChange={closeEditTaskModal}>
        {taskId && (
          <EditTaskFormWrapper onCancel={closeEditTaskModal} taskId={taskId} />
        )}
      </ResponsiveModal>
    </>
  );
};
