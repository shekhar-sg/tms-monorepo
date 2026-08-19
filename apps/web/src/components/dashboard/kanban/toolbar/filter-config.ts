import type { Priority, Status } from "@repo/types";
import type { IconType } from "react-icons";
import {
  LuCalendar,
  LuCircle,
  LuCircleCheck,
  LuCircleDot,
  LuSignal,
  LuSignalHigh,
  LuSignalLow,
  LuSignalMedium,
  LuSignalZero,
  LuTag,
} from "react-icons/lu";
import { PiCircleBold, PiCircleFill, PiCircleNotchFill } from "react-icons/pi";

export type FilterFieldType = "single-select" | "multi-select" | "date-range";

export interface FilterOption<T extends string = string> {
  value: T;
  label: string;
  icon?: IconType;
  color?: string;
}

export interface FilterFieldConfig {
  key: string;
  label: string;
  icon: IconType;
  type: FilterFieldType;
  getOptions: () => FilterOption[] | Promise<FilterOption[]>;
}

export type ActiveFilters = Record<string, string[]>;

export const STATUS_OPTIONS: FilterOption<Status>[] = [
  {
    value: "BACKLOG",
    label: "Backlog",
    icon: PiCircleFill,
    color: "text-muted-foreground",
  },
  { value: "TODO", label: "Todo", icon: LuCircle, color: "text-foreground" },
  {
    value: "IN_PROGRESS",
    label: "In Progress",
    icon: LuCircleDot,
    color: "text-yellow-500",
  },
  {
    value: "REVIEW",
    label: "Review",
    icon: PiCircleNotchFill,
    color: "text-blue-500",
  },
  {
    value: "DONE",
    label: "Done",
    icon: LuCircleCheck,
    color: "text-green-500",
  },
];

export const PRIORITY_OPTIONS: FilterOption<Priority>[] = [
  {
    value: "NONE",
    label: "No Priority",
    icon: LuSignalZero,
    color: "text-primary",
  },
  {
    value: "URGENT",
    label: "Urgent",
    icon: LuSignalHigh,
    color: "text-red-500",
  },
  {
    value: "HIGH",
    label: "High",
    icon: LuSignalHigh,
    color: "text-orange-500",
  },
  {
    value: "MEDIUM",
    label: "Medium",
    icon: LuSignalMedium,
    color: "text-yellow-500",
  },
  {
    value: "LOW",
    label: "Low",
    icon: LuSignalLow,
    color: "text-gray-400",
  },
];

export const FILTER_FIELDS: FilterFieldConfig[] = [
  {
    key: "status",
    label: "Status",
    icon: PiCircleBold,
    type: "multi-select",
    getOptions: () => STATUS_OPTIONS,
  },
  {
    key: "priority",
    label: "Priority",
    icon: LuSignal,
    type: "multi-select",
    getOptions: () => PRIORITY_OPTIONS,
  },
  {
    key: "dueDate",
    label: "Due Date",
    icon: LuCalendar,
    type: "date-range",
    getOptions: () => [],
  },
  {
    key: "labels",
    label: "Labels",
    icon: LuTag,
    type: "multi-select",
    getOptions: () => [],
  },
];
