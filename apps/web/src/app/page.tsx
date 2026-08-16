"use client";

import { useCurrentUser } from "@/hooks/auth/use-auth";

const Home = () => {
  const { data: user, isLoading, error } = useCurrentUser();

  if (isLoading) return <div>Loading...</div>;

  if (error) return <div>Not authenticated</div>;

  return <div>Hello {user?.name ?? "Guest"}</div>;
};

export default Home;
