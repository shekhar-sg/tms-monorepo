import type { UpdateUserInput, User } from "@repo/types";
import type { AxiosInstance } from "axios";

import { api } from "./client-api";

export const getUsers = async (
  client: AxiosInstance = api
): Promise<User[]> => {
  const response = await client.get("/users");

  return response.data.data;
};

export const updateCurrentUser = async (
  data: UpdateUserInput
): Promise<User> => {
  const response = await api.patch("/users/me", data);

  return response.data.data;
};

export const leaveWorkspace = async (): Promise<void> => {
  await api.delete("/users/me");
};