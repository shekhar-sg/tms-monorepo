"use client";

import type { Task } from "@repo/types";
import { usePathname, useRouter } from "next/navigation";
import {
  taskColumns,
  taskTableFeatures,
} from "@/components/dashboard/tasks/feed/list/task-list-column";
import DataTable from "@/components/dashboard/tasks/feed/shared/data-table";
import { useTaskFeedPreferences } from "@/components/dashboard/tasks/feed/task-feed-preferences-context";
import { useCreateTaskHref } from "@/hooks/tasks/use-create-task-href";
import TaskListRow from "./task-list-row";

type TaskTableProps = {
  tasks: Task[];
  columnId: string;
  reorder: boolean;
};

const TaskTable = ({ tasks, columnId, reorder }: TaskTableProps) => {
  const path = usePathname();
  const createHref = useCreateTaskHref();
  const router = useRouter();
  const handleAddTask = () =>
    router.push(
      `${createHref}${createHref.includes("?") ? "&" : "?"}status=${columnId}`
    );
  const { visibleFields } = useTaskFeedPreferences();
  const columnVisibility = {
    project: !path.includes("/projects/"),
    priority: visibleFields.includes("priority"),
    members: visibleFields.includes("members"),
    dueDate: visibleFields.includes("dueDate"),
    actions: visibleFields.includes("actions"),
  };

  return (
    <DataTable
      tableClassName="min-w-[660px] table-fixed [&_th:first-child]:w-[36%] [&_th:last-child]:w-20"
      features={taskTableFeatures}
      columns={taskColumns}
      data={tasks}
      renderRow={(row, index) => (
        <TaskListRow
          key={row.id}
          row={row}
          index={index}
          columnId={columnId}
          reorder={reorder}
        />
      )}
      getRowId={(task) => task.id}
      emptyMessage="No tasks in this status."
      addButtonProps={{ children: "Add Task", onClick: handleAddTask }}
      columnVisibility={columnVisibility}
    />
  );
};

export default TaskTable;
