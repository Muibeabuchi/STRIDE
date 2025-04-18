import { api } from "convex/_generated/api";
import { useMutation } from "convex/react";

export const useEditTask = () => {
  const editTask = useMutation(api.tasks.edit).withOptimisticUpdate(
    (
      localStore,
      { workspaceId, taskId, taskPosition, projectId, taskStatus }
    ) => {
      const tasks = localStore.getQuery(api.tasks.get, {
        workspaceId,
      });

      if (!tasks) {
        const tasksFromProjects = localStore.getQuery(api.tasks.get, {
          workspaceId,
          projectId,
        });
        if (!tasksFromProjects) return;

        // grab the task we wanna edit
        const taskToEdit = tasksFromProjects.find(
          (task) => task._id === taskId
        );
        if (!taskToEdit) return;

        const newTaskToEdit: typeof taskToEdit = {
          ...taskToEdit,
          status: taskStatus || taskToEdit.status,
          position: taskPosition || taskToEdit.position,
        };

        const optimisticTasks = tasksFromProjects.map((task) => {
          return task._id === taskToEdit._id ? newTaskToEdit : task;
        });

        localStore.setQuery(
          api.tasks.get,
          { workspaceId, projectId },
          optimisticTasks
        );
      }

      if (!tasks) return;

      // grab the task we wanna edit
      const taskToEdit = tasks.find((task) => task._id === taskId);
      if (!taskToEdit) return;

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

      localStore.setQuery(api.tasks.get, { workspaceId }, optimisticTasks);
    }
  );

  return editTask;
};
