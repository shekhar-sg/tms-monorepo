"use client";

import { move } from "@dnd-kit/helpers";
import { DragDropProvider } from "@dnd-kit/react";
import { useRef, useState } from "react";
import {
  type BoardItems,
  columns as initialColumns,
  initialItems,
} from "@/components/dashboard/kanban/Board-static-data";
import KanbanCard from "@/components/dashboard/kanban/kanban-card";
import KanbanColumn from "@/components/dashboard/kanban/kanban-column";
import { ScrollArea } from "@/components/ui/scroll-area";

const KanbanBoard = () => {
  const [columns, setColumns] = useState(initialColumns);
  const [items, setItems] = useState<BoardItems>(initialItems);

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
      <ScrollArea
        className={"flex-1 border-none rounded-md border whitespace-nowrap"}
      >
        <div className={"flex flex-1 gap-4 m-2"}>
          {columns.map((column,index) => (
            <KanbanColumn
              key={column.id}
              id={column.id}
              title={column.title}
              index={index}
              isEmpty={items[column.id]!.length === 0}
            >
              {items[column.id]!.map((task, index) => (
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

export default KanbanBoard;
