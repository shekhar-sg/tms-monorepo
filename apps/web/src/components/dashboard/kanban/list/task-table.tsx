"use client";

import { useTable } from "@tanstack/react-table";
import { LuPlus } from "react-icons/lu";
import type { Task } from "@/components/dashboard/kanban/Board-static-data";
import {
  taskColumns,
  taskTableFeatures,
} from "@/components/dashboard/kanban/list/task-list-column";
import TaskListRow from "@/components/dashboard/kanban/list/task-list-row";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type TaskTableProps = {
  tasks: Task[];
  columnId: string;
};

const TaskTable = ({ tasks, columnId }: TaskTableProps) => {
  const table = useTable({
    features: taskTableFeatures,
    columns: taskColumns,
    data: tasks,

    getRowId: (task) => task.id,
  });

  return (
    <div className={"overflow-hidden rounded-lg border"}>
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {header.isPlaceholder ? null : (
                    <table.FlexRender header={header} />
                  )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>

        <TableBody>
          {table.getRowModel().rows.length > 0 ? (
            table
              .getRowModel()
              .rows.map((row, index) => (
                <TaskListRow
                  key={row.id}
                  row={row}
                  index={index}
                  columnId={columnId}
                />
              ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={table.getVisibleLeafColumns().length}
                className={"h-20 text-center text-muted-foreground"}
              >
                No tasks in this status.
              </TableCell>
            </TableRow>
          )}
        </TableBody>

        <TableFooter>
          <TableRow>
            <TableCell
              colSpan={table.getVisibleLeafColumns().length}
              className="p-1.5"
            >
              <Button variant={"ghost"}>
                <LuPlus />
                Add Task
              </Button>
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  );
};

export default TaskTable;
