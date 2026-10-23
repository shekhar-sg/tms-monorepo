"use client";
import type { TaskViewPreference } from "@repo/types";
import { usePathname } from "next/navigation";
import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { QueryState } from "@/components/ui/query-state";
import { toast } from "@/components/ui/toast";
import {
  usePreferences,
  useUpdatePreferences,
} from "@/hooks/preferences/use-preferences";
import { taskStatusGroups } from "./task-feed-utils";

const defaults: TaskViewPreference = {
  view: "board",
  sort: "manual",
  fields: ["priority", "dueDate", "actions"],
  columns: taskStatusGroups.map((g) => g.id),
};
type Value = TaskViewPreference & {
  visibleFields: string[];
  setView: (v: "board" | "list") => void;
  setVisibleFields: (v: string[]) => void;
  setSort: (v: TaskViewPreference["sort"]) => void;
  setColumns: (v: TaskViewPreference["columns"], persist?: boolean) => void;
};
const Context = createContext<Value | null>(null);
export function TaskFeedPreferencesProvider({
  children,
}: {
  children: ReactNode;
}) {
  const path = usePathname();
  const { data, error } = usePreferences();
  const { mutate } = useUpdatePreferences();
  const [value, setValue] = useState(defaults);
  const current = useRef(value);
  const loaded = useRef("");
  useEffect(() => {
    if (data && loaded.current !== path) {
      const next = data.taskViews?.[path] ?? defaults;
      loaded.current = path;
      current.current = next;
      setValue(next);
    }
  }, [data, path]);
  const save = (patch: Partial<TaskViewPreference>, persist = true) => {
    const next = { ...current.current, ...patch };
    current.current = next;
    setValue(next);
    if (!persist) return;
    mutate(
      { taskViews: { [path]: next } },
      {
        onError: () =>
          toast.add({
            title: "View settings could not be saved",
            type: "error",
          }),
      }
    );
  };
  if (!data && !error)
    return (
      <div className="workspace-page">
        <QueryState loading title="Loading your view…" />
      </div>
    );
  const displayValue =
    loaded.current === path ? value : (data?.taskViews?.[path] ?? defaults);
  return (
    <Context.Provider
      value={{
        ...displayValue,
        visibleFields: displayValue.fields,
        setView: (view) => save({ view }),
        setSort: (sort) => save({ sort }),
        setVisibleFields: (fields) =>
          save({ fields: fields as TaskViewPreference["fields"] }),
        setColumns: (columns, persist) => save({ columns }, persist),
      }}
    >
      {children}
    </Context.Provider>
  );
}
export function useTaskFeedPreferences() {
  const value = useContext(Context);
  if (!value) throw new Error("Missing task preferences provider");
  return value;
}
