import { Entity, type EntityItem } from 'electrodb';
import {
  AUTH_PROVIDER,
  USER_RANK,
  UserId,
  AuthProvider,
  UserRank,
  UtcIsoString,
} from '@oshilock/shared';
import type { User } from '@oshilock/shared';
import { dynamoClient, TABLE_NAME } from '../client.js';

const _entity = new Entity(
  {
    model: {
      entity: 'User',
      version: '1',
      service: 'oshilock',
    },
    attributes: {
      userId: { type: 'string', required: true },
      authProvider: { type: Object.values(AUTH_PROVIDER), required: true },
      authSub: { type: 'string', required: true },
      displayName: { type: 'string', required: true },
      avatarPath: { type: 'string' },
      rank: {
        type: Object.values(USER_RANK),
        required: true,
      },
      createdAt: { type: 'string', required: true },
      updatedAt: { type: 'string', required: true },
    },
    indexes: {
      primary: {
        pk: { field: 'pk', composite: ['userId'], template: 'USER#${userId}' },
        sk: { field: 'sk', composite: [], template: 'PROFILE' },
      },
      byAuth: {
        index: 'GSI1',
        pk: {
          field: 'gsi1pk',
          composite: ['authProvider', 'authSub'],
          template: 'AUTH#${authProvider}#${authSub}',
        },
        sk: {
          field: 'gsi1sk',
          composite: [],
          template: 'USER',
        },
      },
    },
  },
  { client: dynamoClient, table: TABLE_NAME },
);

export namespace UserDb {
  export const entity = _entity;
  export type Item = EntityItem<typeof _entity>;

  export function toDomain(record: Item): User {
    return {
      id: UserId.from(record.userId),
      authProvider: AuthProvider.schema.parse(record.authProvider),
      authSub: record.authSub,
      displayName: record.displayName,
      avatarPath: record.avatarPath ?? null,
      rank: UserRank.schema.parse(record.rank),
      createdAt: UtcIsoString.from(record.createdAt),
      updatedAt: UtcIsoString.from(record.updatedAt),
    };
  }
}
