import { type Control, Controller } from "react-hook-form";
import SelectOptions from "@/components/dashboard/tasks/detail/select-options";
import type { TaskFormValues } from "@/components/dashboard/tasks/detail/task-page";
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
import { useUsers } from "@/hooks/users/use-users";

interface ReporterSelectProps {
  control: Control<TaskFormValues>;
}

const ReporterSelect = (props: ReporterSelectProps) => {
  const { control } = props;

  const { data: users = [] } = useUsers();
  const reporterOptions = users.map((user) => ({
    value: user.id,
    label: user.name ?? user.email ?? "Unnamed user",
  }));

  return (
    <Controller
      control={control}
      name={"reporterId"}
      render={({ field, fieldState }) => {
        const reporter = users.find((user) => user.id === field.value);

        return (
          <Field data-invalid={fieldState.invalid}>
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button
                    variant={"ghost"}
                    className={"h-8 justify-start gap-2 px-2"}
                  >
                    {reporter && (
                      <Avatar size={"sm"}>
                        <AvatarFallback>
                          {(reporter.name ?? reporter.email ?? "U")
                            .charAt(0)
                            .toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    )}

                    {reporter?.name ?? reporter?.email ?? "Reporter"}
                  </Button>
                }
              />

              <DropdownMenuContent className={"w-48 p-1.5"}>
                <DropdownMenuGroup>
                  <DropdownMenuLabel>Reporter</DropdownMenuLabel>
                  <SelectOptions
                    options={reporterOptions}
                    type={"single-select"}
                    selected={field.value ? [field.value] : []}
                    onChange={(values: string[]) => {
                      field.onChange(values[0] ?? null);
                    }}
                    renderOption={({ option }) => {
                      const user = users.find(
                        (item) => item.id === option.value
                      );
                      return (
                        <>
                          <Avatar size={"sm"}>
                            <AvatarFallback>
                              {(user?.name ?? user?.email ?? "U")
                                .charAt(0)
                                .toUpperCase()}
                            </AvatarFallback>
                          </Avatar>

                          <span>{option.label}</span>
                        </>
                      );
                    }}
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
