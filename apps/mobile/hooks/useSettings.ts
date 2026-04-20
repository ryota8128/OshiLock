import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { UpdateUserSettingsRequest } from '@oshilock/shared';
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
    onSuccess: (data) => {
      queryClient.setQueryData(SETTINGS_KEY, data);
    },
  });
}
