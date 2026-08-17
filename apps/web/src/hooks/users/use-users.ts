import { useQuery } from "@tanstack/react-query";
import { getUsers } from "@/lib/api/users-api";

const userKeys = {
  all: ["users"] as const,
};

export function useUsers() {
  return useQuery({
    queryKey: userKeys.all,
    queryFn: () => getUsers(),
  });
}
