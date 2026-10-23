"use client";
import { move } from "@dnd-kit/helpers";
import { DragDropProvider, type DragEndEvent } from "@dnd-kit/react";
import type { Task } from "@repo/types";
import { useQueryClient } from "@tanstack/react-query";
import { type ReactNode, useEffect, useRef, useState } from "react";
import { toast } from "@/components/ui/toast";
import { taskKeys } from "@/hooks/tasks/task-keys";
import { moveTask } from "@/lib/api/tasks-api";
import { type MoveIntent, replayMoves } from "@/lib/tasks/ordering";
import type { TaskStatusGroup, TasksByStatus } from "./task-feed-utils";

export function TaskOrdering({
  tasks,
  manual,
  columns,
  onColumnsChange,
  children,
}: {
  tasks: Task[];
  manual: boolean;
  columns: TaskStatusGroup[];
  onColumnsChange?: (columns: TaskStatusGroup[], persist?: boolean) => void;
  children: (items: TasksByStatus) => ReactNode;
}) {
  const queryClient = useQueryClient();
  const base = useRef(tasks);
  const queue = useRef<MoveIntent[]>([]);
  const processing = useRef(false);
  const dragging = useRef(false);
  const [count, setCount] = useState(0);
  const [items, setItems] = useState(() => replayMoves(tasks, []));
  const current = useRef(items);
  const snapshot = useRef(items);
  const originalColumns = useRef(columns);
  const publish = (next: TasksByStatus) => {
    current.current = next;
    setItems(next);
  };
  useEffect(() => {
    if (!processing.current && !dragging.current) {
      base.current = tasks;
      const next = replayMoves(tasks, []);
      current.current = next;
      setItems(next);
    }
  }, [tasks]);
  const flush = async () => {
    if (processing.current) return;
    processing.current = true;
    while (queue.current.length) {
      const intent = queue.current[0]!;
      const task = base.current.find((t) => t.id === intent.taskId);
      try {
        const saved = await moveTask({
          taskId: intent.taskId,
          data: { ...intent.data, revision: task?.revision },
        });
        base.current = base.current.map((t) => (t.id === saved.id ? saved : t));
        queryClient.setQueryData(taskKeys.detail(saved.id), saved);
      } catch {
        toast.add({
          title: "Move could not be saved",
          description:
            "The task was restored. Refresh if another session changed the order.",
          type: "error",
        });
      }
      queue.current.shift();
      setCount(queue.current.length);
      if (!dragging.current) publish(replayMoves(base.current, queue.current));
    }
    processing.current = false;
    void queryClient.invalidateQueries({ queryKey: taskKeys.all });
    void queryClient.invalidateQueries({ queryKey: ["projects"] });
  };
  const end = (event: DragEndEvent) => {
    dragging.current = false;
    if (event.canceled) {
      onColumnsChange?.(originalColumns.current, false);
      publish(replayMoves(base.current, queue.current));
      return;
    }
    const source = event.operation.source;
    if (source?.type === "column") {
      onColumnsChange?.(columns, true);
      return;
    }
    if (source?.type !== "task") return;
    const taskId = String(source.id);
    const oldStatus = columns.find((c) =>
      snapshot.current[c.id].some((t) => t.id === taskId)
    )?.id;
    const status = columns.find((c) =>
      current.current[c.id].some((t) => t.id === taskId)
    )?.id;
    if (!status || (!manual && status === oldStatus)) {
      publish(replayMoves(base.current, queue.current));
      return;
    }
    const target = current.current[status];
    const index = target.findIndex((t) => t.id === taskId);
    const intent: MoveIntent = {
      taskId,
      data: {
        status,
        beforeTaskId: manual ? (target[index - 1]?.id ?? null) : null,
        afterTaskId: manual ? (target[index + 1]?.id ?? null) : null,
      },
    };
    const oldIds = snapshot.current[status].map((t) => t.id).join();
    if (status === oldStatus && oldIds === target.map((t) => t.id).join())
      return;
    queue.current.push(intent);
    setCount(queue.current.length);
    publish(replayMoves(base.current, queue.current));
    void flush();
  };
  return (
    <DragDropProvider
      onDragStart={() => {
        dragging.current = true;
        snapshot.current = current.current;
        originalColumns.current = columns;
      }}
      onDragOver={(event) => {
        if (event.operation.source?.type === "task")
          publish(move(current.current, event));
        if (event.operation.source?.type === "column" && onColumnsChange)
          onColumnsChange(move(columns, event), false);
      }}
      onDragEnd={end}
    >
      <span className="sr-only" role="status">
        {count ? `Saving ${count} moves` : "Order saved"}
      </span>
      {children(items)}
    </DragDropProvider>
  );
}
