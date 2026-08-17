import type { UserOption } from "@repo/types";
import type { AxiosInstance } from "axios";

import { api } from "./client-api";

export const getUsers = async (
    client: AxiosInstance = api,
): Promise<UserOption[]> => {
    const response = await client.get("/users");

    return response.data.data;
};