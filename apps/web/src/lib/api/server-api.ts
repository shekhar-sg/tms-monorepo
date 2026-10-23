import axios from "axios";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function serverApi() {
  const cookieStore = await cookies();

  const client = axios.create({
    baseURL: process.env.API_URL || "http://localhost:4000",
    headers: {
      Cookie: cookieStore.toString(),
    },
  });
  client.interceptors.response.use(undefined, (error: unknown) => {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      redirect("/session-expired");
    }
    return Promise.reject(error);
  });
  return client;
}
