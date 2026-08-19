import type { GetTasksQuery } from "@repo/types";

export const taskKeys = {
  all: ["tasks"] as const,

  lists: () => [...taskKeys.all, "list"] as const,

  list: (projectId?: string, query?: GetTasksQuery) =>
    [...taskKeys.lists(), { projectId, ...query }] as const,

  detail: (taskId: string) => [...taskKeys.all, "detail", taskId] as const,
};
