import { useSortable } from "@dnd-kit/react/sortable";
import { LuCalendar, LuTag } from "react-icons/lu";
import { RiMoreLine } from "react-icons/ri";
import { columns } from "@/components/dashboard/kanban/Board-static-data";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

type KanbanCardProps = {
  id: string;
  index: number;
  column: string;
  title: string;
};

const KanbanCard = (props: KanbanCardProps) => {
  const { id, column, title, index } = props;
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
    console.log(`Move card ${id} to column ${targetColumnId}`);
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
        <Actions
          handleShowDetails={handleShowDetails}
          handleMove={handleMove}
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

interface ActionsProps {
  handleShowDetails: () => void;
  handleMove: (targetColumnId: string) => void;
}

const Actions = (props: ActionsProps) => {
  const { handleMove, handleShowDetails } = props;
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button variant={"ghost"} size={"icon-sm"}>
            <RiMoreLine />
          </Button>
        }
      />
      <DropdownMenuContent align={"end"} className={"rounded-sm"}>
        <DropdownMenuItem onClick={handleShowDetails}>
          Show details
        </DropdownMenuItem>

        <DropdownMenuSub>
          <DropdownMenuSubTrigger>Move to</DropdownMenuSubTrigger>

          <DropdownMenuSubContent
            side={"right"}
            sideOffset={8}
            className={"rounded-sm"}
          >
            {columns.map((column) => (
              <DropdownMenuItem
                key={column.id}
                onClick={() => handleMove(column.id)}
              >
                {column.title}
              </DropdownMenuItem>
            ))}
          </DropdownMenuSubContent>
        </DropdownMenuSub>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
