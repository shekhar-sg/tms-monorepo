"use client";

import { useEffect, useState } from "react";
import { Users } from "lucide-react";

import type { FilterOption } from "@/components/dashboard/kanban/toolbar/filter-config";
import { FILTER_FIELDS } from "@/components/dashboard/kanban/toolbar/filter-config";
import SelectOptions from "@/components/dashboard/tasks/new/select-options";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface MembersSelectProps {
  value: string[];
  onChange: (value: string[]) => void;
}

const MembersSelect = (props: MembersSelectProps) => {
  const { value, onChange } = props;

  const [members, setMembers] = useState<FilterOption[]>([]);

  useEffect(() => {
    const field = FILTER_FIELDS.find((item) => item.key === "members");

    if (!field) return;

    Promise.resolve(field.getOptions()).then(setMembers);
  }, []);

  const selectedMembers = members.filter((member) =>
    value.includes(member.value)
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button variant={"ghost"}>
            <Users />
            {selectedMembers.length > 0 ? (
              <span className="truncate">
                {selectedMembers.map((member) => member.label).join(", ")}
              </span>
            ) : (
              <span className="text-muted-foreground">Add members</span>
            )}
          </Button>
        }
      />

      <DropdownMenuContent className={"w-48 p-1.5"}>
        <SelectOptions
          options={members}
          type={"multi-select"}
          selected={value}
          onChange={onChange}
          renderOption={AvatarOption}
        />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default MembersSelect;

const AvatarOption = ({ option }: { option: FilterOption }) => {
  return (
    <>
      <Avatar size="sm">
        <AvatarFallback>{option.label.charAt(0).toUpperCase()}</AvatarFallback>
      </Avatar>

      <span>{option.label}</span>
    </>
  );
};
