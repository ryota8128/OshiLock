import type { EventInfo, PaginatedResult } from '../../..';

export type GetEventInfoListResponse = PaginatedResult<EventInfo>;

export type GetEventInfoResponse = {
  eventInfo: EventInfo;
};
