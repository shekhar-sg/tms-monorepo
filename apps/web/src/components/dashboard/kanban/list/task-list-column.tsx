import type { Task } from "@repo/types";
import {
  type ColumnDef,
  columnVisibilityFeature,
  createColumnHelper,
  type TableFeatures,
  tableFeatures,
} from "@tanstack/react-table";
import { format, parseISO } from "date-fns";
import { columns } from "@/components/dashboard/kanban/Board-static-data";
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

    columnHelper.accessor("members", {
      header: "Members",
      cell: ({ row }) => {
        const reporter = row.original.reporter;
        if (!reporter) {
          return <span className={"text-muted-foreground"}>—</span>;
        }
        return (
          <Avatar size={"sm"}>
            {reporter.avatar && (
              <AvatarImage src={reporter.avatar} alt={reporter.name ?? ""} />
            )}

            <AvatarFallback>
              {reporter.name
                ?.split(" ")
                .map((part: string) => part[0])
                .join("")
                .slice(0, 2)}
            </AvatarFallback>
          </Avatar>
        );
      },
    }),

    columnHelper.accessor("endDate", {
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

        const currentColumn = columns.find(
          (column) => column.id === task.status
        );

        if (!currentColumn) {
          return null;
        }

        return <TaskActions taskId={task.id} />;
      },
    }),
  ]) as ColumnDef<TableFeatures, Task>[];
