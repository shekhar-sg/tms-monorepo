import type { Status } from "@repo/types";
import { useRouter } from "next/navigation";
import { RiMoreLine } from "react-icons/ri";
import { columns } from "@/components/dashboard/kanban/Board-static-data";
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
import { useMoveTask } from "@/hooks/tasks/use-tasks";

interface TaskActionsProps {
  taskId: string;
}

const TaskActions = ({ taskId }: TaskActionsProps) => {
  const { mutate: moveTaskMutation } = useMoveTask();
  const router = useRouter();

  const handleShowDetails = () => {
    router.push(`/dashboard/tasks/${taskId}`);
  };
  const handleMove = (targetColumnId: string) => {
    moveTaskMutation({
      taskId,
      data: {
        status: targetColumnId as Status,
      },
    });
  };
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

export default TaskActions;
