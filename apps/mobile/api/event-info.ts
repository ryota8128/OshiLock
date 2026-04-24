import { apiClient } from './client';
import type { GetEventInfoListResponse, GetEventInfoResponse } from '@oshilock/shared';

export const eventInfoApi = {
  /**
   * 指定した推しのイベント情報一覧を取得する。
   * @param oshiId - 推しID
   * @param limit - 取得件数上限（省略時はサーバーデフォルト）
   * @param cursor - ページネーションカーソル（省略時は先頭から取得）
   */
  getList(oshiId: string, limit?: number, cursor?: string): Promise<GetEventInfoListResponse> {
    const params = new URLSearchParams();
    if (limit !== undefined) params.set('limit', String(limit));
    if (cursor !== undefined) params.set('cursor', cursor);
    const qs = params.toString();
    return apiClient.get(`/events/${oshiId}${qs ? `?${qs}` : ''}`);
  },

  /**
   * 指定した推しのイベント情報1件を取得する。
   * @param oshiId - 推しID
   * @param eventId - イベントID
   */
  getById(oshiId: string, eventId: string): Promise<GetEventInfoResponse> {
    return apiClient.get(`/events/${oshiId}/${eventId}`);
  },
};
