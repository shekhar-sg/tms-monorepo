import { api } from "./client-api";

export const getCurrentUser = async () => {
  const response = await api.get("/auth/me");

  return response.data.data;
};

export const guestLogin = async () => {
  const response = await api.post("/auth/guest");

  return response.data.data;
};
