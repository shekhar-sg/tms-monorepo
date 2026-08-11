"use client";

import type { Task } from "@/components/dashboard/kanban/Board-static-data";
import {
  taskColumns,
  taskTableFeatures,
} from "@/components/dashboard/kanban/list/task-list-column";
import TaskListRow from "@/components/dashboard/kanban/list/task-list-row";
import DataTable from "@/components/dashboard/kanban/shared/data-table";

type TaskTableProps = {
  tasks: Task[];
  columnId: string;
};

const TaskTable = ({ tasks, columnId }: TaskTableProps) => {
  return (
    <DataTable
      features={taskTableFeatures}
      columns={taskColumns}
      data={tasks}
      getRowId={(task) => task.id}
      emptyMessage="No tasks in this status."
      renderRow={(row, index) => (
        <TaskListRow key={row.id} row={row} index={index} columnId={columnId} />
      )}
    />
  );
};

export default TaskTable;
