"use client";

import { useEffect, useState } from "react";
import type {
  FilterFieldConfig,
  FilterOption,
} from "@/components/dashboard/kanban/toolbar/filter-config";
import {
  DropdownMenuCheckboxItem,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "@/components/ui/dropdown-menu";

interface FilterSubmenuProps {
  field: FilterFieldConfig;
  selected: string[];
  onChange: (key: string, values: string[]) => void;
}

export function FilterSubmenu({
  field,
  selected,
  onChange,
}: FilterSubmenuProps) {
  const [options, setOptions] = useState<FilterOption[]>([]);

  useEffect(() => {
    Promise.resolve(field.getOptions()).then(setOptions);
  }, [field]);

  const FieldIcon = field.icon;

  return (
    <DropdownMenuSub>
      <DropdownMenuSubTrigger className={"p-2"}>
        <FieldIcon />
        {field.label}
      </DropdownMenuSubTrigger>
      <DropdownMenuSubContent sideOffset={12} className={"w-48 p-1.5"}>
        <DropdownMenuGroup>
          <DropdownMenuLabel>{field.label}</DropdownMenuLabel>
          {field.type === "multi-select" ? (
            options.map((opt) => (
              <DropdownMenuCheckboxItem
                className={"p-2"}
                key={opt.value}
                checked={selected.includes(opt.value)}
                onCheckedChange={(checked) => {
                  const next = checked
                    ? [...selected, opt.value]
                    : selected.filter((v) => v !== opt.value);
                  onChange(field.key, next);
                }}
              >
                <OptionRow option={opt} />
              </DropdownMenuCheckboxItem>
            ))
          ) : (
            <DropdownMenuRadioGroup
              value={selected[0] ?? ""}
              onValueChange={(value) => onChange(field.key, [value])}
            >
              {options.map((opt) => (
                <DropdownMenuRadioItem
                  key={opt.value}
                  value={opt.value}
                  className={"p-2"}
                >
                  <OptionRow option={opt} />
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          )}
        </DropdownMenuGroup>
      </DropdownMenuSubContent>
    </DropdownMenuSub>
  );
}

function OptionRow({ option }: { option: FilterOption }) {
  const Icon = option.icon;
  return (
    <>
      {Icon && <Icon className={option.color} />}
      <span className={option.color}>{option.label}</span>
    </>
  );
}
