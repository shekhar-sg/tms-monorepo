import type { UpdateUserPreferenceInput, UserPreference } from "@repo/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api/client-api";

const preferencesKeys = {
  all: ["preferences"] as const,
  current: () => [...preferencesKeys.all, "current"] as const,
};

const getPreferences = async (): Promise<UserPreference> => {
  const { data } = await api.get("/preferences");

  return data.data;
};

const updatePreferences = async (
  data: UpdateUserPreferenceInput
): Promise<UserPreference> => {
  const response = await api.patch("/preferences", data);

  return response.data.data;
};

export const usePreferences = () => {
  return useQuery({
    queryKey: preferencesKeys.current(),
    queryFn: getPreferences,
  });
};

export const useUpdatePreferences = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updatePreferences,

    onSuccess: (data) => {
      queryClient.setQueryData(preferencesKeys.current(), data);
    },
  });
};
