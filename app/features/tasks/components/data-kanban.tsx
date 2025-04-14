import { PaginatedTasksResponse, taskStatus } from "convex/schema";
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from "@hello-pangea/dnd";
import { TaskStatus } from "../schema";
import KanbanColumnHeader from "./kanban-column-header";
import KanbanCard from "./kanban-card";
import { useCallback } from "react";
import { useEditTask } from "../api/use-edit-task";

interface DataKanbanProps {
  data: PaginatedTasksResponse[];
}
const boards = [
  TaskStatus.BACKLOG,
  TaskStatus.DONE,
  TaskStatus.IN_PROGRESS,
  TaskStatus.IN_REVIEW,
  TaskStatus.TODO,
] as const;

type TaskState = {
  [key in taskStatus]: PaginatedTasksResponse[];
};

const DataKanban = ({ data }: DataKanbanProps) => {
  const kanbanTasks: TaskState = {
    [TaskStatus.BACKLOG]: [],
    [TaskStatus.DONE]: [],
    [TaskStatus.IN_PROGRESS]: [],
    [TaskStatus.IN_REVIEW]: [],
    [TaskStatus.TODO]: [],
  };
  const tasks = data.reduce((acc, currentTask) => {
    acc[currentTask.status as TaskStatus].push(currentTask);
    return acc;
  }, kanbanTasks);

  //   data.forEach((task) => {
  //     kanbanTasks[task.status as TaskStatus].push(task);
  //   });

  Object.keys(tasks).map((status) => {
    tasks[status as TaskStatus].sort((a, b) => a.position - b.position);
  });

  // console.log(tasks);

  const editTask = useEditTask();

  const onDragEnd = async (result: DropResult) => {
    if (!result.destination) return;

    const { source, destination } = result;
    const sourceStatus = source.droppableId as taskStatus;
    const destinationStatus = destination.droppableId as taskStatus;

    const sourceColumn = tasks[sourceStatus];
    const destinationColumn = tasks[destinationStatus];

    const noMovement =
      sourceColumn[source.index]?._id ===
      destinationColumn[destination.index]?._id;
    if (noMovement) return;

    console.log("source task", sourceColumn[source.index]);
    console.log("destination task", destinationColumn[destination.index]);
    console.log(destination);

    // if the destination index is 0 and there is no item there,we set the position to 1000

    //! Check if the destination status is equal to the sourceStatus
    // if (sourceStatus === destinationStatus) {
    //   const [sourceTask] = sourceColumn.slice(source.index, source.index + 1);
    //   if (!sourceTask) return;
    //   const destTask = sourceColumn.find(
    //     (_, index) => destination.index === index
    //   );
    //   if (!destTask) return;

    //   //!  Check if the destination is the first card
    //   if (destination.index === 0) {
    //     // ? set the source position to the destination card divided by 2
    //     return editTask({
    //       taskId: sourceTask._id,
    //       workspaceId: sourceTask.workspaceId,
    //       taskPosition: destTask.position / 2,
    //     });
    //   }

    //   // ! Check if the destination card is the last card
    //   if (!destinationColumn[destination.index + 1]) {
    //     // ? set the source position to the destination card + 1000
    //     return editTask({
    //       taskId: sourceTask._id,
    //       workspaceId: sourceTask.workspaceId,
    //       taskPosition: destTask.position + 1000,
    //     });
    //   }

    //   // ! If the destination card is neither of these,then it must be a middle placement
    //   // TODO: Write logic to enforce that the destination card is between two cards
    //   const topDestinationCard =
    //     destinationColumn[destination.index - 1] ??
    //     (() => {
    //       throw new Error("The destination card does not have a top card");
    //     })();

    //   //   ? set the  position of the source card to the average of the top card and bottom card(destination card) minus the destination card position

    //   const newPosition =
    //     destTask.position -
    //     (topDestinationCard.position - destTask.position) / 2;
    //   return editTask({
    //     taskId: sourceTask._id,
    //     workspaceId: sourceTask.workspaceId,
    //     taskPosition: newPosition,
    //   });
    // }

    if (sourceStatus !== destinationStatus) {
      const [sourceTask] = sourceColumn.slice(source.index, source.index + 1);
      if (!sourceTask) return;

      // ! Check if the destination index  is 0 and the destination task  is undefined, this means the column is empty
      if (destination.index === 0 && !destinationColumn[destination.index]) {
        console.log("fired - first card and there exist no card");

        await editTask({
          taskId: sourceTask._id,
          workspaceId: sourceTask.workspaceId,
          taskPosition: 1000,
          taskStatus: destinationStatus,
        });
        return;
      }
      //!  Check if the destination index is 0 and  the first card exists
      if (destination.index === 0 && destinationColumn[destination.index]) {
        console.log("fired - first card and there exist a card");
        // ? set the source position to the destination card divided by 2
        const destTaskPosition = destinationColumn[destination.index].position;
        await editTask({
          taskId: sourceTask._id,
          workspaceId: sourceTask.workspaceId,
          taskPosition: destTaskPosition / 2,
          taskStatus: destinationStatus,
        });
        return;
      }

      // ! Check if the destination card is the last card
      if (destinationColumn[destination.index] === undefined) {
        console.log(
          "why is this not undefined",
          destinationColumn[destination.index + 2]
        );
        console.log("fired -last card");
        // ? set the source position to the destination card + 1000
        const destTaskPosition =
          destinationColumn[destination.index - 1].position + 1000;
        await editTask({
          taskId: sourceTask._id,
          workspaceId: sourceTask.workspaceId,
          taskPosition: destTaskPosition,
          taskStatus: destinationStatus,
        });
        return;
      }

      console.log("fired- in between");

      // ! If the destination card is neither of these,then it must be a middle placement
      // TODO: Write logic to enforce that the destination card is between two cards
      const topDestinationCard =
        destinationColumn[destination.index - 1] ??
        (() => {
          throw new Error("The destination card does not have a top card");
        })();

      const destTask = destinationColumn[destination.index];

      //   ? set the  position of the source card to the average of the top card and bottom card(destination card) minus the destination card position

      console.log("top-card", topDestinationCard);
      console.log("bottom-card", destTask);
      const newPosition =
        destTask.position -
        (destTask.position - topDestinationCard.position) / 2;

      await editTask({
        taskId: sourceTask._id,
        workspaceId: sourceTask.workspaceId,
        taskPosition: newPosition,
        taskStatus: destinationStatus,
      });
    }

    if (sourceStatus === destinationStatus) {
      const [sourceTask] = sourceColumn.slice(source.index, source.index + 1);
      if (!sourceTask) return;

      // ! Check if the destination index  is 0 and the destination task  is undefined, this means the column is empty
      if (destination.index === 0 && !destinationColumn[destination.index]) {
        await editTask({
          taskId: sourceTask._id,
          workspaceId: sourceTask.workspaceId,
          taskPosition: 1000,
          // taskStatus: destinationStatus,
        });

        return;
      }
      //!  Check if the destination index is 0 and  the first card exists
      if (destination.index === 0 && destinationColumn[destination.index]) {
        // ? set the source position to the destination card divided by 2
        const destTaskPosition = destinationColumn[destination.index].position;
        await editTask({
          taskId: sourceTask._id,
          workspaceId: sourceTask.workspaceId,
          taskPosition: destTaskPosition / 2,
          // taskStatus: destinationStatus,
        });
        return;
      }

      // ! Check if the destination card is the last card
      if (!destinationColumn[destination.index + 1]) {
        // ? set the source position to the destination card + 1000
        const destTaskPosition =
          destinationColumn[destination.index].position + 1000;
        await editTask({
          taskId: sourceTask._id,
          workspaceId: sourceTask.workspaceId,
          taskPosition: destTaskPosition,
          // taskStatus: destinationStatus,
        });
        return;
      }

      // ! If the destination card is neither of these,then it must be a middle placement
      // TODO: Write logic to enforce that the destination card is between two cards
      const topDestinationCard =
        destinationColumn[destination.index - 1] ??
        (() => {
          throw new Error("The destination card does not have a top card");
        })();

      const destTask = destinationColumn[destination.index];

      //   ? set the  position of the source card to the average of the top card and bottom card(destination card) minus the destination card position

      const newPosition =
        destTask.position -
        (topDestinationCard.position - destTask.position) / 2;

      await editTask({
        taskId: sourceTask._id,
        workspaceId: sourceTask.workspaceId,
        taskPosition: newPosition,
        // taskStatus: destinationStatus,
      });
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex overflow-x-auto">
        {boards.map((board) => {
          return (
            <div
              className="flex-1 mx-2 bg-muted p-1.5 rounded-md min-w-[200px] "
              key={board}
            >
              <KanbanColumnHeader
                taskCount={kanbanTasks[board].length}
                board={board}
              />
              <Droppable droppableId={board}>
                {(prop) => {
                  return (
                    <div
                      className="min-h-[200px] py-1.5"
                      {...prop.droppableProps}
                      ref={prop.innerRef}
                    >
                      {kanbanTasks[board].map((task, index) => {
                        return (
                          <Draggable
                            key={task._id}
                            index={index}
                            draggableId={task._id}
                          >
                            {(prop) => {
                              return (
                                <div
                                  {...prop.draggableProps}
                                  {...prop.dragHandleProps}
                                  ref={prop.innerRef}
                                  className=""
                                >
                                  <KanbanCard task={task} />
                                </div>
                              );
                            }}
                          </Draggable>
                        );
                      })}
                      {prop.placeholder}
                    </div>
                  );
                }}
              </Droppable>
            </div>
          );
        })}
      </div>
    </DragDropContext>
  );
};

export default DataKanban;
