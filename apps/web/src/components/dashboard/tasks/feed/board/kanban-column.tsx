"use client";

import { CollisionPriority } from "@dnd-kit/abstract";
import { useDroppable } from "@dnd-kit/react";
import { useSortable } from "@dnd-kit/react/sortable";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { LuPlus } from "react-icons/lu";
import { MdDragIndicator } from "react-icons/md";
import EmptyState from "@/components/dashboard/tasks/feed/shared/empty-state";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useCreateTaskHref } from "@/hooks/tasks/use-create-task-href";
import { cn } from "@/lib/utils";
import { useNavigationTransition } from "@/providers/navigation-transition-context";

type KanbanColumnProps = {
  id: string;
  title: string;
  index: number;
  children: ReactNode;
  isEmpty: boolean;
};

const KanbanColumn = (props: KanbanColumnProps) => {
  const { id, index, children, title, isEmpty } = props;
  const { navigate } = useNavigationTransition();
  const createHref = useCreateTaskHref();
  const router = useRouter();
  const handleCreateNew = () => {
    navigate(() => router.push(createHref));
  };

  const {
    ref: sortableRef,
    handleRef,
    isDragging,
  } = useSortable({
    id,
    index,
    group: "columns",
    type: "column",
    accept: "column",
  });

  const { ref: droppableRef, isDropTarget } = useDroppable({
    id,
    type: "column",
    accept: ["task", "column"],
    collisionPriority: CollisionPriority.Low,
  });

  const setRefs = (node: HTMLElement | null) => {
    sortableRef(node);
    droppableRef(node);
  };

  return (
    <Card
      ref={setRefs}
      data-size={"xs"}
      className={cn(
        "w-80 shrink-0 rounded-xl border bg-muted/45 shadow-none ring-0 min-h-64 max-h-[calc(100svh-210px)]",
        {
          "opacity-50": isDragging,
          "ring-2 ring-primary": isDropTarget,
        }
      )}
    >
      <CardHeader className={"flex justify-between items-center"}>
        <CardTitle
          className={"flex items-center justify-start text-xs font-semibold"}
        >
          <Button
            aria-label={`Reorder ${title} column`}
            ref={handleRef}
            className={"cursor-grab touch-none"}
            variant={"ghost"}
            size={"icon-sm"}
          >
            <MdDragIndicator size={16} />
          </Button>
          {title}
        </CardTitle>
        <CardAction>
          <Button
            aria-label={`Add task to ${title}`}
            variant={"ghost"}
            size={"icon-sm"}
            onClick={handleCreateNew}
          >
            <LuPlus />
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent
        className={"space-y-2 min-h-0 flex-1 overflow-y-auto no-scrollbar"}
      >
        <div className={"flex min-h-full flex-col gap-2 my-1"}>
          {children} {isEmpty && <EmptyState />}
        </div>
      </CardContent>
      <CardAction className={"px-2.5"}>
        <Button variant={"ghost"} onClick={handleCreateNew}>
          <LuPlus /> Add Task
        </Button>
      </CardAction>
    </Card>
  );
};

export default KanbanColumn;
