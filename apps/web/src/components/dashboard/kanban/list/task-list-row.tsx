"use client";

import { useSortable } from "@dnd-kit/react/sortable";
import type { Task } from "@repo/types";
import {
  FlexRender,
  type Row,
  type TableFeatures,
} from "@tanstack/react-table";
import { LuGripVertical } from "react-icons/lu";
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";

type TaskRow = Row<TableFeatures, Task>;

type TaskListRowProps = {
  row: TaskRow;
  index: number;
  columnId: string;
};

const TaskListRow = ({ row, index, columnId }: TaskListRowProps) => {
  const { ref, handleRef, isDragging } = useSortable({
    id: row.original.id,
    index,
    group: columnId,
    type: "task",
    accept: "task",
  });

  return (
    <TableRow
      ref={ref}
      className={cn({
        "opacity-50": isDragging,
      })}
    >
      {row.getVisibleCells().map((cell) => (
        <TableCell key={cell.id}>
          {cell.column.id === "title" ? (
            <div className="flex min-w-0 items-center gap-2">
              <Button
                ref={handleRef}
                variant={"ghost"}
                size={"icon-sm"}
                className={"shrink-0 cursor-grab touch-none"}
                aria-label={`Move ${row.original.title}`}
              >
                <LuGripVertical className="size-4" />
              </Button>

              {row.original.title}
            </div>
          ) : (
            <FlexRender cell={cell} />
          )}
        </TableCell>
      ))}
    </TableRow>
  );
};

export default TaskListRow;
