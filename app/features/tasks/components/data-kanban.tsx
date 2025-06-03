import { PaginatedTasksResponse } from "convex/schema";
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from "@hello-pangea/dnd";
// import { TaskStatus } from "../schema";
import KanbanColumnHeader from "./kanban-column-header";
import KanbanCard from "./kanban-card";
import { useCallback } from "react";
import { useEditTask } from "../api/use-edit-task";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

interface DataKanbanProps {
  data: PaginatedTasksResponse[];
}
// const boards = [
//   TaskStatus.BACKLOG,
//   TaskStatus.DONE,
//   TaskStatus.IN_PROGRESS,
//   TaskStatus.IN_REVIEW,
//   TaskStatus.TODO,
// ] as const;

type TaskState = Record<string, PaginatedTasksResponse[]>;

const DataKanban = ({ data }: DataKanbanProps) => {
  // const kanbanTasks: TaskState = {
  //   [TaskStatus.BACKLOG]: [],
  //   [TaskStatus.DONE]: [],
  //   [TaskStatus.IN_PROGRESS]: [],
  //   [TaskStatus.IN_REVIEW]: [],
  //   [TaskStatus.TODO]: [],
  // };
  // data[0].

  let kanbanTasks: TaskState = {};

  const kanbanTasksStatus = data[0]?.taskProject.projectTaskStatus ?? [];
  console.log(data);
  console.log(kanbanTasksStatus);

  kanbanTasksStatus.map((task) => {
    kanbanTasks[task] = [];
  });

  // const boards = Object.keys(kanbanBoards?.[0]);
  const boards = data[0]?.taskProject?.projectTaskStatus ?? [];

  console.log("boards", boards);
  const tasks = data.reduce((acc, currentTask) => {
    // check if the status of task is equal to key of the board
    const status = currentTask.status;
    console.log("status", status);

    // const taskStatusKey = Object.keys(acc[0]);
    // console.log("taskStatusKey", taskStatusKey);
    const taskKey = boards.find((key) => key === status);
    console.log("taskKey", taskKey);
    if (!taskKey) throw new Error("Key does not match");
    console.log(acc[0]);
    console.log(acc);
    if (taskKey === status) {
      console.log(acc[taskKey]);
      acc[taskKey].push(currentTask);
    }

    // currentTask.taskProject.projectTaskStatus?.map((task) => {
    //   // get the key of the object
    //   const taskStatusKey = Object.keys(acc[0]);
    //   const taskKey = taskStatusKey.find(key=>key === status);
    //   if(!taskKey) throw new Error("Key does not match")
    //     acc[0][taskKey].push(currentTask)
    //   // const taskStatusKey = acc[0][status];
    //   // if (taskStatusKey === task) {
    //   //   return acc[0][task].push(currentTask);
    //   // }
    // });

    return acc;
  }, kanbanTasks);

  Object.keys(tasks).map((status) => {
    return tasks[status].sort((a, b) => a.position - b.position);
  });

  const editTask = useEditTask();

  const onDragEnd = async (result: DropResult) => {
    if (!result.destination) return;

    const { source, destination } = result;

    const sourceStatus = source.droppableId;
    const destinationStatus = destination.droppableId;

    const sourceColumn = tasks[sourceStatus];
    const destinationColumn = tasks[destinationStatus];

    const noMovement =
      sourceColumn[source.index]?._id ===
      destinationColumn[destination.index]?._id;
    if (noMovement) return;

    if (sourceStatus !== destinationStatus) {
      const sourceTask = sourceColumn[source.index];
      if (!sourceTask) return;

      // ! Check if the destination index  is 0 and the destination task  is undefined, this means the column is empty
      if (destination.index === 0 && !destinationColumn[destination.index]) {
        await editTask({
          taskId: sourceTask._id,
          workspaceId: sourceTask.workspaceId,
          taskPosition: 1000,
          taskStatus: destinationStatus,
          projectId: sourceTask.taskProject._id,
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
          taskStatus: destinationStatus,
          projectId: sourceTask.taskProject._id,
        });
        return;
      }

      // ! Check if the destination card is the last card
      if (destinationColumn[destination.index] === undefined) {
        // ? set the source position to the destination card + 1000
        const newSourceTaskPosition =
          destinationColumn[destination.index - 1].position + 1000;
        await editTask({
          taskId: sourceTask._id,
          workspaceId: sourceTask.workspaceId,
          taskPosition: newSourceTaskPosition,
          taskStatus: destinationStatus,
          projectId: sourceTask.taskProject._id,
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

      //   ? set the  position of the source card to the average of the top card and bottom card(destination card) minus the destination card position

      // Note: THe destination card always moves downwards
      // const destTask = destinationColumn[destination.index];
      // const isTopCard = destination.index === 0;
      // const isBottomCard =
      //   destinationColumn.length ===  2
      //     ? destination.index + 1 === destinationColumn.length
      //     : !!destinationColumn[destination.index + 2];

      // if (!isTopCard && !isBottomCard) {

      // const topToBottom = destination.index < source.index;

      const newPosition =
        destinationColumn[destination.index].position -
        (destinationColumn[destination.index].position -
          destinationColumn[destination.index - 1].position) /
          2;

      await editTask({
        taskId: sourceTask._id,
        workspaceId: sourceTask.workspaceId,
        taskPosition: newPosition,
        projectId: sourceTask.taskProject._id,
        taskStatus: destinationStatus,
        // taskStatus: destinationStatus,
      });

      //   return;
      // }

      // const newPosition =
      //   destTask.position -
      //   (destTask.position - topDestinationCard.position) / 2;

      // await editTask({
      //   taskId: sourceTask._id,
      //   workspaceId: sourceTask.workspaceId,
      //   taskPosition: newPosition,
      //   taskStatus: destinationStatus,
      //   projectId: sourceTask.taskProject._id,
      // });
    }

    if (sourceStatus === destinationStatus) {
      // const [sourceTask] = sourceColumn.slice(source.index, source.index + 1);
      const sourceTask = sourceColumn[source.index];

      // TODO: Check if the top most task is 1000 when moving a task to the top and halve it, or just halve the position of the top most task and assign it to the incoming task
      if (!sourceTask) return;

      // ! Check if the destination index  is 0 and the destination task  is undefined, this means the column is empty
      if (destination.index === 0 && !destinationColumn[destination.index]) {
        // ? This is an impossible state
        await editTask({
          taskId: sourceTask._id,
          workspaceId: sourceTask.workspaceId,
          taskPosition: 1000,
          // taskStatus: destinationStatus,
          projectId: sourceTask.taskProject._id,
        });

        return;
      }
      //!  Check if the destination card is the first card,ie, destination index is 0 and  the first card exists
      if (destination.index === 0 && destinationColumn[destination.index]) {
        // ? set the source position to the destination card divided by 2
        const destTaskPosition = destinationColumn[destination.index].position;
        await editTask({
          taskId: sourceTask._id,
          workspaceId: sourceTask.workspaceId,
          taskPosition: destTaskPosition / 2,
          // taskStatus: destinationStatus,
          projectId: sourceTask.taskProject._id,
        });
        return;
      }

      // ! Check if the destination card is the last card
      if (destinationColumn[destination.index + 1] === undefined) {
        // ? set the source position to the destination card + 1000
        const newSourceTaskPosition =
          destinationColumn[destination.index].position + 1000;
        await editTask({
          taskId: sourceTask._id,
          workspaceId: sourceTask.workspaceId,
          taskPosition: newSourceTaskPosition,
          // taskStatus: destinationStatus,
          projectId: sourceTask.taskProject._id,
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

      const isTopCard = destination.index === 0;
      const isBottomCard = destination.index + 1 === destinationColumn.length;
      const destTask = destinationColumn[destination.index];

      if (!isTopCard && !isBottomCard) {
        const topToBottom = destination.index < source.index;

        const newPosition = topToBottom
          ? destinationColumn[destination.index].position -
            (destinationColumn[destination.index].position -
              destinationColumn[destination.index - 1].position) /
              2
          : destinationColumn[destination.index + 1].position -
            (destinationColumn[destination.index + 1].position -
              destinationColumn[destination.index].position) /
              2;

        await editTask({
          taskId: sourceTask._id,
          workspaceId: sourceTask.workspaceId,
          taskPosition: newPosition,
          projectId: sourceTask.taskProject._id,

          // taskStatus: destinationStatus,
        });

        return;
      }

      //   ? set the  position of the source card to the average of the top card and bottom card(destination card) minus the destination card position

      // const newPosition =
      //   destTask.position -
      //   (topDestinationCard.position - destTask.position) / 2;

      // await editTask({
      //   taskId: sourceTask._id,
      //   workspaceId: sourceTask.workspaceId,
      //   taskPosition: newPosition,
      //   projectId: sourceTask.taskProject._id,

      //   // taskStatus: destinationStatus,
      // });
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
                taskCount={tasks[board].length}
                board={board}
              />
              <Droppable droppableId={board}>
                {(prop) => {
                  return (
                    <div
                      className="min-h-[200px] max-h-[600px] overflow-y-auto py-1.5"
                      {...prop.droppableProps}
                      ref={prop.innerRef}
                    >
                      {tasks[board].map((task, index) => {
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
                                  className="overflow-y-auto"
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

function LoadingKanbanSkeleton() {
  // Create an array of column skeletons
  const columnCount = 5;

  return (
    <div className="flex gap-4 overflow-x-auto pb-4">
      {Array(columnCount)
        .fill(0)
        .map((_, colIndex) => (
          <div key={colIndex} className="min-w-[300px] flex-shrink-0">
            <Card className="h-full">
              <CardHeader className="py-3 px-4">
                <div className="flex justify-between items-center">
                  <Skeleton className="h-5 w-24" />
                  <Skeleton className="h-8 w-8 rounded-full" />
                </div>
              </CardHeader>
              <CardContent className="p-2">
                {/* Random number of tasks per column (2-4) */}
                {Array(Math.floor(Math.random() * 3) + 2)
                  .fill(0)
                  .map((_, taskIndex) => (
                    <SkeletonTaskCard key={taskIndex} />
                  ))}
              </CardContent>
            </Card>
          </div>
        ))}
    </div>
  );
}

function SkeletonTaskCard() {
  return (
    <Card className="mb-2">
      <CardContent className="p-3">
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-3 w-3/4 mb-4" />
        <div className="flex justify-between items-center">
          <Skeleton className="h-5 w-16" />
          <Skeleton className="h-6 w-6 rounded-full" />
        </div>
      </CardContent>
    </Card>
  );
}
