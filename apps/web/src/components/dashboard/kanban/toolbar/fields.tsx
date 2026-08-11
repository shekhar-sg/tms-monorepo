"use client";

import { LuColumns3, LuGrid2X2 } from "react-icons/lu";
import { PiListBold } from "react-icons/pi";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import {
  Popover,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

const fields = [
  "Priority",
  "Members",
  "Due Date",
  "Labels",
  "Status",
  "Reporter",
];

interface FieldsProps {
  currentView: "board" | "list";
  onViewChange: (currentView: "board" | "list") => void;
}

const Fields = (props: FieldsProps) => {
  const { currentView, onViewChange } = props;
  return (
    <Popover>
      <PopoverTrigger
        render={<Button variant={"outline"} className={"rounded-[4px] "} />}
      >
        <LuColumns3 /> Fields
      </PopoverTrigger>
      <PopoverContent className={"p-4 gap-6"} align={"center"}>
        <PopoverHeader>
          <ToggleGroup
            value={[currentView]}
            variant={"outline"}
            className={"w-full gap-0"}
            onValueChange={(value) =>
              onViewChange(value[0] as "board" | "list")
            }
          >
            <ToggleGroupItem className={"flex-1 rounded-r-none"} value={"list"}>
              <PiListBold /> List
            </ToggleGroupItem>
            <ToggleGroupItem
              className={"flex-1 rounded-l-none"}
              value={"board"}
            >
              <LuGrid2X2 /> Board
            </ToggleGroupItem>
          </ToggleGroup>
        </PopoverHeader>

        <FieldGroup className={"gap-1.5"}>
          {fields.map((field, index) => (
            <Field
              key={field + index}
              orientation={"horizontal"}
              role={"switch"}
            >
              <FieldLabel
                htmlFor={field + index}
                className={"h-6.5 cursor-pointer"}
              >
                {field}
              </FieldLabel>
              <Checkbox
                id={field + index}
                className={"bg-input border-input text-foreground"}
              />
            </Field>
          ))}
        </FieldGroup>
      </PopoverContent>
    </Popover>
  );
};

export default Fields;
