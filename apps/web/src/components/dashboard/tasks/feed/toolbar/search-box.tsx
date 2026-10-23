"use client";

import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";

export default function SearchBox({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <InputGroup className="w-full bg-card sm:w-52">
      <InputGroupAddon>
        <Search className="size-4" />
      </InputGroupAddon>

      <InputGroupInput
        aria-label="Search tasks"
        value={value}
        placeholder="Search tasks…"
        onChange={(event) => onChange(event.target.value)}
      />

      {value && (
        <InputGroupAddon align="inline-end">
          <Button
            type="button"
            variant="ghost"
            size="icon-xs"
            aria-label="Clear search"
            onClick={() => onChange("")}
          >
            <X />
          </Button>
        </InputGroupAddon>
      )}
    </InputGroup>
  );
}
