import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { authKeys } from "@/hooks/auth/auth-keys";
import { getCurrentUser, guestLogin } from "@/lib/api/auth-api";

export function useCurrentUser() {
  return useQuery({
    queryKey: authKeys.currentUser,
    queryFn: getCurrentUser,
    retry: false,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
}

export function useGuestLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: guestLogin,
    onSuccess: (data) => {
      queryClient.setQueryData(authKeys.currentUser, data.user);
    },
  });
}
