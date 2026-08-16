import axios from "axios";
import { cookies } from "next/headers";

export async function serverApi() {
  const cookieStore = await cookies();

  return axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    headers: {
      Cookie: cookieStore.toString(),
    },
  });
}
