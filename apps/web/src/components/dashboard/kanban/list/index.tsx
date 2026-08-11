import { move } from "@dnd-kit/helpers";
import { DragDropProvider } from "@dnd-kit/react";
import { type Dispatch, type SetStateAction, useRef } from "react";
import type {
  BoardItems,
  Column,
} from "@/components/dashboard/kanban/Board-static-data";
import TaskListGroup from "@/components/dashboard/kanban/list/task-list-group";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ListViewProps {
  columns: Column[];
  items: BoardItems;
  setColumns: Dispatch<SetStateAction<Column[]>>;
  setItems: Dispatch<SetStateAction<BoardItems>>;
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

        if (!source) {
          return;
        }

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
        <div className={"flex flex-col flex-1 gap-4 m-2"}>
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
      </ScrollArea>
    </DragDropProvider>
  );
};

export default ListView;
