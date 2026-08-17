import { useQuery } from "@tanstack/react-query";

import { getTaskActivities } from "@/lib/api/task-activities-api";

export const taskActivityKeys = {
  all: ["task-activities"] as const,
  task: (taskId: string) => [...taskActivityKeys.all, taskId] as const,
};

export function useTaskActivities(taskId: string) {
  return useQuery({
    queryKey: taskActivityKeys.task(taskId),
    queryFn: () => getTaskActivities(taskId),
    enabled: Boolean(taskId),
  });
}
