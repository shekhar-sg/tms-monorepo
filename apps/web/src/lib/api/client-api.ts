import axios from "axios";

export const api = axios.create({
  baseURL: "/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

let redirecting = false;
api.interceptors.response.use(undefined, async (error: unknown) => {
  if (
    axios.isAxiosError(error) &&
    error.response?.status === 401 &&
    typeof window !== "undefined" &&
    window.location.pathname !== "/login" &&
    !redirecting
  ) {
    redirecting = true;
    try {
      await axios.post("/api/auth/logout", undefined, {
        withCredentials: true,
      });
      window.location.replace("/login");
    } catch {
      redirecting = false;
    }
  }
  return Promise.reject(error);
});
