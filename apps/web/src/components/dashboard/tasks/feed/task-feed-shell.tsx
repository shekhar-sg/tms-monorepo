"use client";

import { useBreadcrumb } from "@/providers/breadcrumb-context";

import type { Task } from "@repo/types";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import Board from "@/components/dashboard/tasks/feed/board";
import ListView from "@/components/dashboard/tasks/feed/list";
import { useTaskFeedPreferences } from "@/components/dashboard/tasks/feed/task-feed-preferences-context";
import {
  groupTasksByStatus,
  type TaskStatusGroup,
  type TasksByStatus,
  taskStatusGroups,
} from "@/components/dashboard/tasks/feed/task-feed-utils";
import Toolbar from "@/components/dashboard/tasks/feed/toolbar";
import { Button } from "@/components/ui/button";
import { QueryState } from "@/components/ui/query-state";
import { useProject, useProjects } from "@/hooks/projects/use-projects";

import { useTasks } from "@/hooks/tasks/use-tasks";

import { parseTaskQueryParams } from "@/lib/tasks/task-query";

const EMPTY_TASKS: Task[] = [];

const TaskFeedShell = ({
  projectId,

  reorder,
}: {
  projectId?: string;

  reorder: boolean;
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

  const [statusGroups, setStatusGroups] =
    useState<TaskStatusGroup[]>(taskStatusGroups);

  const [tasksByStatus, setTasksByStatus] = useState<TasksByStatus>(
    groupTasksByStatus(safeTasks)
  );

  const { view, setView } = useTaskFeedPreferences();

  useEffect(() => {
    setTasksByStatus(groupTasksByStatus(safeTasks));
  }, [safeTasks]);

  return (
    <div className="workspace-page flex min-w-0 flex-col gap-6">
      {project && (
        <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
          {project.title}
        </p>
      )}

      <Toolbar view={view} onViewChange={setView} page={"tasks"} />

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
      ) : view === "board" ? (
        <Board
          groups={statusGroups}
          items={tasksByStatus}
          setGroups={setStatusGroups}
          setItems={setTasksByStatus}
          reorder={reorder}
        />
      ) : (
        <ListView
          columns={statusGroups}
          items={tasksByStatus}
          setColumns={setStatusGroups}
          setItems={setTasksByStatus}
        />
      )}
    </div>
  );
};

export default TaskFeedShell;
