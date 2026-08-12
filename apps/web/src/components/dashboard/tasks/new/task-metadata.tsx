"use client";

import { format } from "date-fns";
import { CalendarIcon, Tag } from "lucide-react";
import { useState } from "react";
import { RiAttachmentLine } from "react-icons/ri";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const AVAILABLE_LABELS = [
  "Research",
  "Design",
  "Development",
  "Testing",
  "Deployment",
  "Frontend",
  "Backend",
];

const ASSIGNEES = [
  {
    id: "designer",
    name: "Designer",
    initials: "A",
  },
  {
    id: "developer",
    name: "Developer",
    initials: "D",
  },
  {
    id: "manager",
    name: "Manager",
    initials: "M",
  },
];

const TaskMetadataProperties = () => {
  const [assignee, setAssignee] = useState(ASSIGNEES[0]);

  const [date, setDate] = useState<Date | undefined>(new Date(2026, 6, 31));

  const [labels, setLabels] = useState<(string | undefined)[]>();

  const [resource, setResource] = useState("");
  const anchor = useComboboxAnchor();
  console.log({ labels });

  return (
    <div className={"flex flex-col gap-3 text-sm"}>
      <div className={"flex items-center gap-4"}>
        <span className={"w-16 font-medium shrink-0 text-muted-foreground"}>
          Properties
        </span>

        <div className={"flex items-center gap-2"}>
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Badge
                  render={<Button variant={"ghost"} />}
                  variant={"ghost"}
                  className={"size-fit cursor-pointer"}
                >
                  <Avatar size={"sm"}>
                    <AvatarFallback>{assignee?.initials}</AvatarFallback>
                  </Avatar>
                  {assignee?.name}
                </Badge>
              }
            />

            <DropdownMenuContent className={"w-40"}>
              <DropdownMenuGroup
                onToggle={(event) => console.log("toggle", event)}
              >
                <DropdownMenuLabel>Assignee</DropdownMenuLabel>
                <DropdownMenuRadioGroup
                  value={assignee}
                  onValueChange={(value) => setAssignee(value)}
                >
                  {ASSIGNEES.map((person) => (
                    <DropdownMenuRadioItem value={person} key={person.id}>
                      <Avatar size={"sm"}>
                        <AvatarFallback className={"bg-slate-200 text-[10px]"}>
                          {person.initials}
                        </AvatarFallback>
                      </Avatar>
                      {person.name}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>

          <Popover>
            <PopoverTrigger
              render={
                <Badge
                  variant={"destructive"}
                  render={
                    <Button
                      variant={"destructive"}
                      className={"cursor-pointer"}
                    >
                      <CalendarIcon />
                      {date ? format(date, "d MMM") : "Pick a date"}
                    </Button>
                  }
                />
              }
            ></PopoverTrigger>

            <PopoverContent className="w-auto p-0" align="start">
              <Calendar mode="single" selected={date} onSelect={setDate} />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <div className={"flex items-center justify-between gap-4"}>
        <span className={"w-16 font-medium shrink-0 text-muted-foreground"}>
          Labels
        </span>
        <Combobox
          multiple
          autoHighlight
          items={AVAILABLE_LABELS}
          defaultValue={[AVAILABLE_LABELS[0]]}
          onValueChange={(value) => setLabels(value)}
        >
          <ComboboxChips ref={anchor} className={"w-full border-none min-h-7"}>
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
      </div>

      <div className={"flex items-center gap-4"}>
        <span className={"w-16 font-medium shrink-0 text-muted-foreground"}>
          Resources
        </span>

        <InputGroup className={"max-w-md border-0 shadow-none h-fit"}>
          <InputGroupAddon>
            <RiAttachmentLine />
          </InputGroupAddon>

          <InputGroupInput
            value={resource}
            onChange={(event) => setResource(event.target.value)}
            placeholder="Add document or link..."
            className={"text-xs focus-visible:ring-0 h-fit"}
          />
        </InputGroup>
      </div>
    </div>
  );
};

export default TaskMetadataProperties;
