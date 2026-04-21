import type { Post } from '@oshilock/shared';
import { OshiId, POST_STATUS, PostId, UserId, UtcIsoString } from '@oshilock/shared';
import { Entity, type EntityItem } from 'electrodb';
import { dynamoClient, TABLE_NAME } from '../client.js';

const _entity = new Entity(
  {
    model: {
      entity: 'Post',
      version: '1',
      service: 'oshilock',
    },
    attributes: {
      postId: { type: 'string', required: true },
      oshiId: { type: 'string', required: true },
      userId: { type: 'string', required: true },
      body: { type: 'string', required: true },
      sourceUrls: { type: 'list', items: { type: 'string' }, required: true },
      status: {
        type: Object.values(POST_STATUS),
        required: true,
        default: POST_STATUS.PENDING,
      },
      createdAt: { type: 'string', required: true },
    },
    indexes: {
      primary: {
        pk: { field: 'pk', composite: ['oshiId'], template: 'OSHI#${oshiId}' },
        sk: { field: 'sk', composite: ['postId'], template: 'POST#${postId}' },
      },
      byUser: {
        index: 'GSI1',
        pk: {
          field: 'gsi1pk',
          composite: ['userId'],
          template: 'USER#${userId}',
        },
        sk: {
          field: 'gsi1sk',
          composite: ['createdAt'],
          template: 'POST#${createdAt}',
        },
      },
    },
  },
  { client: dynamoClient, table: TABLE_NAME },
);

export namespace PostDb {
  export const entity = _entity;
  export type Item = EntityItem<typeof _entity>;

  export function toDomain(record: Item): Post {
    return {
      id: PostId.from(record.postId),
      oshiId: OshiId.from(record.oshiId),
      userId: UserId.from(record.userId),
      body: record.body,
      sourceUrls: record.sourceUrls,
      status: record.status,
      createdAt: UtcIsoString.from(record.createdAt),
    };
  }
}
