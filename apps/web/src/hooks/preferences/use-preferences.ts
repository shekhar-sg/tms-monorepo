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

    onMutate: async (newPreferences) => {
      await queryClient.cancelQueries({
        queryKey: preferencesKeys.current(),
      });

      const previousPreferences = queryClient.getQueryData<UserPreference>(
        preferencesKeys.current()
      );

      queryClient.setQueryData<UserPreference>(
        preferencesKeys.current(),
        (current) => {
          if (!current) {
            return current;
          }
          return {
            ...current,
            ...newPreferences,
          };
        }
      );
      return {
        previousPreferences,
      };
    },

    onError: (_error, _newPreferences, context) => {
      if (!context?.previousPreferences) {
        return;
      }
      queryClient.setQueryData(
        preferencesKeys.current(),
        context.previousPreferences
      );
    },

    onSuccess: (data) => {
      queryClient.setQueryData(preferencesKeys.current(), data);
    },
  });
};
