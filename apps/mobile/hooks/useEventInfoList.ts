import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import { eventInfoApi } from '@/api/event-info';

const EVENT_INFO_LIST_KEY = ['events'] as const;
const STALE_TIME = 1 * 60 * 60 * 1000; // 1時間
const PAGE_SIZE = 30;

export function useEventInfoList(oshiId: string) {
  return useInfiniteQuery({
    queryKey: [...EVENT_INFO_LIST_KEY, oshiId],
    queryFn: ({ pageParam }) => eventInfoApi.getList(oshiId, PAGE_SIZE, pageParam),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.cursor ?? undefined,
    staleTime: STALE_TIME,
  });
}

export function useInvalidateEventInfoList() {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: EVENT_INFO_LIST_KEY });
}
