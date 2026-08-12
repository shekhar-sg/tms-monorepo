import { format } from "date-fns";
import { CalendarIcon, CircleDot, Flag, User, Users } from "lucide-react";
import { useState } from "react";
import CollapsibleCard from "@/components/dashboard/tasks/new/collapsible-card";
import TaskUpdates from "@/components/dashboard/tasks/new/task-updates";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface TaskSidebarProps {
  isOpen: boolean;
}

const TaskDetailsSidebar = ({ isOpen }: TaskSidebarProps) => {
  const [status, setStatus] = useState("Backlog");
  const [priority, setPriority] = useState("High");
  const [date, setDate] = useState<Date | undefined>(new Date(2026, 0, 10)); // Jan 10, 2026

  const getPriorityStyle = (p: string) => {
    switch (p) {
      case "Urgent":
        return "text-rose-600 hover:text-rose-700";
      case "High":
        return "text-amber-500 hover:text-amber-600";
      case "Medium":
        return "text-blue-500 hover:text-blue-600";
      default:
        return "text-muted-foreground";
    }
  };

  return (
    <aside
      className={cn("space-y-5 ", {
        hidden: !isOpen,
      })}
    >
      <CollapsibleCard title={"details"}>
        <div
          className={
            "grid grid-cols-[100px_1fr] gap-y-3.5 items-center text-sm font-normal"
          }
        >
          <span className={"text-muted-foreground"}>Status</span>
          <div>
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button
                    variant={"ghost"}
                    size={"sm"}
                    className={
                      "h-8 justify-start px-2 font-medium text-amber-600 gap-2 rounded-md"
                    }
                  >
                    <CircleDot className="h-3.5 w-3.5 fill-current" />
                    {status}
                  </Button>
                }
              />
              <DropdownMenuContent
                align={"start"}
                className={"w-40 border-border"}
              >
                <DropdownMenuItem onClick={() => setStatus("Backlog")}>
                  Backlog
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatus("Todo")}>
                  Todo
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatus("In Progress")}>
                  In Progress
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatus("Done")}>
                  Done
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <span className="text-muted-foreground">Priority</span>
          <div>
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`h-8 justify-start px-2 font-medium hover:bg-muted/40 gap-2 rounded-md ${getPriorityStyle(priority)}`}
                  >
                    <Flag className="h-3.5 w-3.5 fill-current" />
                    {priority}
                  </Button>
                }
              />
              <DropdownMenuContent align="start" className="w-44 border-border">
                <DropdownMenuItem
                  className="text-rose-600 font-medium"
                  onClick={() => setPriority("Urgent")}
                >
                  Urgent
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-amber-500 font-medium"
                  onClick={() => setPriority("High")}
                >
                  High
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-blue-500 font-medium"
                  onClick={() => setPriority("Medium")}
                >
                  Medium
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-muted-foreground"
                  onClick={() => setPriority("Low")}
                >
                  Low
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <span className="text-muted-foreground">Members</span>
          <div>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 justify-start px-2 text-muted-foreground/80 hover:text-foreground hover:bg-muted/40 gap-2 rounded-md"
            >
              <Users className="h-3.5 w-3.5" />
              Add members
            </Button>
          </div>

          <span className="text-muted-foreground">Dates</span>
          <div>
            <Popover>
              <PopoverTrigger
                render={
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 justify-start px-2 font-normal text-foreground hover:bg-muted/40 gap-2 border border-border bg-background shadow-xs rounded-md"
                  >
                    <CalendarIcon className="h-3.5 w-3.5 text-muted-foreground" />
                    <span>{date ? format(date, "MMM d") : "Start"}</span>
                    <span className="text-muted-foreground/60">→</span>
                    <span className="text-muted-foreground/70">End</span>
                  </Button>
                }
              />
              <PopoverContent
                className="w-auto p-0 border-border"
                align="start"
              >
                <Calendar mode="single" selected={date} onSelect={setDate} />
              </PopoverContent>
            </Popover>
          </div>

          <span className="text-muted-foreground">Labels</span>
          <div className="text-muted-foreground/40 px-2">—</div>

          <span className="text-muted-foreground">Teams</span>
          <div className="text-muted-foreground/40 px-2">—</div>

          <span className="text-muted-foreground">Reporter</span>
          <div>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 justify-start px-2 font-normal text-foreground hover:bg-muted/40 gap-2 rounded-md"
            >
              <User className="h-3.5 w-3.5 text-muted-foreground" />
              You
            </Button>
          </div>
        </div>
      </CollapsibleCard>
      <TaskUpdates />
    </aside>
  );
};

export default TaskDetailsSidebar;
