import type { Label } from "@repo/types";
import type { AxiosInstance } from "axios";
import { api } from "./client-api";

export const getLabels = async (
  client: AxiosInstance = api
): Promise<Label[]> => {
  const response = await client.get("/labels");

  return response.data.data;
};
