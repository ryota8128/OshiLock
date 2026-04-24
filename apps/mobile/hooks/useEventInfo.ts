import { useQuery, useQueryClient } from '@tanstack/react-query';
import { eventInfoApi } from '@/api/event-info';
import type { EventInfo } from '@oshilock/shared';
import type { GetEventInfoListResponse } from '@oshilock/shared';

const EVENT_INFO_KEY = ['events', 'detail'] as const;
const STALE_TIME = 1 * 60 * 60 * 1000; // 1時間

/**
 * イベント情報1件を取得するhook。
 *
 * InfiniteQueryのキャッシュにあればそれを返し、APIは呼ばない。
 * キャッシュになければAPIから取得する。
 */
export function useEventInfo(oshiId: string, eventId: string) {
  const queryClient = useQueryClient();

  const cachedEvent = queryClient
    .getQueryData<{ pages: GetEventInfoListResponse[] }>(['events', oshiId])
    ?.pages.flatMap((p) => p.items)
    .find((item) => item.id === eventId) satisfies EventInfo | undefined;

  return useQuery({
    queryKey: [...EVENT_INFO_KEY, oshiId, eventId],
    queryFn: () => eventInfoApi.getById(oshiId, eventId).then((res) => res.eventInfo),
    initialData: cachedEvent,
    staleTime: STALE_TIME,
    enabled: !cachedEvent,
  });
}
