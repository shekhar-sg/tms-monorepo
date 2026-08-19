import type { AccentColor, Theme } from "@repo/types";
import type { IconType } from "react-icons";
import { FaLaptop, FaSquare } from "react-icons/fa6";
import { PiMoonBold, PiSunBold } from "react-icons/pi";

export interface PreferenceOption<T extends string> {
  value: T;
  label: string;
  icon?: IconType;
  color?: string;
}

export const THEME_OPTIONS: PreferenceOption<Theme>[] = [
  {
    value: "LIGHT",
    label: "Light",
    icon: PiSunBold,
  },
  {
    value: "DARK",
    label: "Dark",
    icon: PiMoonBold,
  },
  {
    value: "SYSTEM",
    label: "System",
    icon: FaLaptop,
  },
];

export const ACCENT_COLOR_OPTIONS: PreferenceOption<AccentColor>[] = [
  {
    value: "AMBER",
    label: "Amber",
    icon: FaSquare,
    color: "text-amber-600",
  },
  {
    value: "BLUE",
    label: "Blue",
    icon: FaSquare,
    color: "text-blue-600",
  },
  {
    value: "PINK",
    label: "Pink",
    icon: FaSquare,
    color: "text-pink-600",
  },
  {
    value: "ROSE",
    label: "Rose",
    icon: FaSquare,
    color: "text-rose-600",
  },
  {
    value: "EMERALD",
    label: "Emerald",
    icon: FaSquare,
    color: "text-emerald-600",
  },
  {
    value: "BLACK",
    label: "Black",
    icon: FaSquare,
    color: "text-black",
  },
];
