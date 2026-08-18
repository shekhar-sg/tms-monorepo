import type {
  CreateProjectInput,
  Project,
  UpdateProjectInput,
} from "@repo/types";
import type { AxiosInstance } from "axios";
import { api } from "./client-api";

export const getProjects = async (
  client: AxiosInstance = api
): Promise<Project[]> => {
  const response = await client.get("/projects");

  return response.data.data;
};

export const getProject = async (
  projectId?: string,
  client: AxiosInstance = api
): Promise<Project> => {
  const response = await client.get(`/projects/${projectId}`);

  return response.data.data;
};

export const createProject = async (data: CreateProjectInput) => {
  const response = await api.post("/projects", data);

  return response.data.data;
};

export const updateProject = async ({
  projectId,
  data,
}: {
  projectId: string;
  data: UpdateProjectInput;
}) => {
  const response = await api.patch(`/projects/${projectId}`, data);

  return response.data.data;
};

export const deleteProject = async (projectId: string) => {
  const response = await api.delete(`/projects/${projectId}`);

  return response.data.data;
};
