"use client";

import { useState } from "react";
import {
  type BoardItems,
  type Column,
  columns as initialColumns,
  initialItems,
} from "@/components/dashboard/kanban/Board-static-data";
import Board from "@/components/dashboard/kanban/board";
import ListView from "@/components/dashboard/kanban/list";
import Toolbar from "@/components/dashboard/kanban/toolbar";

const KanbanShell = () => {
  const [view, setView] = useState<"board" | "list">("board");
  const [columns, setColumns] = useState<Column[]>(initialColumns);

  const [items, setItems] = useState<BoardItems>(initialItems);
  console.log({ view });
  return (
    <div className={"flex flex-col gap-1 p-4"}>
      <Toolbar view={view} onViewChange={setView} page={"tasks"} />
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
