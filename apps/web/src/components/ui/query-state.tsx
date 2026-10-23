"use client";

import { AlertCircle, Inbox, LoaderCircle } from "lucide-react";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";

export function QueryState({
  loading,
  error,
  title,
  description,
  onRetry,
  children,
}: {
  loading?: boolean;
  error?: boolean;
  title: string;
  description?: string;
  onRetry?: () => void;
  children?: ReactNode;
}) {
  const Icon = loading ? LoaderCircle : error ? AlertCircle : Inbox;
  return (
    <div
      className="flex min-h-48 flex-col items-center justify-center gap-3 rounded-xl border border-dashed bg-card p-6 text-center"
      role={error ? "alert" : "status"}
    >
      <span className="rounded-xl bg-muted p-3 text-muted-foreground">
        <Icon className={loading ? "size-5 animate-spin" : "size-5"} />
      </span>
      <div>
        <p className="font-medium">{title}</p>
        {description && (
          <p className="mt-1 max-w-sm text-sm text-muted-foreground">
            {description}
          </p>
        )}
      </div>
      {onRetry && (
        <Button type="button" variant="outline" size="sm" onClick={onRetry}>
          Try again
        </Button>
      )}
      {children}
    </div>
  );
}
