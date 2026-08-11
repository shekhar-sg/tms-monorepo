"use client";

import {
  type ColumnDef,
  columnVisibilityFeature,
  createColumnHelper,
  type TableFeatures,
  tableFeatures,
} from "@tanstack/react-table";
import type { Project } from "@/components/dashboard/kanban/Board-static-data";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

export const projectTableFeatures = tableFeatures({
  columnVisibilityFeature,
});

const columnHelper = createColumnHelper<typeof projectTableFeatures, Project>();

export const projectColumns: ColumnDef<TableFeatures, Project>[] =
  columnHelper.columns([
    columnHelper.accessor("title", {
      header: "Project",
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

    columnHelper.accessor("lead", {
      header: "Lead",

      cell: ({ getValue }) => {
        const lead = getValue();

        if (!lead) {
          return <span className="text-muted-foreground">—</span>;
        }

        return (
          <div className="flex items-center gap-2">
            <Avatar size="sm">
              {lead.avatar && <AvatarImage src={lead.avatar} alt={lead.name} />}

              <AvatarFallback>
                {lead.name
                  .split(" ")
                  .map((part: string) => part[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <span className="truncate">{lead.name}</span>
          </div>
        );
      },
    }),

    columnHelper.accessor("dueDate", {
      header: "Due Date",

      cell: ({ getValue }) => {
        return (
          <span className="text-muted-foreground">{getValue() ?? "—"}</span>
        );
      },
    }),
  ]) as ColumnDef<TableFeatures, Project>[];
