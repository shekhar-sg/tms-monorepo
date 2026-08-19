"use client";

import { useEffect, useRef, useState } from "react";
import { LuSearch } from "react-icons/lu";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Kbd } from "@/components/ui/kbd";

interface TaskSearchProps {
  value: string;
  onChange: (value: string) => void;
}

const SearchBox = ({ value, onChange }: TaskSearchProps) => {
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      const isShortcut =
        (e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "f";
      if (isShortcut) {
        e.preventDefault();
        setOpen(true);
        requestAnimationFrame(() => inputRef.current?.focus());
      }
      if (e.key === "Escape" && open) {
        setOpen(false);
        inputRef.current?.blur();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  function handleBlur() {
    if (!value) setOpen(false);
  }

  return (
    <InputGroup className={"rounded-[4px] flex items-center justify-center"}>
      <InputGroupAddon className={"flex items-center justify-center p-0"}>
        <div
          className={"size-8 cursor-pointer flex items-center justify-center"}
          onClick={() => {
            setOpen((prevState) => !prevState);
          }}
        >
          <LuSearch />
        </div>
      </InputGroupAddon>
      {open && (
        <>
          <InputGroupInput
            ref={inputRef}
            value={value}
            placeholder={"Type something..."}
            onChange={(e) => onChange(e.target.value)}
            onBlur={handleBlur}
            autoFocus
            className={"w-93.25"}
          />
          <InputGroupAddon align={"inline-end"}>
            <Kbd>⌘F</Kbd>
          </InputGroupAddon>
        </>
      )}
    </InputGroup>
  );
};

export default SearchBox;
