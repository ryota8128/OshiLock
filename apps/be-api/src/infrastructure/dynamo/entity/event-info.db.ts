import type { EventInfo } from '@oshilock/shared';
import {
  EVENT_CATEGORY,
  SOURCE_RELIABILITY,
  EventId,
  OshiId,
  UserId,
  DateString,
  TimeString,
  UtcIsoString,
} from '@oshilock/shared';
import { Entity, type EntityItem } from 'electrodb';
import { dynamoClient, TABLE_NAME } from '../client.js';

const _entity = new Entity(
  {
    model: {
      entity: 'EventInfo',
      version: '1',
      service: 'oshilock',
    },
    attributes: {
      eventId: { type: 'string', required: true },
      oshiId: { type: 'string', required: true },
      title: { type: 'string', required: true },
      scheduleStartDate: { type: 'string' },
      scheduleStartTime: { type: 'string' },
      scheduleEndDate: { type: 'string' },
      scheduleEndTime: { type: 'string' },
      summary: { type: 'string', required: true },
      detail: { type: 'string', required: true },
      category: { type: Object.values(EVENT_CATEGORY), required: true },
      sourceReliability: { type: Object.values(SOURCE_RELIABILITY), required: true },
      sourceUrls: { type: 'list', items: { type: 'string' }, required: true },
      fastestPosterIds: { type: 'list', items: { type: 'string' }, required: true },
      commentCount: { type: 'number', required: true, default: 0 },
      savedCount: { type: 'number', required: true, default: 0 },
      tasukaruCount: { type: 'number', required: true, default: 0 },
      sortDate: { type: 'string', required: true },
      createdAt: { type: 'string', required: true },
      updatedAt: { type: 'string', required: true },
    },
    indexes: {
      primary: {
        pk: { field: 'pk', composite: ['oshiId'], template: 'OSHI#${oshiId}' },
        sk: { field: 'sk', composite: ['eventId'], template: 'EVENT#${eventId}' },
      },
      byOshi: {
        index: 'GSI1',
        pk: {
          field: 'gsi1pk',
          composite: ['oshiId'],
          template: 'EVENT#OSHI#${oshiId}',
        },
        sk: {
          field: 'gsi1sk',
          composite: ['sortDate'],
          template: '${sortDate}',
        },
      },
      byCategory: {
        index: 'GSI2',
        pk: {
          field: 'gsi2pk',
          composite: ['oshiId', 'category'],
          template: 'EVENT#OSHI#${oshiId}#${category}',
        },
        sk: {
          field: 'gsi2sk',
          composite: ['sortDate'],
          template: '${sortDate}',
        },
      },
    },
  },
  { client: dynamoClient, table: TABLE_NAME },
);

export namespace EventInfoDb {
  export const entity = _entity;
  export type Item = EntityItem<typeof _entity>;

  export function toDomain(record: Item): EventInfo {
    return {
      id: EventId.from(record.eventId),
      oshiId: OshiId.from(record.oshiId),
      title: record.title,
      schedule: {
        startDate: record.scheduleStartDate ? DateString.from(record.scheduleStartDate) : null,
        startTime: record.scheduleStartTime ? TimeString.from(record.scheduleStartTime) : null,
        endDate: record.scheduleEndDate ? DateString.from(record.scheduleEndDate) : null,
        endTime: record.scheduleEndTime ? TimeString.from(record.scheduleEndTime) : null,
      },
      summary: record.summary,
      detail: record.detail,
      category: record.category,
      sourceReliability: record.sourceReliability,
      sourceUrls: record.sourceUrls,
      fastestPosterIds: [
        record.fastestPosterIds[0] ? UserId.from(record.fastestPosterIds[0]) : null,
        record.fastestPosterIds[1] ? UserId.from(record.fastestPosterIds[1]) : null,
        record.fastestPosterIds[2] ? UserId.from(record.fastestPosterIds[2]) : null,
      ],
      sortDate: DateString.from(record.sortDate),
      commentCount: record.commentCount,
      savedCount: record.savedCount,
      tasukaruCount: record.tasukaruCount,
      createdAt: UtcIsoString.from(record.createdAt),
      updatedAt: UtcIsoString.from(record.updatedAt),
    };
  }
}
