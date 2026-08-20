"use client";

import { useState } from "react";
import { LuFilter } from "react-icons/lu";
import FilterSubmenu from "@/components/dashboard/tasks/feed/toolbar/filter-submenu";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { type ActiveFilters, FILTER_FIELDS } from "@/lib/tasks/filter-config";

interface FilterMenuProps {
  value: ActiveFilters;
  onChange: (filters: ActiveFilters) => void;
}

export function FilterMenu({ value, onChange }: FilterMenuProps) {
  const [open, setOpen] = useState(false);

  function handleFieldChange(key: string, values: string[]) {
    onChange({ ...value, [key]: values });
  }

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger
        render={
          <Button variant={"outline"} size={"icon"} className={"rounded-[4px]"}>
            <LuFilter />
          </Button>
        }
      />
      <DropdownMenuContent align={"center"} className={"w-48 p-1.5"}>
        {FILTER_FIELDS.map((field) => (
          <FilterSubmenu
            key={field.key}
            field={field}
            selected={value[field.key] ?? []}
            onChange={handleFieldChange}
          />
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
