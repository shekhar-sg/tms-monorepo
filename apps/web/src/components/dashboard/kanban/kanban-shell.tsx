"use client";

import { useState } from "react";
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

const KanbanShell = () => {
  const { data: tasks = [] } = useTasks();

  const [view, setView] = useState<"board" | "list">("board");
  const [columns, setColumns] = useState<Column[]>(initialColumns);

  const [items, setItems] = useState<BoardItems>(() =>
    groupTasksByStatus(tasks)
  );

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
