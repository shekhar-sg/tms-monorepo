"use client";

import { useState } from "react";
import { LuFilter } from "react-icons/lu";
import FilterSubmenu from "@/components/dashboard/tasks/feed/toolbar/filter-submenu";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLabels } from "@/hooks/labels/use-labels";
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

  const { data: labels = [] } = useLabels();

  const labelOptions = labels.map((label) => ({
    value: label.id,
    label: label.name,
    color: label.color ?? undefined,
  }));

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger
        render={
          <Button aria-label="Filter tasks" variant={"outline"} size={"icon"} className={"rounded-[4px]"}>
            <LuFilter />
          </Button>
        }
      />
      <DropdownMenuContent align={"center"} className={"w-48 p-1.5"}>
        {Object.values(value).some((items) => items.some(Boolean)) && (
          <DropdownMenuItem onClick={() => onChange({})}>Clear filters</DropdownMenuItem>
        )}
        {FILTER_FIELDS.map((field) => (
          <FilterSubmenu
            key={field.key}
            field={field}
            selected={value[field.key] ?? []}
            onChange={handleFieldChange}
            options={field.key === "labels" ? labelOptions : undefined}
          />
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
