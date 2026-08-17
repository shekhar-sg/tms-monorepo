"use client";

import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { type Control, Controller } from "react-hook-form";
import { RiAttachmentLine } from "react-icons/ri";
import DatePicker from "@/components/dashboard/tasks/new/date-picker";
import LabelsCombobox from "@/components/dashboard/tasks/new/labels-combobox";
import ReporterSelect from "@/components/dashboard/tasks/new/reporter-select";
import { CreateTaskInputWithMore } from "@/components/dashboard/tasks/new/task-page";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Field, FieldError } from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";

interface TaskMetadataPropertiesProps {
  control: Control<CreateTaskInputWithMore>;
}

const TaskMetadataProperties = ({ control }: TaskMetadataPropertiesProps) => {
  return (
    <div className={"flex flex-col gap-3 text-sm"}>
      <div className={"flex items-center gap-4"}>
        <span className={"w-16 font-medium shrink-0 text-muted-foreground"}>
          Properties
        </span>

        <div className={"flex items-center gap-2"}>
          <ReporterSelect control={control} />
          <DatePicker
            control={control}
            Trigger={({ range }) => (
              <Badge
                variant={"destructive"}
                render={
                  <Button variant={"destructive"} className={"cursor-pointer"}>
                    <CalendarIcon />
                    {range?.from
                      ? range.to
                        ? format(range.to, "d MMM")
                        : format(range.from, "d MMM")
                      : "Pick a date range"}{" "}
                  </Button>
                }
              />
            )}
          />
        </div>
      </div>

      <div className={"flex items-center justify-between gap-4"}>
        <span className={"w-16 font-medium shrink-0 text-muted-foreground"}>
          Labels
        </span>
        <LabelsCombobox control={control} />
      </div>

      <div className={"flex items-center gap-4"}>
        <span className={"w-16 font-medium shrink-0 text-muted-foreground"}>
          Resources
        </span>

        <Controller
          control={control}
          name={"resource"}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <InputGroup className={"max-w-md border-0 shadow-none h-fit"}>
                <InputGroupAddon>
                  <RiAttachmentLine />
                </InputGroupAddon>

                <InputGroupInput
                  {...field}
                  value={field.value ?? ""}
                  placeholder={"Add document or link..."}
                  className={"text-xs focus-visible:ring-0 h-fit"}
                />
              </InputGroup>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </div>
    </div>
  );
};

export default TaskMetadataProperties;
