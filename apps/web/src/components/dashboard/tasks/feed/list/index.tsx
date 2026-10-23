"use client";
import type { Dispatch, SetStateAction } from "react";
import TaskListGroup from "@/components/dashboard/tasks/feed/list/task-list-group";
import type {
  TaskStatusGroup,
  TasksByStatus,
} from "@/components/dashboard/tasks/feed/task-feed-utils";

export default function ListView({
  columns,
  items,
}: {
  columns: TaskStatusGroup[];
  items: TasksByStatus;
  setColumns: Dispatch<SetStateAction<TaskStatusGroup[]>>;
  setItems: Dispatch<SetStateAction<TasksByStatus>>;
}) {
  return (
    <div className="min-w-0 space-y-6">
      {columns.map((column, index) => (
        <TaskListGroup
          key={column.id}
          index={index}
          id={column.id}
          title={column.title}
          tasks={items[column.id] ?? []}
        />
      ))}
    </div>
  );
}
