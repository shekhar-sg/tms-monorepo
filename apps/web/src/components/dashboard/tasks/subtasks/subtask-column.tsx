import type { SubtaskSummary } from "@repo/types";
import type { ColumnDef, TableFeatures } from "@tanstack/react-table";

export const subtaskTableFeatures = {} as TableFeatures;

export const subtaskColumns: ColumnDef<TableFeatures, SubtaskSummary>[] = [
  {
    accessorKey: "title",
    header: "Task",
  },
  {
    accessorKey: "priority",
    header: "Priority",
  },
  {
    id: "status",
    header: "Status",
  },
  {
    accessorKey: "endDate",
    header: "Due Date",
  },
  {
    id: "actions",
    header: "Actions",
  },
];
