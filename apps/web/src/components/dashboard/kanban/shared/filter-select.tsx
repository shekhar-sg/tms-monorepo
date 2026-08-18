import type { FilterOption } from "@/components/dashboard/kanban/toolbar/filter-config";
import SelectOptions from "@/components/dashboard/tasks/new/select-options";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface FilterSelectProps<T extends string> {
  value?: T;
  options: FilterOption<T>[];
  placeholder?: string;
  disabled?: boolean;
  onChange: (value: T) => void;
}

const FilterSelect = <T extends string>({
  value,
  options,
  placeholder = "Select",
  disabled,
  onChange,
}: FilterSelectProps<T>) => {
  const selected = options.find((option) => option.value === value);

  const SelectedIcon = selected?.icon;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="link"
            size="sm"
            disabled={disabled}
            className="h-8 cursor-pointer"
          >
            {SelectedIcon && <SelectedIcon className={selected.color} />}

            {selected?.label ?? placeholder}
          </Button>
        }
      />

      <DropdownMenuContent className="w-48 p-1.5">
        <SelectOptions
          options={options}
          type="single-select"
          selected={value ? [value] : []}
          onChange={(values: string[]) => {
            const nextValue = values[0];

            if (nextValue) {
              onChange(nextValue as T);
            }
          }}
        />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default FilterSelect;
