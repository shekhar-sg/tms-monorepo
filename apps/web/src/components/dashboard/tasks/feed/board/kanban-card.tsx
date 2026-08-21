import { useDraggable } from "@dnd-kit/react";
import { useSortable } from "@dnd-kit/react/sortable";
import type { Status, Task } from "@repo/types";
import { formatDate } from "date-fns";
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
      className={cn("w-68.25 overflow-hidden rounded-md hover:cursor-grab", {
        "opacity-50": isDragging,
      })}
      size={"sm"}
    >
      <CardHeader className={"flex justify-between items-center"}>
        <CardTitle className={"text-sm truncate"}>{title}</CardTitle>
        <TaskActions taskId={id} />
      </CardHeader>
      <CardContent className={"space-y-3"}>
        <div className={"flex justify-between items-center"}>
          <Badge variant={"ghost"} className={"h-fit p-0"}>
            <Avatar size={"sm"}>
              <AvatarImage
                src={avatar ?? "https://github.com/shadcn.png"}
                alt={name ?? "Guest"}
              />
              <AvatarFallback>{name ?? "G"}</AvatarFallback>
            </Avatar>
            &nbsp;{name ?? "Guest"}
          </Badge>
          {endDate && (
            <Badge variant={"destructive"} className={"p-2"}>
              <LuCalendar />
              {formatDate(endDate, "dd MMM")}
            </Badge>
          )}
        </div>
        <div className={"flex gap-1.5"}>
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
    data: {
      type: "task",
      task,
    },
  });

  return <CardContentView task={task} ref={ref} isDragging={isDragging} />;
};
