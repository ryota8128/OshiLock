import { Entity, type EntityItem } from 'electrodb';
import { PLATFORM, UserId, Platform, UtcIsoString } from '@oshilock/shared';
import type { UserPushToken } from '@oshilock/shared';
import { dynamoClient, TABLE_NAME } from '../client.js';

const _entity = new Entity(
  {
    model: {
      entity: 'UserPushToken',
      version: '1',
      service: 'oshilock',
    },
    attributes: {
      userId: { type: 'string', required: true },
      token: { type: 'string', required: true },
      platform: { type: Object.values(PLATFORM), required: true },
      createdAt: { type: 'string', required: true },
    },
    indexes: {
      primary: {
        pk: { field: 'pk', composite: ['userId'], template: 'USER#${userId}' },
        sk: {
          field: 'sk',
          composite: ['token'],
          template: 'PUSH_TOKEN#${token}',
        },
      },
    },
  },
  { client: dynamoClient, table: TABLE_NAME },
);

export namespace UserPushTokenDb {
  export const entity = _entity;
  export type Item = EntityItem<typeof _entity>;

  export function toDomain(record: Item): UserPushToken {
    return {
      userId: UserId.from(record.userId),
      token: record.token,
      platform: Platform.schema.parse(record.platform),
      createdAt: UtcIsoString.from(record.createdAt),
    };
  }
}
