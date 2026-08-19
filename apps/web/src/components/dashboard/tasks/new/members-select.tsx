"use client";

import { Users } from "lucide-react";
import { type Control, Controller } from "react-hook-form";
import SelectOptions from "@/components/dashboard/tasks/new/select-options";
import type { TaskFormValues } from "@/components/dashboard/tasks/new/task-page";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Field, FieldError } from "@/components/ui/field";
import { useUsers } from "@/hooks/users/use-users";

interface MembersSelectProps {
  control?: Control<TaskFormValues>;
}

const MembersSelect = (props: MembersSelectProps) => {
  const { control } = props;

  const { data: users = [] } = useUsers();

  return (
    <Controller
      control={control}
      name={"members"}
      render={({ field, fieldState }) => {
        const selectedMembers = users.filter((user) =>
          field.value.includes(user.id)
        );

        return (
          <Field data-invalid={fieldState.invalid}>
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button variant={"ghost"}>
                    <Users />
                    {selectedMembers.length > 0 ? (
                      <span className={"truncate"}>
                        {selectedMembers
                          .map(
                            (member) => member.name ?? member.email ?? "Unknown"
                          )
                          .join(", ")}
                      </span>
                    ) : (
                      <span className={"text-muted-foreground"}>
                        Add members
                      </span>
                    )}
                  </Button>
                }
              />

              <DropdownMenuContent className={"w-48 p-1.5"}>
                <SelectOptions
                  options={users.map((user) => ({
                    value: user.id,
                    label: user.name ?? user.email ?? "Unknown",
                  }))}
                  type={"multi-select"}
                  selected={field.value}
                  onChange={field.onChange}
                  renderOption={({ option }) => {
                    const user = users.find((item) => item.id === option.value);

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
              </DropdownMenuContent>
            </DropdownMenu>

            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        );
      }}
    />
  );
};

export default MembersSelect;
