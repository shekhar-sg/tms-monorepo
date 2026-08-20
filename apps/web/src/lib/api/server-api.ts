import axios from "axios";
import { cookies } from "next/headers";

export async function serverApi() {
  const cookieStore = await cookies();

  const isProd = process.env.NODE_ENV === "production";
  return axios.create({
    baseURL: isProd ? process.env.NEXT_PUBLIC_API_URL : "http://localhost:4000",
    headers: {
      Cookie: cookieStore.toString(),
    },
  });
}
