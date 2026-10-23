"use client";
import { CollisionPriority } from "@dnd-kit/abstract";
import { useDroppable } from "@dnd-kit/react";
import Link from "next/link";
import { useCreateTaskHref } from "@/hooks/tasks/use-create-task-href";
import type { TaskStatusGroup, TasksByStatus } from "../task-feed-utils";
import TaskTable from "./task-table";
export default function ListView({
  columns,
  items,
  reorder,
}: {
  columns: TaskStatusGroup[];
  items: TasksByStatus;
  reorder: boolean;
}) {
  return (
    <div className="space-y-5">
      {columns.map((column) => (
        <Group
          key={column.id}
          column={column}
          tasks={items[column.id]}
          reorder={reorder}
        />
      ))}
    </div>
  );
}
function Group({
  column,
  tasks,
  reorder,
}: {
  column: TaskStatusGroup;
  tasks: TasksByStatus[keyof TasksByStatus];
  reorder: boolean;
}) {
  const createHref = useCreateTaskHref();
  const { ref, isDropTarget } = useDroppable({
    id: column.id,
    accept: "task",
    collisionPriority: CollisionPriority.Low,
  });
  return (
    <section
      ref={ref}
      className={isDropTarget ? "rounded-lg ring-2 ring-primary/40" : ""}
    >
      <h2 className="mb-2 flex items-center gap-2 text-xs font-semibold">
        <span className={`status-dot status-${column.id}`} />
        {column.title}
        <span className="text-muted-foreground font-normal">
          {tasks.length}
        </span>
      </h2>
      {tasks.length ? (
        <TaskTable tasks={tasks} columnId={column.id} reorder={reorder} />
      ) : (
        <div className="flex min-h-12 items-center justify-between rounded-lg border border-dashed px-4 text-xs text-muted-foreground">
          <span>Drop a task here</span>
          <Link
            className="hover:text-primary"
            href={`${createHref}${createHref.includes("?") ? "&" : "?"}status=${column.id}`}
          >
            + Add task
          </Link>
        </div>
      )}
    </section>
  );
}
