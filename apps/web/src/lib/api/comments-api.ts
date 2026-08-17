import type { Comment, CreateCommentInput } from "@repo/types";

import { api } from "./client-api";

export const getTaskComments = async (taskId: string): Promise<Comment[]> => {
  const response = await api.get(`/tasks/${taskId}/comments`);

  return response.data.data;
};

export const createTaskComment = async ({
  taskId,
  data,
}: {
  taskId: string;
  data: Omit<CreateCommentInput, "taskId">;
}): Promise<Comment> => {
  const response = await api.post(`/tasks/${taskId}/comments`, data);

  return response.data.data;
};
