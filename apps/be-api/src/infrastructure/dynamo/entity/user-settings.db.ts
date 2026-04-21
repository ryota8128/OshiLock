import { Entity, type EntityItem } from 'electrodb';
import { UserId } from '@oshilock/shared';
import type { UserSettings } from '@oshilock/shared';
import { dynamoClient, TABLE_NAME } from '../client.js';

const _entity = new Entity(
  {
    model: {
      entity: 'UserSettings',
      version: '1',
      service: 'oshilock',
    },
    attributes: {
      userId: { type: 'string', required: true },
      notificationReminder: { type: 'boolean', required: true, default: true },
      notificationDailySummary: { type: 'boolean', required: true, default: true },
    },
    indexes: {
      primary: {
        pk: { field: 'pk', composite: ['userId'], template: 'USER#${userId}' },
        sk: { field: 'sk', composite: [], template: 'SETTINGS' },
      },
    },
  },
  { client: dynamoClient, table: TABLE_NAME },
);

export namespace UserSettingsDb {
  export const entity = _entity;
  export type Item = EntityItem<typeof _entity>;

  export function toDomain(record: Item): UserSettings {
    return {
      userId: UserId.from(record.userId),
      notification: {
        reminder: record.notificationReminder,
        dailySummary: record.notificationDailySummary,
      },
    };
  }
}
