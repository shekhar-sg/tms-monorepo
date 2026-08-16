"use client";

import Link from "next/link";
import { useState } from "react";
import { LuPlus } from "react-icons/lu";
import Fields from "@/components/dashboard/kanban/toolbar/fields";
import type { ActiveFilters } from "@/components/dashboard/kanban/toolbar/filter-config";
import { FilterMenu } from "@/components/dashboard/kanban/toolbar/filter-menu";
import SearchBox from "@/components/dashboard/kanban/toolbar/search-box";
import { Button } from "@/components/ui/button";

interface KanbanToolbarProps {
  page: "projects" | "tasks";
  view: "board" | "list";
  onViewChange: (view: "board" | "list") => void;
}

const Toolbar = (props: KanbanToolbarProps) => {
  const { view, onViewChange, page } = props;
  const [filters, setFilters] = useState<ActiveFilters>({});
  const [search, setSearch] = useState("");

  return (
    <div className={"flex justify-between items-center p-2"}>
      <h2 className={"font-semibold capitalize"}>{page}</h2>
      <div className={"flex gap-2"}>
        <SearchBox value={search} onChange={setSearch} />
        <Fields currentView={view} onViewChange={onViewChange} />
        <FilterMenu value={filters} onChange={setFilters} />{" "}
        <Button
          nativeButton={false}
          className={"text-xs text-primary-foreground!"}
          render={<Link href={"/dashboard/tasks/new"} />}
        >
          <LuPlus /> Add Task
        </Button>
      </div>
    </div>
  );
};

export default Toolbar;
