import { useDraggable } from "@dnd-kit/react";
import { useSortable } from "@dnd-kit/react/sortable";
import type { Status, Task } from "@repo/types";
import { formatDate } from "date-fns";
import Link from "next/link";
import { Ref } from "react";
import { LuCalendar, LuTag } from "react-icons/lu";
import TaskActions from "@/components/dashboard/tasks/feed/shared/task-actions";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type KanbanCardProps = {
  index: number;
  group: Status;
  task: Task;
  reorder: boolean;
};

const KanbanCard = (props: KanbanCardProps) => {
  if (props.reorder) {
    return <SortableCard {...props} />;
  }

  return <DraggableCard {...props} />;
};

export default KanbanCard;

type CardContentProps = {
  task: Task;
  isDragging?: boolean;
  ref?: Ref<HTMLDivElement>;
};

export const CardContentView = ({
  task,
  isDragging = false,
  ref,
}: CardContentProps) => {
  const { id, title, labels, endDate, reporter } = task;
  const { name, avatar } = reporter ?? {};

  return (
    <Card
      ref={ref}
      data-size={"xs"}
      className={cn(
        "w-full overflow-hidden rounded-lg border bg-card shadow-sm ring-0 hover:border-primary/40",
        {
          "opacity-50": isDragging,
        }
      )}
      size={"sm"}
    >
      <CardHeader className={"flex justify-between items-center"}>
        <CardTitle className="min-w-0 text-sm">
          <Link
            href={`/dashboard/tasks/${id}`}
            className="line-clamp-2 whitespace-normal leading-relaxed hover:text-primary"
            onPointerDown={(event) => event.stopPropagation()}
          >
            {title}
          </Link>
        </CardTitle>
        <TaskActions taskId={id} />
      </CardHeader>
      <CardContent className={"space-y-3"}>
        <div className={"flex justify-between items-center"}>
          <Badge variant={"ghost"} className={"h-fit p-0"}>
            <Avatar size={"sm"}>
              <AvatarImage src={avatar ?? undefined} alt={name ?? "Guest"} />
              <AvatarFallback>
                {name?.slice(0, 2).toUpperCase() ?? "U"}
              </AvatarFallback>
            </Avatar>
            &nbsp;{name ?? "Guest"}
          </Badge>
          {endDate && (
            <Badge
              variant={
                task.status !== "DONE" &&
                new Date(endDate).getTime() < new Date().setHours(0, 0, 0, 0)
                  ? "destructive"
                  : "outline"
              }
              className="px-2 py-1 text-xs"
            >
              <LuCalendar />
              {formatDate(endDate, "dd MMM")}
            </Badge>
          )}
        </div>
        <div className="flex flex-wrap gap-1.5">
          {labels.slice(0, 3).map((label) => (
            <Badge key={label.labelId} variant={"secondary"}>
              <LuTag /> {label.label.name}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

const SortableCard = ({ task, index, group }: KanbanCardProps) => {
  const { ref, isDragging } = useSortable({
    id: task.id,
    index,
    group,
    type: "task",
    accept: "task",
  });

  return <CardContentView task={task} ref={ref} isDragging={isDragging} />;
};

const DraggableCard = ({ task }: KanbanCardProps) => {
  const { ref, isDragging } = useDraggable({
    id: task.id,
    type: "task",
  });

  return <CardContentView task={task} ref={ref} isDragging={isDragging} />;
};
