import { Tag } from "lucide-react";
import { type Control, Controller } from "react-hook-form";
import {
  AVAILABLE_LABELS,
  type CreateTaskInputWithMore,
} from "@/components/dashboard/tasks/new/task-page";
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

const LabelsCombobox = ({
  control,
}: {
  control: Control<CreateTaskInputWithMore>;
}) => {
  const anchor = useComboboxAnchor();

  return (
    <Controller
      name={"labels"}
      control={control}
      defaultValue={[AVAILABLE_LABELS[0]!]}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <Combobox
            {...field}
            multiple
            autoHighlight
            items={AVAILABLE_LABELS}
            onValueChange={field.onChange}
          >
            <ComboboxChips
              ref={anchor}
              className={"w-full border-none min-h-7"}
            >
              <ComboboxValue>
                {(values) => (
                  <>
                    {values.map((value: string) => (
                      <ComboboxChip
                        className={"rounded-full border-none h-fit"}
                        key={value}
                        render={
                          <Badge variant={"secondary"}>
                            <Tag strokeWidth={3} /> {value}
                          </Badge>
                        }
                      >
                        {value}
                      </ComboboxChip>
                    ))}
                    <ComboboxChipsInput />
                  </>
                )}
              </ComboboxValue>
            </ComboboxChips>
            <ComboboxContent anchor={anchor}>
              <ComboboxEmpty>No items found.</ComboboxEmpty>
              <ComboboxList>
                {(item) => (
                  <ComboboxItem key={item} value={item}>
                    {item}
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
