import { Entity, type EntityItem } from 'electrodb';
import {
  SUBSCRIPTION_STATUS,
  UserId,
  OshiId,
  SubscriptionStatus,
  UtcIsoString,
} from '@oshilock/shared';
import type { UserOshi } from '@oshilock/shared';
import { dynamoClient, TABLE_NAME } from '../client.js';

const _entity = new Entity(
  {
    model: {
      entity: 'UserOshi',
      version: '1',
      service: 'oshilock',
    },
    attributes: {
      userId: { type: 'string', required: true },
      oshiId: { type: 'string', required: true },
      order: { type: 'number', required: true },
      subscriptionStatus: {
        type: Object.values(SUBSCRIPTION_STATUS),
        required: true,
      },
      joinedAt: { type: 'string', required: true },
      expiresAt: { type: 'string' },
    },
    indexes: {
      primary: {
        pk: { field: 'pk', composite: ['userId'], template: 'USER#${userId}' },
        sk: { field: 'sk', composite: ['oshiId'], template: 'OSHI#${oshiId}' },
      },
    },
  },
  { client: dynamoClient, table: TABLE_NAME },
);

export namespace UserOshiDb {
  export const entity = _entity;
  export type Item = EntityItem<typeof _entity>;

  export function toDomain(record: Item): UserOshi {
    return {
      userId: UserId.from(record.userId),
      oshiId: OshiId.from(record.oshiId),
      order: record.order,
      subscriptionStatus: SubscriptionStatus.schema.parse(record.subscriptionStatus),
      joinedAt: UtcIsoString.from(record.joinedAt),
      expiresAt: record.expiresAt ? UtcIsoString.from(record.expiresAt) : null,
    };
  }
}
