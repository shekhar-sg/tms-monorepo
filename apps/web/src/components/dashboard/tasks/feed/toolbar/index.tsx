"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { LuPlus } from "react-icons/lu";
import Fields from "@/components/dashboard/tasks/feed/toolbar/fields";
import { FilterMenu } from "@/components/dashboard/tasks/feed/toolbar/filter-menu";
import SearchBox from "@/components/dashboard/tasks/feed/toolbar/search-box";
import { Button } from "@/components/ui/button";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import type { ActiveFilters } from "@/lib/tasks/filter-config";
import {
  filtersToSearchParams,
  searchParamsToFilters,
} from "@/lib/tasks/filter-url";
import { useNavigationTransition } from "@/providers/navigation-transition-context";

interface KanbanToolbarProps {
  page: "projects" | "tasks";
  view: "board" | "list";
  onViewChange: (view: "board" | "list") => void;
}

const Toolbar = (props: KanbanToolbarProps) => {
  const { view, onViewChange, page } = props;
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("search") ?? "");
  const filters = searchParamsToFilters(searchParams);
  const debouncedSearch = useDebouncedValue(search, 400);
  const { navigate } = useNavigationTransition();

  useEffect(() => {
    setSearch(searchParams.get("search") ?? "");
  }, [searchParams]);

  useEffect(() => {
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
  }, [debouncedSearch, pathname, router, searchParams, navigate]);

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
    <div className={"flex justify-between items-center p-2"}>
      <h2 className={"font-semibold capitalize"}>{page}</h2>
      <div className={"flex gap-2"}>
        <SearchBox value={search} onChange={setSearch} />
        <Fields currentView={view} onViewChange={onViewChange} />
        <FilterMenu value={filters} onChange={handleFiltersChange} />
        <Button
          nativeButton={false}
          className={"text-xs text-primary-foreground!"}
          render={<Link href={"/dashboard/tasks/new"} />}
        >
          <LuPlus /> Add {page}
        </Button>
      </div>
    </div>
  );
};

export default Toolbar;
