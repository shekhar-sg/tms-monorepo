"use client";
import { usePathname } from "next/navigation";

export function useCreateTaskHref() {
  const pathname = usePathname();
  const projectId = pathname.match(/^\/dashboard\/projects\/([^/]+)$/)?.[1];
  return projectId
    ? `/dashboard/tasks/new?${new URLSearchParams({ projectId }).toString()}`
    : "/dashboard/tasks/new";
}
