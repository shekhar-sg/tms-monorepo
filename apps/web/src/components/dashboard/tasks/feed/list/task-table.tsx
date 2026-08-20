"use client";

import type { Task } from "@repo/types";
import { useRouter } from "next/navigation";
import {
  taskColumns,
  taskTableFeatures,
} from "@/components/dashboard/tasks/feed/list/task-list-column";
import DataTable from "@/components/dashboard/tasks/feed/shared/data-table";
import { useTaskFeedPreferences } from "@/components/dashboard/tasks/feed/task-feed-preferences-context";

type TaskTableProps = {
  tasks: Task[];
  columnId: string;
};

const TaskTable = ({ tasks, columnId }: TaskTableProps) => {
  const router = useRouter();
  const handleAddTask = () => router.push("/dashboard/tasks/new");
  const { visibleFields } = useTaskFeedPreferences();
  const columnVisibility = {
    priority: visibleFields.includes("priority"),
    members: visibleFields.includes("members"),
    dueDate: visibleFields.includes("dueDate"),
    actions: visibleFields.includes("actions"),
  };

  return (
    <DataTable
      features={taskTableFeatures}
      columns={taskColumns}
      data={tasks}
      getRowId={(task) => task.id}
      emptyMessage="No tasks in this status."
      addButtonProps={{ children: "Add Task", onClick: handleAddTask }}
      columnVisibility={columnVisibility}
    />
  );
};

export default TaskTable;
