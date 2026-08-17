import { type Control, Controller } from "react-hook-form";
import type { FilterOption } from "@/components/dashboard/kanban/toolbar/filter-config";
import AvatarOption from "@/components/dashboard/tasks/new/avatar-option";
import SelectOptions from "@/components/dashboard/tasks/new/select-options";
import type { CreateTaskInputWithMore } from "@/components/dashboard/tasks/new/task-page";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Field, FieldError } from "@/components/ui/field";

const REPORTER_OPTIONS: FilterOption[] = [
  {
    value: "designer",
    label: "Designer",
  },
  {
    value: "developer",
    label: "Developer",
  },
  {
    value: "manager",
    label: "Manager",
  },
];

interface ReporterSelectProps {
  control: Control<CreateTaskInputWithMore>;
}

const ReporterSelect = ({ control }: ReporterSelectProps) => {
  return (
    <Controller
      control={control}
      name="assigneeId"
      render={({ field, fieldState }) => {
        const selectedReporter = REPORTER_OPTIONS.find(
          (option) => option.value === field.value
        );

        return (
          <Field data-invalid={fieldState.invalid}>
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button variant={"ghost"}>
                    {selectedReporter && (
                      <Avatar size="sm">
                        <AvatarFallback>
                          {selectedReporter.label.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    )}

                    {selectedReporter?.label ?? "Reporter"}
                  </Button>
                }
              />

              <DropdownMenuContent className={"w-40 p-1.5"}>
                <DropdownMenuGroup>
                  <DropdownMenuLabel>Reporter</DropdownMenuLabel>
                  <SelectOptions
                    options={REPORTER_OPTIONS}
                    type="single-select"
                    selected={field.value ? [field.value] : []}
                    onChange={(values) => {
                      field.onChange(values[0] ?? "");
                    }}
                    renderOption={AvatarOption}
                  />
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>

            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        );
      }}
    />
  );
};

export default ReporterSelect;
