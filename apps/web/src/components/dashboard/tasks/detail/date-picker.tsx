import type { ReactElement } from "react";
import type { DateRange } from "react-day-picker";
import { type Control, Controller } from "react-hook-form";
import type { TaskFormValues } from "@/components/dashboard/tasks/detail/task-page";
import { Calendar } from "@/components/ui/calendar";
import { Field, FieldError } from "@/components/ui/field";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface TriggerRenderProps {
  range: DateRange | undefined;
}

interface DatePickerProps {
  control?: Control<TaskFormValues>;
  value?: DateRange;
  onChange?: (range: DateRange | undefined) => void;
  Trigger: (props: TriggerRenderProps) => ReactElement;
}

const DatePicker = ({ control, value, onChange, Trigger }: DatePickerProps) => {
  if (control) {
    return (
      <Controller
        control={control}
        name={"dateRange"}
        render={({ field, fieldState }) => {
          const range = field.value as DateRange | undefined;

          return (
            <Field data-invalid={fieldState.invalid}>
              <DatePickerPopover
                range={range}
                onChange={field.onChange}
                Trigger={Trigger}
              />

              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          );
        }}
      />
    );
  }

  return (
    <DatePickerPopover range={value} onChange={onChange} Trigger={Trigger} />
  );
};

interface DatePickerPopoverProps {
  range: DateRange | undefined;
  onChange?: (range: DateRange | undefined) => void;
  Trigger: (props: TriggerRenderProps) => ReactElement;
}

function DatePickerPopover({
  range,
  onChange,
  Trigger,
}: DatePickerPopoverProps) {
  return (
    <Popover>
      <PopoverTrigger render={Trigger({ range })} />

      <PopoverContent className={"w-auto p-0"} align={"start"}>
        <Calendar mode={"range"} selected={range} onSelect={onChange} min={1} />
      </PopoverContent>
    </Popover>
  );
}

export default DatePicker;
