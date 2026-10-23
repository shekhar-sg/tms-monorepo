"use client";

import { useDraggable } from "@dnd-kit/react";

import { useSortable } from "@dnd-kit/react/sortable";

import type { Status, Task } from "@repo/types";
import { format } from "date-fns";
import { CalendarDays, GripVertical, ListChecks } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import type { Ref } from "react";
import { Button } from "@/components/ui/button";
import { PRIORITY_OPTIONS } from "@/lib/tasks/filter-config";
import { cn } from "@/lib/utils";
import TaskActions from "../shared/task-actions";
import { useTaskFeedPreferences } from "../task-feed-preferences-context";

type Props = { task: Task; index: number; group: Status; reorder: boolean };

export default function KanbanCard(props: Props) {
  return props.reorder ? (
    <SortableCard {...props} />
  ) : (
    <DraggableCard {...props} />
  );
}

function SortableCard({ task, index, group }: Props) {
  const { ref, handleRef, isDragging } = useSortable({
    id: task.id,
    index,
    group,
    type: "task",
    accept: "task",
  });

  return (
    <CardContentView
      task={task}
      ref={ref}
      handleRef={handleRef}
      isDragging={isDragging}
    />
  );
}

function DraggableCard({ task }: Props) {
  const { ref, handleRef, isDragging } = useDraggable({
    id: task.id,
    type: "task",
  });

  return (
    <CardContentView
      task={task}
      ref={ref}
      handleRef={handleRef}
      isDragging={isDragging}
    />
  );
}

export function CardContentView({
  task,
  ref,
  handleRef,
  isDragging,
}: {
  task: Task;
  ref?: Ref<HTMLDivElement>;
  handleRef?: (node: Element | null) => void;
  isDragging?: boolean;
}) {
  const path = usePathname();

  const { visibleFields } = useTaskFeedPreferences();

  const priority = PRIORITY_OPTIONS.find((p) => p.value === task.priority);

  const Icon = priority?.icon;

  const overdue =
    task.status !== "DONE" &&
    task.endDate &&
    Date.parse(task.endDate) < new Date().setHours(0, 0, 0, 0);

  return (
    <div
      ref={ref}
      className={cn(
        "group rounded-lg border bg-card p-3.5 shadow-xs transition-[border-color,box-shadow] hover:border-primary/30 hover:shadow-sm",
        isDragging && "opacity-40 ring-2 ring-primary"
      )}
    >
      <div className="mb-2 flex items-center justify-between gap-2">
        <span className="text-[11px] text-muted-foreground truncate">
          {!path.includes("/projects/")
            ? (task.project?.title ?? "Project")
            : `Task · ${task.id.slice(0, 6).toUpperCase()}`}
        </span>
        <div className="flex items-center gap-0.5">
          <Button
            ref={handleRef}
            aria-label={`Move ${task.title}`}
            className="size-6 cursor-grab touch-none text-muted-foreground active:cursor-grabbing"
            size="icon-sm"
            variant="ghost"
          >
            <GripVertical className="size-3.5" />
          </Button>
          {visibleFields.includes("actions") && (
            <TaskActions taskId={task.id} />
          )}
        </div>
      </div>
      <Link
        href={`/dashboard/tasks/${task.id}`}
        className="block text-[13px] leading-5 font-medium line-clamp-3 hover:text-primary"
      >
        {task.title}
      </Link>
      {!!task.labels.length && (
        <div className="mt-3 flex flex-wrap gap-1">
          {task.labels.slice(0, 2).map(({ label }) => (
            <span
              className="rounded bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground"
              key={label.id}
            >
              {label.name}
            </span>
          ))}
          {task.labels.length > 2 && (
            <span className="text-[10px] text-muted-foreground">
              +{task.labels.length - 2}
            </span>
          )}
        </div>
      )}
      <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2 text-[11px] text-muted-foreground">
        {visibleFields.includes("priority") && task.priority !== "NONE" && (
          <span
            className={cn("inline-flex items-center gap-1", priority?.color)}
          >
            {Icon && <Icon className="size-3" />}
            {priority?.label}
          </span>
        )}
        {visibleFields.includes("dueDate") && task.endDate && (
          <span
            className={cn(
              "inline-flex items-center gap-1",
              overdue && "text-destructive"
            )}
          >
            <CalendarDays className="size-3" />
            {format(new Date(task.endDate), "d MMM")}
          </span>
        )}
        {!!task.subtasks.length && (
          <span className="ml-auto inline-flex items-center gap-1 tabular-nums">
            <ListChecks className="size-3" />
            {task.subtasks.filter((s) => s.status === "DONE").length}/
            {task.subtasks.length}
          </span>
        )}
      </div>
    </div>
  );
}
