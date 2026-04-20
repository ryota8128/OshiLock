import { useQuery, useQueryClient } from '@tanstack/react-query';
import { userApi } from '@/api/user';

const PROFILE_KEY = ['users', 'me'] as const;
const STALE_TIME = 4 * 60 * 60 * 1000; // 4時間

export function useProfile() {
  return useQuery({
    queryKey: PROFILE_KEY,
    queryFn: () => userApi.getProfile(),
    staleTime: STALE_TIME,
    select: (data) => data.user,
  });
}

export function useInvalidateProfile() {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: PROFILE_KEY });
}
