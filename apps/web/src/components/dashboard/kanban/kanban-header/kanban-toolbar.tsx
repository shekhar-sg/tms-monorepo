"use client";

import { useState } from "react";
import Fields from "@/components/dashboard/kanban/kanban-header/fields";
import type { ActiveFilters } from "@/components/dashboard/kanban/kanban-header/filter-config";
import { FilterMenu } from "@/components/dashboard/kanban/kanban-header/filter-menu";
import { Button } from "@/components/ui/button";
import SearchBox from "@/components/dashboard/kanban/kanban-header/search-box";

const KanbanToolbar = () => {
  const [filters, setFilters] = useState<ActiveFilters>({});
  const [search, setSearch] = useState("");

  return (
    <div className={"flex justify-between items-center p-2"}>
      <h2 className={"font-semibold"}>Tasks</h2>
      <div className={"flex gap-2"}>
        <SearchBox value={search} onChange={setSearch} />
        <Fields />
        <FilterMenu value={filters} onChange={setFilters} />{" "}
        <Button>Add Task</Button>
      </div>
    </div>
  );
};

export default KanbanToolbar;
