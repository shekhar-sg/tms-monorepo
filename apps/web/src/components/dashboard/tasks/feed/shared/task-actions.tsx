import type { Status } from "@repo/types";
import { usePathname, useRouter } from "next/navigation";
import { RiMoreLine } from "react-icons/ri";
import { taskStatusGroups } from "@/components/dashboard/tasks/feed/task-feed-utils";
import { Button } from "@/components/ui/button";
import { DeleteButton } from "@/components/ui/delete-button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useDeleteTask, useMoveTask } from "@/hooks/tasks/use-tasks";

interface TaskActionsProps {
  taskId: string;
}

const TaskActions = ({ taskId }: TaskActionsProps) => {
  const { mutate: moveTaskMutation } = useMoveTask();
  const router = useRouter();
  const pathname = usePathname();
  const { mutateAsync: deleteTask } = useDeleteTask();

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
    <div className="flex shrink-0 items-center gap-1">
      <DeleteButton
        name="task"
        description="The task, its subtasks, comments, and updates will be removed."
        onDelete={async () => {
          await deleteTask(taskId);
          if (pathname === `/dashboard/tasks/${taskId}`)
            router.replace("/dashboard/tasks");
        }}
      />
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button
              type="button"
              aria-label="Task actions"
              variant={"ghost"}
              size={"icon-sm"}
            >
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
              {taskStatusGroups.map((column) => (
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
    </div>
  );
};

export default TaskActions;
