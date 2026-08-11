import {
  type ColumnDef,
  columnVisibilityFeature,
  createColumnHelper,
  type TableFeatures,
  tableFeatures,
} from "@tanstack/react-table";

import {
  columns,
  type Task,
} from "@/components/dashboard/kanban/Board-static-data";
import TaskActions from "@/components/dashboard/kanban/shared/task-actions";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

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
      header: "Priority",

      cell: ({ getValue }) => {
        const priority = getValue();

        return (
          <Badge
            variant={
              priority === "urgent" || priority === "high"
                ? "destructive"
                : priority === "medium"
                  ? "outline"
                  : "secondary"
            }
          >
            {priority === "none" ? "No Priority" : priority}
          </Badge>
        );
      },
    }),

    columnHelper.accessor("assignee", {
      header: "Members",

      cell: ({ getValue }) => {
        const assignee = getValue();

        if (!assignee) {
          return <span className={"text-muted-foreground"}>—</span>;
        }

        return (
          <Avatar size={"sm"}>
            {assignee.avatar && (
              <AvatarImage src={assignee.avatar} alt={assignee.name} />
            )}

            <AvatarFallback>
              {assignee.name
                .split(" ")
                .map((part: string) => part[0])
                .join("")
                .slice(0, 2)}
            </AvatarFallback>
          </Avatar>
        );
      },
    }),

    columnHelper.accessor("dueDate", {
      header: "Due Date",

      cell: ({ getValue }) => {
        return (
          <span className={"text-muted-foreground"}>{getValue() ?? "—"}</span>
        );
      },
    }),

    columnHelper.display({
      id: "actions",
      header: "Actions",
      enableHiding: false,

      cell: ({ row }) => {
        const task = row.original;

        const currentColumn = columns.find(
          (column) => column.id === task.column
        );

        if (!currentColumn) {
          return null;
        }

        return (
          <TaskActions
            column={{
              id: currentColumn.id,
              title: currentColumn.title,
            }}
            onShowDetails={() => console.log("see details", currentColumn)}
            onMove={(columnId) => {
              console.log({ columnId });
            }}
          />
        );
      },
    }),
  ]) as ColumnDef<TableFeatures, Task>[];
