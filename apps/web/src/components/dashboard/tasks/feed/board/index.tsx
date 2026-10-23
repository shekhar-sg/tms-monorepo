"use client";
import type { TaskStatusGroup, TasksByStatus } from "../task-feed-utils";
import KanbanCard from "./kanban-card";
import KanbanColumn from "./kanban-column";
export default function Board({
  groups,
  items,
  reorder,
}: {
  groups: TaskStatusGroup[];
  items: TasksByStatus;
  reorder: boolean;
}) {
  return (
    <div className="min-w-0 overflow-x-auto pb-4">
      <div className="flex w-max min-w-full items-start gap-3">
        {groups.map((group, index) => (
          <KanbanColumn
            key={group.id}
            id={group.id}
            title={group.title}
            index={index}
            count={items[group.id].length}
            isEmpty={!items[group.id].length}
          >
            {items[group.id].map((task, index) => (
              <KanbanCard
                key={task.id}
                index={index}
                group={group.id}
                task={task}
                reorder={reorder}
              />
            ))}
          </KanbanColumn>
        ))}
      </div>
    </div>
  );
}
