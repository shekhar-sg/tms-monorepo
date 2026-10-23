"use client";

import {
  MutationCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import axios from "axios";
import { ReactNode, useState } from "react";
import { toast } from "@/components/ui/toast";

export function QueryProvider({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        mutationCache: new MutationCache({
          onError: (error) => {
            const message = axios.isAxiosError(error)
              ? (error.response?.data?.error?.message ??
                error.response?.data?.message)
              : undefined;
            toast.add({
              type: "error",
              title: "Changes could not be saved",
              description:
                typeof message === "string"
                  ? message
                  : "Check your connection and try again.",
            });
          },
        }),
        defaultOptions: {
          queries: {
            staleTime: 30 * 1000,
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
