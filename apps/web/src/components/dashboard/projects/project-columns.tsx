"use client";

import type { Priority, Project } from "@repo/types";
import {
  type ColumnDef,
  columnVisibilityFeature,
  createColumnHelper,
  type TableFeatures,
  tableFeatures,
} from "@tanstack/react-table";
import { ExternalLink } from "lucide-react";
import { useRouter } from "next/navigation";
import ProjectDueDateCell from "@/components/dashboard/projects/project-due-date-cell";
import ProjectPriorityCell from "@/components/dashboard/projects/project-priority-cell";
import ProjectTitleCell from "@/components/dashboard/projects/project-title-cell";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

export const projectTableFeatures = tableFeatures({
  columnVisibilityFeature,
});

const columnHelper = createColumnHelper<typeof projectTableFeatures, Project>();

export const projectColumns: ColumnDef<TableFeatures, Project>[] =
  columnHelper.columns([
    columnHelper.accessor("title", {
      header: "Project",

      cell: ({ row }) => (
        <ProjectTitleCell
          projectId={row.original.id}
          title={row.original.title}
        />
      ),
    }),

    columnHelper.accessor("priority", {
      header: "Priority",

      cell: ({ row }) => (
        <ProjectPriorityCell
          projectId={row.original.id}
          priority={row.original.priority as Priority}
        />
      ),
    }),

    columnHelper.accessor("lead", {
      header: "Lead",

      cell: ({ row }) => {
        const lead = row.original.lead;
        return (
          <Avatar size="sm">
            {lead.avatar && (
              <AvatarImage src={lead.avatar} alt={lead.name ?? ""} />
            )}
            <AvatarFallback>
              {lead.name
                ?.split(" ")
                .map((part) => part[0])
                .join("")
                .slice(0, 2)
                .toUpperCase() ?? "U"}
            </AvatarFallback>
          </Avatar>
        );
      },
    }),

    columnHelper.accessor("dueDate", {
      header: "Due Date",

      cell: ({ row }) => (
        <ProjectDueDateCell
          projectId={row.original.id}
          dueDate={row.original.dueDate}
        />
      ),
    }),

    columnHelper.display({
      id: "actions",
      header: "Actions",
      enableHiding: false,

      cell: ({ row }) => {
        const router = useRouter();
        return (
          <Button
            variant={"ghost"}
            size={"icon-sm"}
            onClick={() =>
              router.push(`/dashboard/projects/${row.original.id}`)
            }
          >
            <ExternalLink />
          </Button>
        );
      },
    }),
  ]) as ColumnDef<TableFeatures, Project>[];
