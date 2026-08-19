"use client";

import { useEffect, useState } from "react";
import type { DateRange } from "react-day-picker";
import type {
  FilterFieldConfig,
  FilterOption,
} from "@/components/dashboard/kanban/toolbar/filter-config";
import DatePicker from "@/components/dashboard/tasks/new/date-picker";
import SelectOptions from "@/components/dashboard/tasks/new/select-options";
import { Button } from "@/components/ui/button";
import {
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "@/components/ui/dropdown-menu";

interface FilterSubmenuProps {
  field: FilterFieldConfig;
  selected: string[];
  onChange: (key: string, values: string[]) => void;
}

const FilterSubmenu = (props: FilterSubmenuProps) => {
  const { field, selected, onChange } = props;

  const [options, setOptions] = useState<FilterOption[]>([]);

  useEffect(() => {
    if (field.key === "members" || field.type === "date-range") {
      return;
    }

    Promise.resolve(field.getOptions()).then(setOptions);
  }, [field]);

  const FieldIcon = field.icon;

  const selectedOption =
    field.type !== "date-range"
      ? options.find((option) => option.value === selected[0])
      : undefined;

  const SelectedIcon = selectedOption?.icon;

  const range: DateRange | undefined =
    field.type === "date-range"
      ? {
          from: selected[0] ? new Date(selected[0]) : undefined,
          to: selected[1] ? new Date(selected[1]) : undefined,
        }
      : undefined;

  return (
    <DropdownMenuSub>
      <DropdownMenuSubTrigger className="p-2">
        {field.type === "single-select" && SelectedIcon ? (
          <SelectedIcon className={selectedOption.color} />
        ) : (
          <FieldIcon />
        )}

        {(field.type === "single-select" ? selectedOption?.label : undefined) ??
          field.label}
      </DropdownMenuSubTrigger>

      <DropdownMenuSubContent sideOffset={12} className="w-48 p-1.5">
        <DropdownMenuGroup>
          <DropdownMenuLabel>{field.label}</DropdownMenuLabel>

          {field.type === "date-range" ? (
            <DatePicker
              value={range}
              onChange={(nextRange) => {
                onChange(field.key, [
                  nextRange?.from?.toISOString() ?? "",
                  nextRange?.to?.toISOString() ?? "",
                ]);
              }}
              Trigger={({ range }) => (
                <Button variant="outline" className="w-full">
                  {range?.from
                    ? range.to
                      ? `${range.from.toLocaleDateString()} - ${range.to.toLocaleDateString()}`
                      : range.from.toLocaleDateString()
                    : "Select dates"}
                </Button>
              )}
            />
          ) : (
            <SelectOptions
              options={options}
              type={field.type}
              selected={selected}
              onChange={(values) => onChange(field.key, values)}
            />
          )}
        </DropdownMenuGroup>
      </DropdownMenuSubContent>
    </DropdownMenuSub>
  );
};

export default FilterSubmenu;
