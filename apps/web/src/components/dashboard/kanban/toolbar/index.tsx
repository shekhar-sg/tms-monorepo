"use client";

import { useState } from "react";
import Fields from "@/components/dashboard/kanban/toolbar/fields";
import type { ActiveFilters } from "@/components/dashboard/kanban/toolbar/filter-config";
import { FilterMenu } from "@/components/dashboard/kanban/toolbar/filter-menu";
import SearchBox from "@/components/dashboard/kanban/toolbar/search-box";
import { Button } from "@/components/ui/button";

interface KanbanToolbarProps {
  view: "board" | "list";
  onViewChange: (view: "board" | "list") => void;
}

const Toolbar = (props: KanbanToolbarProps) => {
  const { view, onViewChange } = props;
  const [filters, setFilters] = useState<ActiveFilters>({});
  const [search, setSearch] = useState("");

  return (
    <div className={"flex justify-between items-center p-2"}>
      <h2 className={"font-semibold"}>Tasks</h2>
      <div className={"flex gap-2"}>
        <SearchBox value={search} onChange={setSearch} />
        <Fields currentView={view} onViewChange={onViewChange} />
        <FilterMenu value={filters} onChange={setFilters} />{" "}
        <Button>Add Task</Button>
      </div>
    </div>
  );
};

export default Toolbar;
