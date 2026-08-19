"use client";


import {useApplyPreferences} from "@/hooks/preferences/use-apply-preferences";
import {usePreferences} from "@/hooks/preferences/use-preferences";

const PreferencesProvider = ({ children }: { children: React.ReactNode }) => {
  const { data: preferences } = usePreferences();

  useApplyPreferences(preferences);

  return children;
};

export default PreferencesProvider;
