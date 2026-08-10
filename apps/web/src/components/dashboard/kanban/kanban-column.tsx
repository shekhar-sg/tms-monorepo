"use client";

import { useDroppable } from "@dnd-kit/react";
import type { ReactNode } from "react";
import { LuPlus } from "react-icons/lu";
import { MdDragIndicator } from "react-icons/md";
import { RiMoreLine } from "react-icons/ri";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

type KanbanColumnProps = {
  id: string;
  title: string;
  children: ReactNode;
  isEmpty: boolean;
};

const KanbanColumn = (props: KanbanColumnProps) => {
  const { id, children, title, isEmpty } = props;
  const { ref, isDropTarget } = useDroppable({
    id,
    type: "column",
  });
  return (
    <Card
      ref={ref}
      data-size={"xs"}
      className={cn(
        "bg-accent rounded-md h-full min-w-fit min-h-48 max-h-[calc(100vh-180px)]",
        {
          "ring-2 ring-primary": isDropTarget,
          "w-72.25": isEmpty,
        }
      )}
    >
      <CardHeader className={"flex justify-between items-center"}>
        <CardTitle
          className={
            "flex items-center justify-start gap-1.5 text-xs font-semibold"
          }
        >
          <MdDragIndicator size={16} /> {title}
        </CardTitle>
        <CardAction>
          <Button variant={"ghost"} size={"icon-sm"}>
            <LuPlus />
          </Button>
          <Button variant={"ghost"} size={"icon-sm"}>
            <RiMoreLine />
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent
        className={"space-y-2 min-h-0 flex-1 overflow-y-auto no-scrollbar"}
      >
        <div className={"flex min-h-full flex-col gap-2 my-1"}>
          {children}{" "}
          {isEmpty && (
            <div className="flex flex-1 flex-col items-center justify-center py-8 text-center">
              <p className="text-sm font-medium text-muted-foreground">
                No tasks yet
              </p>
              <p className="mt-1 text-xs text-muted-foreground/70">
                Add a task or drag one here
              </p>
            </div>
          )}
        </div>
      </CardContent>
      <CardAction className={"px-2.5"}>
        <Button variant={"ghost"}>
          <LuPlus /> Add Task
        </Button>
      </CardAction>
    </Card>
  );
};

export default KanbanColumn;
