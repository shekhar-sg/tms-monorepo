"use client";

import { Tag } from "lucide-react";
import { type Control, Controller } from "react-hook-form";
import type { TaskFormValues } from "@/components/dashboard/tasks/new/task-page";
import { Badge } from "@/components/ui/badge";
import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxItem,
  ComboboxList,
  ComboboxValue,
  useComboboxAnchor,
} from "@/components/ui/combobox";
import { Field, FieldError } from "@/components/ui/field";
import { useLabels } from "@/hooks/labels/use-labels";

const LabelsCombobox = ({ control }: { control?: Control<TaskFormValues> }) => {
  const anchor = useComboboxAnchor();
  const { data: labels = [], isLoading } = useLabels();

  return (
    <Controller
      name={"labels"}
      control={control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <Combobox
            multiple
            autoHighlight
            items={labels}
            value={field.value}
            onValueChange={field.onChange}
            disabled={isLoading}
          >
            <ComboboxChips
              ref={anchor}
              className={"w-full border-none min-h-7"}
            >
              <ComboboxValue>
                {(values) => (
                  <>
                    {values.map((value: string) => {
                      const label = labels.find((item) => item.id === value);
                      if (!label) return null;

                      return (
                        <ComboboxChip
                          className={"rounded-full border-none h-fit"}
                          key={value}
                          render={
                            <Badge variant={"secondary"}>
                              <Tag
                                strokeWidth={3}
                                style={
                                  label.color
                                    ? { color: label.color }
                                    : undefined
                                }
                              />
                              {label.name}
                            </Badge>
                          }
                        >
                          {label.name}
                        </ComboboxChip>
                      );
                    })}

                    <ComboboxChipsInput/>
                  </>
                )}
              </ComboboxValue>
            </ComboboxChips>
            <ComboboxContent anchor={anchor}>
              <ComboboxEmpty>No labels found.</ComboboxEmpty>
              <ComboboxList>
                {(item) => (
                  <ComboboxItem key={item.id} value={item.id}>
                    <Tag
                      strokeWidth={3}
                      className={"text-muted-foreground"}
                      style={
                        item.color
                          ? {
                              color: item.color,
                            }
                          : undefined
                      }
                    />
                    {item.name}
                  </ComboboxItem>
                )}
              </ComboboxList>
            </ComboboxContent>
          </Combobox>

          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  );
};

export default LabelsCombobox;
