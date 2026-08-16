import { useSortable } from "@dnd-kit/react/sortable";
import type { Status } from "@repo/types";
import { LuCalendar, LuTag } from "react-icons/lu";
import TaskActions from "@/components/dashboard/kanban/shared/task-actions";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useMoveTask } from "@/hooks/tasks/use-tasks";
import { cn } from "@/lib/utils";

type KanbanCardProps = {
  id: string;
  index: number;
  column: Status;
  title: string;
};

const KanbanCard = (props: KanbanCardProps) => {
  const { id, column, title, index } = props;
  const { mutate: moveTaskMutation } = useMoveTask();

  const { ref, isDragging } = useSortable({
    id,
    index,
    group: column,
    type: "task",
    accept: "task",
  });

  const handleShowDetails = () => {
    console.log(`Show details for card ${id}`);
  };
  const handleMove = (targetColumnId: string) => {
    moveTaskMutation({
      taskId: id,
      data: {
        status: targetColumnId as Status,
      },
    });
  };

  return (
    <Card
      ref={ref}
      data-size={"xs"}
      className={cn("min-w-68.25 rounded-md hover:cursor-grab", {
        "opacity-50": isDragging,
      })}
      size={"sm"}
    >
      <CardHeader className={"flex justify-between items-center"}>
        <CardTitle className={"text-sm"}>{title}</CardTitle>
        <TaskActions
          column={{
            id: column,
            title,
          }}
          onShowDetails={handleShowDetails}
          onMove={handleMove}
        />
      </CardHeader>
      <CardContent className={"space-y-3"}>
        <div className={"flex justify-between items-center"}>
          <Badge variant={"ghost"} className={"h-fit p-0"}>
            <Avatar size={"sm"}>
              <AvatarImage />
              <AvatarFallback>OM</AvatarFallback>
            </Avatar>
            &nbsp;Admin
          </Badge>
          <Badge variant={"destructive"} className={"p-2"}>
            <LuCalendar />
            44 Jul
          </Badge>
        </div>
        <div className={"space-x-1.5"}>
          <Badge variant={"secondary"}>
            <LuTag /> Deployment
          </Badge>
          <Badge variant={"secondary"}>
            <LuTag /> Deployment
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};

export default KanbanCard;
