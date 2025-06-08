import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CollapsedColumn = {
  projectId: string;
  collapsedColumnName: string[];
};

export type CollapsedColumnDataAndActions = {
  collapsedColumns: CollapsedColumn[] | null;
  //   getAllProjectCollapsedColumn: (projectId: string) => CollapsedColumn[];
  getProjectCollapsedColumn: (projectId: string) => CollapsedColumn | null;
  addCollapsedColumn: ({
    columnName,
    projectId,
  }: {
    columnName: string;
    projectId: string;
  }) => null | void;
  deleteSingleProjectCollapsedColumn: ({
    columnName,
    projectId,
  }: {
    columnName: string;
    projectId: string;
  }) => null | void;
  deleteProjectCollapsedColumns: (projectId: string) => null | void;
};

export const useCollapsedColumn = create<CollapsedColumnDataAndActions>()(
  persist(
    (set, get) => ({
      collapsedColumns: null,
      getProjectCollapsedColumn: (projectId) => {
        const allColumns = get().collapsedColumns;
        if (!allColumns) return null;
        const projectColumn = allColumns.find(
          (data) => data.projectId === projectId
        );
        if (!projectColumn) return null;
        return projectColumn;
      },
      addCollapsedColumn: ({ projectId, columnName }) => {
        const projectColumn = get().getProjectCollapsedColumn(projectId);
        if (projectColumn === null) {
          // create a new project Column
          const newProjectColumn = [columnName];
          //   update the global Collapsed State
          const globalColumns = get().collapsedColumns ?? [];
          set({
            ...get(),
            collapsedColumns: [
              ...globalColumns,
              {
                projectId,
                collapsedColumnName: newProjectColumn,
              },
            ],
          });
        } else {
          // ? Prevent deduplication of the same TaskColumn Name
          const duplicateColumnName =
            projectColumn.collapsedColumnName.includes(columnName);
          if (duplicateColumnName) return null;
          const updatedProjectColumn =
            projectColumn.collapsedColumnName.push(columnName);
          const newCollapsedColumn = get().collapsedColumns?.map((column) => {
            if (column.projectId === projectId) {
              return {
                ...column,
                updatedProjectColumn,
              };
            } else return column;
          });

          set({
            ...get(),
            collapsedColumns: newCollapsedColumn,
          });
        }
      },
      deleteSingleProjectCollapsedColumn: ({ columnName, projectId }) => {
        // First validate that the projectId has a Collapsed Column
        const projectCollapsedColumn =
          get().getProjectCollapsedColumn(projectId);
        if (!projectCollapsedColumn) return null;
        // filter the columnName from the collapsedColumn
        const filteredColumns =
          projectCollapsedColumn.collapsedColumnName.filter(
            (column) => column === columnName
          );
        // update the global CollapsedColumn State
        const newCollapsedColumn = get().collapsedColumns?.map((column) => {
          if (column.projectId === projectId) {
            return {
              ...projectCollapsedColumn,
              collapsedColumnName: filteredColumns,
            };
          } else return column;
        });
        set({
          ...get(),
          collapsedColumns: newCollapsedColumn,
        });
      },
      deleteProjectCollapsedColumns: (projectId) => {
        const projectCollapsedColumn =
          get().getProjectCollapsedColumn(projectId);
        if (!projectCollapsedColumn) return null;
        const allCollapsedColumn = get().collapsedColumns;
        if (!allCollapsedColumn) return null;
        // filter the globalCollapsedColumn
        const newCollapsedColumn = allCollapsedColumn.filter(
          (col) => col.projectId !== projectId
        );
        set({
          ...get(),
          collapsedColumns: newCollapsedColumn,
        });
      },
    }),
    {
      name: "collapsed-columns",
    }
  )
);
