"use client";

import { move } from "@dnd-kit/helpers";
import { DragDropProvider, type DragEndEvent } from "@dnd-kit/react";
import { type Dispatch, type SetStateAction, useRef } from "react";
import KanbanCard from "@/components/dashboard/tasks/feed/board/kanban-card";
import KanbanColumn from "@/components/dashboard/tasks/feed/board/kanban-column";
import type {
  TaskStatusGroup,
  TasksByStatus,
} from "@/components/dashboard/tasks/feed/task-feed-utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useMoveTask } from "@/hooks/tasks/use-tasks";

interface KanbanBoardProps {
  groups: TaskStatusGroup[];
  items: TasksByStatus;
  setGroups: Dispatch<SetStateAction<TaskStatusGroup[]>>;
  setItems: Dispatch<SetStateAction<TasksByStatus>>;
}

const Board = (props: KanbanBoardProps) => {
  const { groups, setGroups, items, setItems } = props;
  const { mutate: moveTaskMutation } = useMoveTask();

  const previousItems = useRef(items);
  const previousGroup = useRef(groups);

  const handleDragEnd = (event: DragEndEvent) => {
    if (event.canceled) {
      setItems(previousItems.current);
      setGroups(previousGroup.current);
      return;
    }

    const { source } = event.operation;

    if (!source || source.type !== "task") {
      return;
    }

    const taskId = String(source.id);

    const position = getTaskPosition(items, groups, taskId);

    if (!position) {
      return;
    }

    moveTaskMutation(
      {
        taskId,
        data: position,
      },
      {
        onError: () => {
          setItems(previousItems.current);
        },
      }
    );
  };

  return (
    <DragDropProvider
      onDragStart={() => {
        previousItems.current = items;
        previousGroup.current = groups;
      }}
      onDragOver={(event) => {
        const { source } = event.operation;

        if (!source) return;

        if (source.type === "task") {
          setItems((current) => move(current, event));
        }

        if (source.type === "column") {
          setGroups((current) => move(current, event));
        }
      }}
      onDragEnd={handleDragEnd}
    >
      <ScrollArea className="flex-1 border-none rounded-md border whitespace-nowrap">
        <div className="flex flex-1 gap-4 m-2">
          {groups.map((group, index) => (
            <KanbanColumn
              key={group.id}
              id={group.id}
              title={group.title}
              index={index}
              isEmpty={items[group.id].length === 0}
            >
              {items[group.id].map((task, index) => (
                <KanbanCard
                  key={task.id}
                  index={index}
                  group={group.id}
                  task={task}
                />
              ))}
            </KanbanColumn>
          ))}
        </div>
      </ScrollArea>
    </DragDropProvider>
  );
};

export default Board;

const getTaskPosition = (
  items: TasksByStatus,
  columns: TaskStatusGroup[],
  taskId: string
) => {
  for (const column of columns) {
    const tasks = items[column.id];

    const index = tasks.findIndex((task) => task.id === taskId);

    if (index === -1) {
      continue;
    }

    const beforeTask = tasks[index - 1];
    const afterTask = tasks[index + 1];

    return {
      status: column.id,
      beforeTaskId: beforeTask?.id ?? null,
      afterTaskId: afterTask?.id ?? null,
    };
  }

  return null;
};
