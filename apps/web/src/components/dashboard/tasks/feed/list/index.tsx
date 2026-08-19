"use client";

import { move } from "@dnd-kit/helpers";
import { DragDropProvider } from "@dnd-kit/react";
import { type Dispatch, type SetStateAction, useRef } from "react";
import TaskListGroup from "@/components/dashboard/tasks/feed/list/task-list-group";
import type {
  TaskStatusGroup,
  TasksByStatus,
} from "@/components/dashboard/tasks/feed/task-feed-utils";

interface ListViewProps {
  columns: TaskStatusGroup[];
  items: TasksByStatus;
  setColumns: Dispatch<SetStateAction<TaskStatusGroup[]>>;
  setItems: Dispatch<SetStateAction<TasksByStatus>>;
}

const ListView = (props: ListViewProps) => {
  const { items, columns, setItems, setColumns } = props;
  const previousItems = useRef(items);
  const previousColumns = useRef(columns);

  return (
    <DragDropProvider
      onDragStart={() => {
        previousItems.current = items;
        previousColumns.current = columns;
      }}
      onDragOver={(event) => {
        const { source } = event.operation;
        if (!source) return;

        if (source.type === "task") {
          setItems((current) => move(current, event));
        }

        if (source.type === "column") {
          setColumns((current) => move(current, event));
        }
      }}
      onDragEnd={(event) => {
        if (event.canceled) {
          setItems(previousItems.current);
          setColumns(previousColumns.current);
        }
      }}
    >
      <div
        className={
          "h-[calc(100svh-150px)] rounded-md overflow-y-scroll no-scrollbar"
        }
      >
        <div className={"flex flex-col gap-4 m-2"}>
          {columns.map((column, index) => {
            const tasks = items[column.id] ?? [];
            return (
              <TaskListGroup
                key={column.id}
                index={index}
                id={column.id}
                title={column.title}
                tasks={tasks}
              />
            );
          })}
        </div>
      </div>
    </DragDropProvider>
  );
};

export default ListView;
