import type { SubtaskSummary } from "@repo/types";
import {
  type ColumnDef,
  columnVisibilityFeature,
  type TableFeatures,
  tableFeatures,
} from "@tanstack/react-table";

export const subtaskTableFeatures = tableFeatures({ columnVisibilityFeature });

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
