"use client";

import type { FilterOption } from "@/components/dashboard/kanban/toolbar/filter-config";
import SelectOptions from "@/components/dashboard/tasks/new/select-options";
import {
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "@/components/ui/dropdown-menu";

interface PreferenceSelectProps<T extends string> {
  value?: T;
  options: FilterOption<T>[];
  title: string;
  placeholder?: string;
  disabled?: boolean;
  onChange: (value: T) => void;
}

const PreferenceSelectOption = <T extends string>({
  value,
  options,
  title,
  disabled = false,
  onChange,
}: PreferenceSelectProps<T>) => {
  const selected = options.find((option) => option.value === value);

  const SelectedIcon = selected?.icon;

  console.log({ options,value });
  console.log({ SelectedIcon,selected });

  return (
    <DropdownMenuSub>
      <DropdownMenuSubTrigger disabled={disabled}>
        {SelectedIcon && <SelectedIcon className={selected?.color} />}
        <span>{title}</span>
      </DropdownMenuSubTrigger>

      <DropdownMenuSubContent
        align={"start"}
        sideOffset={12}
        className={"w-48"}
      >
        <DropdownMenuGroup>
          <DropdownMenuLabel>{title}</DropdownMenuLabel>
          <SelectOptions
            options={options}
            type={"single-select"}
            selected={value ? [value] : []}
            onChange={(values) => {
              const nextValue = values[0];
              if (nextValue) {
                onChange(nextValue as T);
              }
            }}
          />
        </DropdownMenuGroup>
      </DropdownMenuSubContent>
    </DropdownMenuSub>
  );
};

export default PreferenceSelectOption;
