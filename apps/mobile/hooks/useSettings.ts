import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UpdateUserSettingsRequest, UserSettings } from '@oshilock/shared';
import { userApi } from '@/api/user';

const SETTINGS_KEY = ['users', 'me', 'settings'] as const;
const STALE_TIME = 4 * 60 * 60 * 1000; // 4時間

export function useSettings() {
  return useQuery({
    queryKey: SETTINGS_KEY,
    queryFn: () => userApi.getSettings(),
    staleTime: STALE_TIME,
    select: (data) => data.settings,
  });
}

export function useUpdateSettings() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: UpdateUserSettingsRequest) => userApi.updateSettings(body),
    onMutate: async (body) => {
      await queryClient.cancelQueries({ queryKey: SETTINGS_KEY });
      const previous = queryClient.getQueryData(SETTINGS_KEY);

      queryClient.setQueryData(SETTINGS_KEY, (old: { settings: UserSettings } | undefined) => {
        if (!old) return old;
        return {
          settings: {
            ...old.settings,
            notification: { ...old.settings.notification, ...body.notification },
          },
        };
      });

      return { previous };
    },
    onError: (_err, _body, context) => {
      if (context?.previous) {
        queryClient.setQueryData(SETTINGS_KEY, context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: SETTINGS_KEY });
    },
  });
}
