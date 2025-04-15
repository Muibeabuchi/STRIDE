import { api } from "convex/_generated/api";
import { useMutation } from "convex/react";

export const useEditTask = () => {
  const editTask = useMutation(api.tasks.edit).withOptimisticUpdate(
    (
      localStore,
      {
        workspaceId,
        taskId,
        taskPosition,
        dueDate,
        assigneeId,
        projectId,
        taskName,
        taskStatus,
        taskDescription,
      }
    ) => {
      console.log("fired optimistic update");
      console.log("projectId", projectId);
      console.log("workspaceId", workspaceId);
      const tasks = localStore.getQuery(api.tasks.get, {
        workspaceId,
        // dueDate,
        // assigneeId,
        // projectId,
        // status: taskStatus,
      });

      console.log("tasks from local store", tasks);
      if (!tasks) return;

      // grab the task we wanna edit
      const taskToEdit = tasks.find((task) => task._id === taskId);
      if (!taskToEdit) return;

      console.log("taskToEdit", taskToEdit);

      const newTaskToEdit: typeof taskToEdit = {
        ...taskToEdit,
        status: taskStatus || taskToEdit.status,
        position: taskPosition || taskToEdit.position,
        // taskName: taskName || taskToEdit.taskName,
        workspaceId,
        // dueDate: dueDate || taskToEdit.dueDate,
        taskProject: {
          ...taskToEdit.taskProject,
          _id: projectId || taskToEdit.taskProject._id,
        },
      };

      const optimisticTasks = tasks.map((task) => {
        return task._id === taskToEdit._id ? newTaskToEdit : task;
      });

      console.log("optimistic tasks", optimisticTasks);

      localStore.setQuery(api.tasks.get, { workspaceId }, optimisticTasks);
    }
  );

  return editTask;
};
