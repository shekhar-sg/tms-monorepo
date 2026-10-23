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
import Link from "next/link";
import ProjectDueDateCell from "@/components/dashboard/projects/project-due-date-cell";
import ProjectPriorityCell from "@/components/dashboard/projects/project-priority-cell";
import ProjectTitleCell from "@/components/dashboard/projects/project-title-cell";
import { Button } from "@/components/ui/button";
import { DeleteButton } from "@/components/ui/delete-button";
import { useDeleteProject } from "@/hooks/projects/use-projects";

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

    columnHelper.display({
      id: "progress",
      header: "Progress",
      cell: ({ row }) => {
        const count = row.original.taskCount ?? 0;
        const done = row.original.completedTaskCount ?? 0;
        return (
          <div className="min-w-28 max-w-44 space-y-1.5">
            <span className="text-xs text-muted-foreground tabular-nums">
              {done} / {count} tasks
            </span>
            <progress
              aria-label={`${row.original.title} completion`}
              value={done}
              max={count || 1}
              className="block h-1.5 w-full accent-primary"
            />
          </div>
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

      cell: ({ row }) => <ProjectActions project={row.original} />,
    }),
  ]) as ColumnDef<TableFeatures, Project>[];

function ProjectActions({ project }: { project: Project }) {
  const { mutateAsync: deleteProject } = useDeleteProject();
  return (
    <div className="flex items-center gap-1">
      <Button
        nativeButton={false}
        variant="ghost"
        size="icon-sm"
        aria-label={`Open ${project.title}`}
        render={<Link href={`/dashboard/projects/${project.id}`} />}
      >
        <ExternalLink />
      </Button>
      <DeleteButton
        name="project"
        description="All tasks, subtasks, comments, and updates in this project will be removed."
        onDelete={() => deleteProject(project.id)}
      />
    </div>
  );
}
