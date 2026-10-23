import type { UpdateUserInput } from "@repo/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { authKeys } from "@/hooks/auth/auth-keys";
import {
  getUsers,
  leaveWorkspace,
  updateCurrentUser,
} from "@/lib/api/users-api";

const userKeys = {
  all: ["users"] as const,
};

export function useUsers() {
  return useQuery({
    queryKey: userKeys.all,
    queryFn: () => getUsers(),
  });
}

export const useUpdateUser = () => {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdateUserInput) => updateCurrentUser(data),
    onSuccess: (user) => {
      client.setQueryData(authKeys.currentUser, user);
      client.invalidateQueries({ queryKey: userKeys.all });
    },
  });
};

export const useLeaveWorkspace = () => {
  const client = useQueryClient();
  return useMutation({
    mutationFn: leaveWorkspace,
    onSuccess: () => {
      client.clear();
      window.location.replace("/session-expired");
    },
  });
};
