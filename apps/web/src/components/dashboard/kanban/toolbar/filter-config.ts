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
  LuUser,
  LuUsers,
} from "react-icons/lu";
import { PiCircleBold } from "react-icons/pi";

export type FilterFieldType = "single-select" | "multi-select" | "date-range";

export interface FilterOption {
  value: string;
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

async function getMemberOptions() {
  return [
    { value: "user-1", label: "Shekhar" },
    { value: "user-2", label: "Guest User" },
  ];
}

export const STATUS_OPTIONS: FilterOption[] = [
  {
    value: "backlog",
    label: "Backlog",
    icon: LuCircle,
    color: "text-muted-foreground",
  },
  { value: "todo", label: "Todo", icon: LuCircle, color: "text-foreground" },
  {
    value: "in-progress",
    label: "In Progress",
    icon: LuCircleDot,
    color: "text-yellow-500",
  },
  {
    value: "done",
    label: "Done",
    icon: LuCircleCheck,
    color: "text-green-500",
  },
];

export const PRIORITY_OPTIONS: FilterOption[] = [
  {
    value: "no-priority",
    label: "No Priority",
    icon: LuSignalZero,
    color: "text-primary",
  },
  {
    value: "urgent",
    label: "Urgent",
    icon: LuSignalHigh,
    color: "text-red-500",
  },
  {
    value: "high",
    label: "High",
    icon: LuSignalHigh,
    color: "text-orange-500",
  },
  {
    value: "medium",
    label: "Medium",
    icon: LuSignalMedium,
    color: "text-yellow-500",
  },
  {
    value: "low",
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
    type: "single-select",
    getOptions: () => STATUS_OPTIONS,
  },
  {
    key: "priority",
    label: "Priority",
    icon: LuSignal,
    type: "single-select",
    getOptions: () => PRIORITY_OPTIONS,
  },
  {
    key: "members",
    label: "Members",
    icon: LuUsers,
    type: "multi-select",
    getOptions: getMemberOptions,
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
  {
    key: "reporter",
    label: "Reporter",
    icon: LuUser,
    type: "single-select",
    getOptions: getMemberOptions,
  },
];
