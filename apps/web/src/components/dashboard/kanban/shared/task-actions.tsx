import { RiMoreLine } from "react-icons/ri";
import {
  type Column,
  columns,
} from "@/components/dashboard/kanban/Board-static-data";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface TaskActionsProps {
  column: Column;
  onShowDetails: () => void;
  onMove: (columnId: string) => void;
}

const TaskActions = (props: TaskActionsProps) => {
  const { onMove, onShowDetails } = props;
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
        <DropdownMenuItem onClick={onShowDetails}>
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
                onClick={() => onMove(column.id)}
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

export default TaskActions;
