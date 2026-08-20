import SelectOptions from "@/components/dashboard/tasks/detail/select-options";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { FilterOption } from "@/lib/tasks/filter-config";
import { cn } from "@/lib/utils";

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
            className={cn("h-8 cursor-pointer", selected?.color)}
          >
            {SelectedIcon && <SelectedIcon />}
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
