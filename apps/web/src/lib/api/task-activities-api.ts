import type { TaskActivity } from "@repo/types";

import { api } from "./client-api";

export const getTaskActivities = async (
  taskId: string
): Promise<TaskActivity[]> => {
  const response = await api.get(`/tasks/${taskId}/activities`);

  return response.data.data;
};
