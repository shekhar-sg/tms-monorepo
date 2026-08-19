"use client";

import type { ReactNode } from "react";
import { createContext, useContext, useTransition } from "react";

type FeedTransitionContextValue = {
  isPending: boolean;
  navigate: (fn: () => void) => void;
};

const NavigationTransitionContext = createContext<FeedTransitionContextValue>({
  isPending: false,
  navigate: (fn) => fn(),
});

export function useNavigationTransition() {
  return useContext(NavigationTransitionContext);
}

export function NavigationTransitionProvider({ children }: { children: ReactNode }) {
  const [isPending, startTransition] = useTransition();
  return (
    <NavigationTransitionContext.Provider
      value={{ isPending, navigate: startTransition }}
    >
      {children}
    </NavigationTransitionContext.Provider>
  );
}
