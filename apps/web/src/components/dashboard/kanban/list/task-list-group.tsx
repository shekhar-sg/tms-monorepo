"use client";

import { CollisionPriority } from "@dnd-kit/abstract";
import { useDroppable } from "@dnd-kit/react";
import { useSortable } from "@dnd-kit/react/sortable";
import { LuChevronDown } from "react-icons/lu";
import { MdDragIndicator } from "react-icons/md";
import TaskTable from "@/components/dashboard/kanban/list/task-table";
import EmptyState from "@/components/dashboard/kanban/shared/empty-state";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";
import type { Task } from "@repo/types";

type TaskListGroupProps = {
  id: string;
  title: string;
  index: number;
  tasks: Task[];
};

const TaskListGroup = (props: TaskListGroupProps) => {
  const { id, title, tasks, index } = props;
  const {
    ref: sortableRef,
    isDragging,
    handleRef,
  } = useSortable({
    id,
    index,
    group: "list-columns",
    type: "column",
    accept: "column",
  });

  const { ref: droppableRef } = useDroppable({
    id: id,
    type: "column",
    collisionPriority: CollisionPriority.Low,
  });

  return (
    <Collapsible
      defaultOpen
      ref={sortableRef}
      className={cn({ "opacity-50": isDragging })}
    >
      <section>
        <Button
          ref={handleRef}
          variant={"ghost"}
          size={"icon-sm"}
          className={"size-7 cursor-grab touch-none"}
          aria-label={`Move ${title}`}
        >
          <MdDragIndicator />
        </Button>
        <CollapsibleTrigger render={<Button variant={"link"} />}>
          <LuChevronDown />
          {title}
        </CollapsibleTrigger>
        <CollapsibleContent ref={droppableRef}>
          {tasks.length === 0 ? (
            <EmptyState />
          ) : (
            <TaskTable columnId={id} tasks={tasks} />
          )}
        </CollapsibleContent>
      </section>
    </Collapsible>
  );
};

export default TaskListGroup;
