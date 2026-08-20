import type { UpdateUserInput } from "@repo/types";
import { useMutation, useQuery } from "@tanstack/react-query";
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
  return useMutation({
    mutationFn: (data: UpdateUserInput) => updateCurrentUser(data),
  });
};

export const useLeaveWorkspace = () => {
  return useMutation({
    mutationFn: leaveWorkspace,
  });
};