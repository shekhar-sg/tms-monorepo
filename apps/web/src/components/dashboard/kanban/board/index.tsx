"use client";

import { move } from "@dnd-kit/helpers";
import { DragDropProvider, type DragEndEvent } from "@dnd-kit/react";
import { type Dispatch, type SetStateAction, useRef } from "react";
import type {
  BoardItems,
  Column,
} from "@/components/dashboard/kanban/Board-static-data";
import KanbanCard from "@/components/dashboard/kanban/board/kanban-card";
import KanbanColumn from "@/components/dashboard/kanban/board/kanban-column";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useMoveTask } from "@/hooks/tasks/use-tasks";

interface KanbanBoardProps {
  columns: Column[];
  items: BoardItems;
  setColumns: Dispatch<SetStateAction<Column[]>>;
  setItems: Dispatch<SetStateAction<BoardItems>>;
}

const Board = (props: KanbanBoardProps) => {
  const { columns, setColumns, items, setItems } = props;
  const { mutate: moveTaskMutation } = useMoveTask();

  const previousItems = useRef(items);
  const previousColumns = useRef(columns);

  const handleDragEnd = (event: DragEndEvent) => {
    if (event.canceled) {
      setItems(previousItems.current);
      setColumns(previousColumns.current);
      return;
    }

    const { source } = event.operation;

    if (!source || source.type !== "task") {
      return;
    }

    const taskId = String(source.id);

    const position = getTaskPosition(items, columns, taskId);

    if (!position) {
      return;
    }

    moveTaskMutation({
      taskId,
      data: position,
    },{      onError: () => {
        setItems(previousItems.current);
      },});
  };

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
      onDragEnd={handleDragEnd}
    >
      <ScrollArea className="flex-1 border-none rounded-md border whitespace-nowrap">
        <div className="flex flex-1 gap-4 m-2">
          {columns.map((column, index) => (
            <KanbanColumn
              key={column.id}
              id={column.id}
              title={column.title}
              index={index}
              isEmpty={items[column.id].length === 0}
            >
              {items[column.id].map((task, index) => (
                <KanbanCard
                  key={task.id}
                  id={task.id}
                  index={index}
                  column={column.id}
                  title={task.title}
                />
              ))}
            </KanbanColumn>
          ))}
        </div>
      </ScrollArea>
    </DragDropProvider>
  );
};

export default Board;

const getTaskPosition = (
  items: BoardItems,
  columns: Column[],
  taskId: string
) => {
  for (const column of columns) {
    const tasks = items[column.id];

    const index = tasks.findIndex((task) => task.id === taskId);

    if (index === -1) {
      continue;
    }

    const beforeTask = tasks[index - 1];
    const afterTask = tasks[index + 1];

    return {
      status: column.id,
      beforeTaskId: beforeTask?.id ?? null,
      afterTaskId: afterTask?.id ?? null,
    };
  }

  return null;
};
