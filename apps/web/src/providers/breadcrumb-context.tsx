"use client";

import { createContext, type ReactNode, useContext, useState } from "react";

type BreadcrumbContextValue = {
  dynamicLabel: string | null;
  setDynamicLabel: (label: string | null) => void;
};

const BreadcrumbContext = createContext<BreadcrumbContextValue | null>(null);

export function BreadcrumbProvider({ children }: { children: ReactNode }) {
  const [dynamicLabel, setDynamicLabel] = useState<string | null>(null);

  return (
    <BreadcrumbContext.Provider
      value={{
        dynamicLabel,
        setDynamicLabel,
      }}
    >
      {children}
    </BreadcrumbContext.Provider>
  );
}

export function useBreadcrumb() {
  const context = useContext(BreadcrumbContext);

  if (!context) {
    throw new Error("useBreadcrumb must be used within BreadcrumbProvider");
  }

  return context;
}
