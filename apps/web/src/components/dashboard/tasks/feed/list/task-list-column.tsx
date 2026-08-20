import type { Task } from "@repo/types";
import {
  type ColumnDef,
  columnVisibilityFeature,
  createColumnHelper,
  type TableFeatures,
  tableFeatures,
} from "@tanstack/react-table";
import { format, parseISO } from "date-fns";
import TaskActions from "@/components/dashboard/tasks/feed/shared/task-actions";
import { taskStatusGroups } from "@/components/dashboard/tasks/feed/task-feed-utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { PRIORITY_OPTIONS } from "@/lib/tasks/filter-config";

export const taskTableFeatures = tableFeatures({
  columnVisibilityFeature,
});

const columnHelper = createColumnHelper<typeof taskTableFeatures, Task>();

export const taskColumns: ColumnDef<TableFeatures, Task>[] =
  columnHelper.columns([
    columnHelper.accessor("title", {
      header: "Task",
    }),

    columnHelper.accessor("priority", {
      id: "priority",
      header: "Priority",
      cell: ({ row }) => {
        const currentPriority = row.original.priority;
        const priority = PRIORITY_OPTIONS.find(
          (priority) => priority.value === currentPriority
        );
        const Icon = priority?.icon;

        return (
          <Badge variant={"link"} className={priority?.color}>
            {Icon && <Icon />}
            {priority?.label}
          </Badge>
        );
      },
    }),

    columnHelper.accessor("members", {
      id: "members",
      header: "Members",
      cell: ({ row }) => {
        const members = row.original.members;
        if (!members || members.length === 0) {
          return <span className={"text-muted-foreground"}>—</span>;
        }
        return members.map(({ user, userId }) => (
          <Avatar size={"sm"} key={userId}>
            {user.avatar && (
              <AvatarImage src={user.avatar} alt={user.name ?? ""} />
            )}
            <AvatarFallback>
              {user.name
                ?.split(" ")
                .map((part: string) => part[0])
                .join("")
                .slice(0, 2)}
            </AvatarFallback>
          </Avatar>
        ));
      },
    }),

    columnHelper.accessor("endDate", {
      id: "dueDate",
      header: "Due Date",
      cell: ({ row }) => {
        if (!row.original.endDate) {
          return <span className={"text-muted-foreground"}>—</span>;
        }
        const dueDate = parseISO(row.original.endDate);
        return <span>{format(dueDate, "dd MMM yyyy") ?? "—"}</span>;
      },
    }),

    columnHelper.display({
      id: "actions",
      header: "Actions",
      enableHiding: false,

      cell: ({ row }) => {
        const task = row.original;

        const currentColumn = taskStatusGroups.find(
          (column) => column.id === task.status
        );

        if (!currentColumn) {
          return null;
        }

        return <TaskActions taskId={task.id} />;
      },
    }),
  ]) as ColumnDef<TableFeatures, Task>[];
