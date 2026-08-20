"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
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
import { useTasks } from "@/hooks/tasks/use-tasks";
import { parseTaskQueryParams } from "@/lib/tasks/task-query";

const TaskFeedShell = () => {
  const searchParams = useSearchParams();
  const query = parseTaskQueryParams({
    search: searchParams.get("search") ?? undefined,
    status: searchParams.get("status") ?? undefined,
    priority: searchParams.get("priority") ?? undefined,
    labels: searchParams.get("labels") ?? undefined,
    dueDateFrom: searchParams.get("dueDateFrom") ?? undefined,
    dueDateTo: searchParams.get("dueDateTo") ?? undefined,
  });

  const { data: tasks = [] } = useTasks(undefined, query);

  const [statusGroups, setStatusGroups] =
    useState<TaskStatusGroup[]>(taskStatusGroups);
  const [tasksByStatus, setTasksByStatus] = useState<TasksByStatus>(
    groupTasksByStatus(tasks)
  );

  const { view, setView } = useTaskFeedPreferences();

  useEffect(() => {
    setTasksByStatus(groupTasksByStatus(tasks));
  }, [tasks]);

  return (
    <div className="flex flex-col gap-1 p-4">
      <Toolbar view={view} onViewChange={setView} page={"tasks"} />

      {view === "board" ? (
        <Board
          groups={statusGroups}
          items={tasksByStatus}
          setGroups={setStatusGroups}
          setItems={setTasksByStatus}
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
