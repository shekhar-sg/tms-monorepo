"use client";

import { LayoutGrid, List } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { LuPlus } from "react-icons/lu";
import Fields from "@/components/dashboard/tasks/feed/toolbar/fields";
import { FilterMenu } from "@/components/dashboard/tasks/feed/toolbar/filter-menu";
import SearchBox from "@/components/dashboard/tasks/feed/toolbar/search-box";
import { Button } from "@/components/ui/button";
import { useCreateTaskHref } from "@/hooks/tasks/use-create-task-href";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import type { ActiveFilters } from "@/lib/tasks/filter-config";
import {
  filtersToSearchParams,
  searchParamsToFilters,
} from "@/lib/tasks/filter-url";
import { useNavigationTransition } from "@/providers/navigation-transition-context";
import { useTaskFeedPreferences } from "../task-feed-preferences-context";

interface KanbanToolbarProps {
  title?: string;

  page: "projects" | "tasks";

  view: "board" | "list";

  onViewChange: (view: "board" | "list") => void;
}

const Toolbar = (props: KanbanToolbarProps) => {
  const { view, onViewChange } = props;

  const { sort, setSort } = useTaskFeedPreferences();

  const createHref = useCreateTaskHref();

  const router = useRouter();

  const pathname = usePathname();

  const searchParams = useSearchParams();

  const [search, setSearch] = useState(searchParams.get("search") ?? "");

  const editingSearch = useRef(false);

  const filters = searchParamsToFilters(searchParams);

  const debouncedSearch = useDebouncedValue(search, 400);

  const { navigate } = useNavigationTransition();

  useEffect(() => {
    editingSearch.current = false;

    setSearch(searchParams.get("search") ?? "");
  }, [searchParams]);

  useEffect(() => {
    if (!editingSearch.current || debouncedSearch !== search) return;

    const params = new URLSearchParams(searchParams.toString());

    if (debouncedSearch.trim()) {
      params.set("search", debouncedSearch.trim());
    } else {
      params.delete("search");
    }

    const query = params.toString();

    const currentSearch = searchParams.get("search") ?? "";

    if (currentSearch === debouncedSearch.trim()) {
      return;
    }

    navigate(() => {
      router.replace(query ? `${pathname}?${query}` : pathname, {
        scroll: false,
      });
    });
  }, [debouncedSearch, search, pathname, router, searchParams, navigate]);

  const handleFiltersChange = (nextFilters: ActiveFilters) => {
    const params = filtersToSearchParams(nextFilters, searchParams);

    const query = params.toString();

    navigate(() => {
      router.push(query ? `${pathname}?${query}` : pathname, {
        scroll: false,
      });
    });
  };

  return (
    <div
      className={
        "flex flex-col gap-4 border-b pb-5 lg:flex-row lg:items-center lg:justify-between"
      }
    >
      <div>
        <h1 className="page-heading">{props.title ?? "Tasks"}</h1>

        <p className="page-description">
          Organize priorities and move work forward.
        </p>
      </div>

      <div className="flex min-w-0 flex-wrap items-center gap-2">
        <SearchBox
          value={search}
          onChange={(value) => {
            editingSearch.current = true;

            setSearch(value);
          }}
        />

        <div
          className="flex rounded-md border bg-card p-0.5"
          role="group"
          aria-label="Task view"
        >
          <Button
            size="icon-sm"
            variant={view === "board" ? "secondary" : "ghost"}
            aria-label="Board view"
            aria-pressed={view === "board"}
            onClick={() => onViewChange("board")}
          >
            <LayoutGrid />
          </Button>

          <Button
            size="icon-sm"
            variant={view === "list" ? "secondary" : "ghost"}
            aria-label="Table view"
            aria-pressed={view === "list"}
            onClick={() => onViewChange("list")}
          >
            <List />
          </Button>
        </div>

        <select
          aria-label="Sort tasks"
          className="h-8 rounded-md border bg-card px-2 text-xs"
          value={sort}
          onChange={(e) => setSort(e.target.value as typeof sort)}
        >
          <option value="manual">Manual order</option>
          <option value="priority">Priority</option>
          <option value="dueDate">Due date</option>
          <option value="created">Newest first</option>
          <option value="title">Title A–Z</option>
        </select>

        <Fields currentView={view} onViewChange={onViewChange} />

        <FilterMenu value={filters} onChange={handleFiltersChange} />

        <Button
          nativeButton={false}
          className={"text-xs text-primary-foreground!"}
          render={<Link href={createHref} />}
        >
          <LuPlus /> Create task
        </Button>
      </div>
    </div>
  );
};

export default Toolbar;
