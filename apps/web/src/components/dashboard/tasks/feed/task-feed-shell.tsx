"use client";

import type { Task } from "@repo/types";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo } from "react";
import Board from "@/components/dashboard/tasks/feed/board";
import ListView from "@/components/dashboard/tasks/feed/list";
import { useTaskFeedPreferences } from "@/components/dashboard/tasks/feed/task-feed-preferences-context";
import {
  type TasksByStatus,
  taskStatusGroups,
} from "@/components/dashboard/tasks/feed/task-feed-utils";
import Toolbar from "@/components/dashboard/tasks/feed/toolbar";
import { Button } from "@/components/ui/button";
import { QueryState } from "@/components/ui/query-state";
import { useProject, useProjects } from "@/hooks/projects/use-projects";
import { useTasks } from "@/hooks/tasks/use-tasks";
import { parseTaskQueryParams } from "@/lib/tasks/task-query";
import { useBreadcrumb } from "@/providers/breadcrumb-context";
import { TaskOrdering } from "./task-ordering";

const EMPTY_TASKS: Task[] = [];

const TaskFeedShell = ({
  projectId,
}: {
  projectId?: string;

  reorder?: boolean;
}) => {
  const searchParams = useSearchParams();

  const query = useMemo(
    () =>
      parseTaskQueryParams({
        search: searchParams.get("search") ?? undefined,

        status: searchParams.get("status") ?? undefined,

        priority: searchParams.get("priority") ?? undefined,

        labels: searchParams.get("labels") ?? undefined,

        dueDateFrom: searchParams.get("dueDateFrom") ?? undefined,

        dueDateTo: searchParams.get("dueDateTo") ?? undefined,
      }),

    [searchParams]
  );

  const {
    data: tasks,
    isPending,
    error,
    refetch,
  } = useTasks(projectId ?? undefined, query);

  const { data: projects } = useProjects();

  const { data: project, error: projectError } = useProject(projectId ?? "");

  const { setDynamicLabel } = useBreadcrumb();
  useEffect(() => {
    if (projectId) setDynamicLabel(project?.title ?? "Project");
  }, [projectId, project?.title, setDynamicLabel]);
  const filtered = Object.values(query).some((value) =>
    Array.isArray(value) ? value.length > 0 : Boolean(value)
  );

  const safeTasks = tasks ?? EMPTY_TASKS;

  const { view, setView, sort, columns, setColumns } = useTaskFeedPreferences();
  const statusGroups = columns.map(
    (id) => taskStatusGroups.find((g) => g.id === id)!
  );
  const manual = sort === "manual" && !filtered;
  const priorityRank = { URGENT: 0, HIGH: 1, MEDIUM: 2, LOW: 3, NONE: 4 };
  const sorted = (items: TasksByStatus): TasksByStatus =>
    Object.fromEntries(
      Object.entries(items).map(([status, tasks]) => [
        status,
        sort === "manual"
          ? tasks
          : [...tasks].sort((a, b) => {
              const result =
                sort === "priority"
                  ? priorityRank[a.priority] - priorityRank[b.priority]
                  : sort === "title"
                    ? a.title.localeCompare(b.title)
                    : sort === "created"
                      ? Date.parse(b.createdAt) - Date.parse(a.createdAt)
                      : (a.endDate ? Date.parse(a.endDate) : Infinity) -
                        (b.endDate ? Date.parse(b.endDate) : Infinity);
              return (
                result || a.position - b.position || a.id.localeCompare(b.id)
              );
            }),
      ])
    ) as TasksByStatus;

  return (
    <div className="workspace-page flex min-w-0 flex-col gap-6">
      <Toolbar
        view={view}
        onViewChange={setView}
        page={"tasks"}
        title={project?.title}
      />
      {!manual && (
        <p className="-mt-3 text-xs text-muted-foreground">
          Status moves are available. Clear filters and choose Manual order to
          reorder tasks.
        </p>
      )}

      {isPending ? (
        <QueryState loading title="Loading tasks…" />
      ) : error || projectError ? (
        <QueryState
          error
          title="Tasks unavailable"
          description="The project may have been removed, or your connection was interrupted."
          onRetry={() => void refetch()}
        />
      ) : safeTasks.length === 0 ? (
        <QueryState
          title={filtered ? "No matching tasks" : "Your workspace is ready"}
          description={
            filtered
              ? "Try adjusting your search or clearing filters."
              : "Create a task to start organizing your work."
          }
        >
          <Button
            nativeButton={false}
            variant="outline"
            render={
              <Link
                href={
                  filtered
                    ? projectId
                      ? `/dashboard/projects/${projectId}`
                      : "/dashboard/tasks"
                    : projects?.length === 0
                      ? "/dashboard/projects"
                      : `/dashboard/tasks/new${projectId ? `?projectId=${projectId}` : ""}`
                }
              />
            }
          >
            {filtered
              ? "Clear filters"
              : projects?.length === 0
                ? "Create a project"
                : "Create task"}
          </Button>
        </QueryState>
      ) : (
        <TaskOrdering
          key={projectId ?? "all"}
          tasks={safeTasks}
          manual={manual}
          columns={statusGroups}
          onColumnsChange={(next, persist) =>
            setColumns(
              next.map((g) => g.id),
              persist
            )
          }
        >
          {(items) =>
            view === "board" ? (
              <Board
                groups={statusGroups}
                items={sorted(items)}
                reorder={manual}
              />
            ) : (
              <ListView
                columns={statusGroups}
                items={sorted(items)}
                reorder={manual}
              />
            )
          }
        </TaskOrdering>
      )}
    </div>
  );
};

export default TaskFeedShell;
