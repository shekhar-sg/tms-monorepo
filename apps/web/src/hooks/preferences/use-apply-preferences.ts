"use client";

import type { AccentColor, Theme, UserPreference } from "@repo/types";
import { useTheme } from "next-themes";
import { useEffect } from "react";

const THEME_MAP: Record<Theme, "light" | "dark" | "system"> = {
  LIGHT: "light",
  DARK: "dark",
  SYSTEM: "system",
};

const ACCENT_COLOR_MAP: Record<AccentColor, string> = {
  AMBER: "amber",
  BLUE: "blue",
  PINK: "pink",
  ROSE: "rose",
  EMERALD: "emerald",
  BLACK: "black",
};

export const useApplyPreferences = (preferences?: UserPreference) => {
  const { setTheme } = useTheme();

  useEffect(() => {
    if (!preferences) return;

    setTheme(THEME_MAP[preferences.theme]);

    document.documentElement.dataset.accent =
      ACCENT_COLOR_MAP[preferences.accentColor];
  }, [preferences, setTheme]);
};
