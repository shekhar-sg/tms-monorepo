import { User } from "@repo/types";
import type { AxiosInstance } from "axios";
import { api } from "./client-api";

export const getCurrentUser = async (
  client: AxiosInstance = api
): Promise<User> => {
  const response = await client.get("/users/me");

  return response.data.data;
};

export const guestLogin = async () => {
  const response = await api.post("/auth/guest");

  return response.data.data;
};
