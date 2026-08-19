"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import {
  type BoardItems,
  type Column,
  groupTasksByStatus,
  columns as initialColumns,
} from "@/components/dashboard/kanban/Board-static-data";
import Board from "@/components/dashboard/kanban/board";
import ListView from "@/components/dashboard/kanban/list";
import Toolbar from "@/components/dashboard/kanban/toolbar";
import { useTasks } from "@/hooks/tasks/use-tasks";
import { parseTaskQueryParams } from "@/lib/tasks/task-query";

const KanbanShell = () => {
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

  const [view, setView] = useState<"board" | "list">("board");
  const [columns, setColumns] = useState<Column[]>(initialColumns);

  const [items, setItems] = useState<BoardItems>(() =>
    groupTasksByStatus(tasks)
  );

  useEffect(() => {
    setItems(groupTasksByStatus(tasks));
  }, [tasks]);

  return (
    <div className="flex flex-col gap-1 p-4">
      <Toolbar view={view} onViewChange={setView} page="tasks" />

      {view === "board" ? (
        <Board
          columns={columns}
          items={items}
          setColumns={setColumns}
          setItems={setItems}
        />
      ) : (
        <ListView
          columns={columns}
          items={items}
          setColumns={setColumns}
          setItems={setItems}
        />
      )}
    </div>
  );
};

export default KanbanShell;
