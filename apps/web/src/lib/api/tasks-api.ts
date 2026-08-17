import type {
  CreateTaskInput,
  MoveTaskInput,
  Task,
  UpdateTaskInput,
} from "@repo/types";
import type { AxiosInstance } from "axios";

import { api } from "./client-api";

export const getTasks = async (
  projectId?: string,
  client: AxiosInstance = api
): Promise<Task[]> => {
  const response = await client.get("/tasks", {
    params: projectId ? { projectId } : undefined,
  });

  return response.data.data;
};

export const getTask = async (
  taskId: string,
  client: AxiosInstance = api
): Promise<Task> => {
  const response = await client.get(`/tasks/${taskId}`);

  return response.data.data;
};

export const createTask = async (data: CreateTaskInput): Promise<Task> => {
  const response = await api.post("/tasks", data);

  return response.data.data;
};

export const updateTask = async ({
  taskId,
  data,
}: {
  taskId: string;
  data: UpdateTaskInput;
}): Promise<Task> => {
  const response = await api.patch(`/tasks/${taskId}`, data);

  return response.data.data;
};

export const moveTask = async ({
  taskId,
  data,
}: {
  taskId: string;
  data: MoveTaskInput;
}): Promise<Task> => {
  const response = await api.patch(`/tasks/${taskId}/move`, data);

  return response.data.data;
};

export const deleteTask = async (taskId: string): Promise<Task> => {
  const response = await api.delete(`/tasks/${taskId}`);

  return response.data.data;
};
