"use client";

import type { Task } from "@repo/types";
import { useRouter } from "next/navigation";
import {
  taskColumns,
  taskTableFeatures,
} from "@/components/dashboard/tasks/feed/list/task-list-column";
import TaskListRow from "@/components/dashboard/tasks/feed/list/task-list-row";
import DataTable from "@/components/dashboard/tasks/feed/shared/data-table";

type TaskTableProps = {
  tasks: Task[];
  columnId: string;
};

const TaskTable = ({ tasks, columnId }: TaskTableProps) => {
  const router = useRouter();
  const handleAddTask = () => router.push("/dashboard/tasks/new");

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
      addButtonProps={{ children: "Add Task", onClick: handleAddTask }}
    />
  );
};

export default TaskTable;
