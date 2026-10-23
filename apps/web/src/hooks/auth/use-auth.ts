import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { authKeys } from "@/hooks/auth/auth-keys";
import { getCurrentUser, guestLogin } from "@/lib/api/auth-api";
import { api } from "@/lib/api/client-api";

export function useAuthProviders() {
  return useQuery({
    queryKey: ["auth", "providers"],
    queryFn: async (): Promise<{ google: boolean; ai: boolean }> =>
      (await api.get("/auth/providers")).data.data,
    staleTime: 60_000,
  });
}

export function useCurrentUser() {
  return useQuery({
    queryKey: authKeys.currentUser,
    queryFn: () => getCurrentUser(),
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
