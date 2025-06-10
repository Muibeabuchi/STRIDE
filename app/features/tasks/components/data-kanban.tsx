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
import { cn } from "@/lib/utils";
import EmptyKanbanState from "@/components/empty-kanban";
import { useCollapsedColumn } from "@/hooks/use-collapsed-column";
import CollapsedKanbanBoard from "./collapsed-kanban-board";
import AdvancedKanbanCard from "./advanced-kanban-task-card";
import KanbanCardExample from "./advanced-kanban-example";

interface DataKanbanProps {
  data: PaginatedTasksResponse[];
}

type TaskState = Record<string, PaginatedTasksResponse[]>;

const DataKanban = ({ data }: DataKanbanProps) => {
  let kanbanTasks: TaskState = {};
  // grab the collapsed columns from the Global Store/Local Storage
  const collapsedColumns = useCollapsedColumn(
    (state) => state.collapsedColumns
  );

  const projectColumns = useCollapsedColumn((state) =>
    state.getProjectCollapsedColumn(data?.[0]?.taskProject._id)
  );

  const boards = data[0]?.taskProject?.projectTaskStatus ?? [];

  // filter the boards to only show the non-collapsed boards
  const nonCollapsedBoards = boards.filter((board) => {
    if (collapsedColumns === null) {
      return true;
    } else {
      const projectCollapsedColumns = collapsedColumns.find(
        (col) => col.projectId === data[0].taskProject._id
      );
      if (!projectCollapsedColumns) return true;
      const projectCollapsedColumnNames =
        projectCollapsedColumns.collapsedColumnName;
      const isCollapsedBoard = !!projectCollapsedColumnNames.find(
        (status) => status === board.issueName
      );
      if (!isCollapsedBoard) {
        return true;
      } else return false;
    }
  });

  const collapsedBoards = boards
    .map((board) => {
      const colBoard = nonCollapsedBoards.find(
        (col) => col.issueName === board.issueName
      );
      if (colBoard) {
        return null;
      } else return board.issueName;
    })
    .filter((board) => board !== null);

  const collapsedColumnData = collapsedBoards.map((board) => {
    const boardData = data.filter((data) => data.status === board);

    return {
      statusName: board,
      length: boardData.length,
    };
  });

  nonCollapsedBoards.map((task) => {
    kanbanTasks[task.issueName] = [];
  });

  const tasks = data.reduce((acc, currentTask) => {
    // check if the status of task is equal to key of the board
    const status = currentTask.status;

    const taskKey = nonCollapsedBoards.find((key) => key.issueName === status);
    // if (!taskKey) throw new Error("Key does not match");
    if (!taskKey) return acc;
    if (taskKey.issueName === status) {
      acc[taskKey.issueName].push(currentTask);
    }
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
    }
  };

  const noBoards = nonCollapsedBoards.length > 0;

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="h-[calc(100svh-72px)]  overflow-x-auto">
        <div className="flex w-full h-full ">
          {nonCollapsedBoards.length > 0 ? (
            nonCollapsedBoards.map((board) => {
              return (
                <div
                  className={cn(
                    ` ${
                      tasks[board.issueName].length === 0 && "p-0"
                    } flex-1 mx-2 bg-muted p-1.5 h-full min-w-[280px] max-w-[280px] lg:max-w-[400px] lg:min-w-[400px] rounded-md`
                  )}
                  key={board.issueName}
                >
                  <KanbanColumnHeader
                    taskCount={tasks[board.issueName].length}
                    board={board.issueName}
                    projectId={data[0].taskProject._id}
                  />
                  <Droppable droppableId={board.issueName}>
                    {(prop) => {
                      return (
                        <div
                          className={cn(
                            `max-h-[calc(100svh-135px)] scrollbar-hide  w-full overflow-x-hidden overflow-y-auto py-1.5`
                          )}
                          {...prop.droppableProps}
                          ref={prop.innerRef}
                        >
                          {tasks[board.issueName].map((task, index) => {
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
                  {/* <KanbanCardExample /> */}
                </div>
              );
            })
          ) : (
            <EmptyKanbanState
              message={data?.[0] ? "All Columns are Hidden" : undefined}
            />
          )}
          {projectColumns !== null && (
            <CollapsedKanbanBoard
              collapsedStatus={collapsedColumnData}
              noBoards={noBoards}
              projectId={data[0].taskProject._id}
            />
          )}
        </div>
      </div>
      {/* </div> */}
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
