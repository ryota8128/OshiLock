import { Type, type Schema } from '@google/genai';
import { MATCH_TYPE } from '@oshilock/shared';

export const duplicateCheckResponseSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    matchType: {
      type: Type.STRING,
      enum: Object.values(MATCH_TYPE),
      description: 'NEW: 新規, DUPLICATE: 同一情報, UPDATE: 追加情報あり',
    },
    matchedEventId: {
      type: Type.STRING,
      nullable: true,
      description: '一致する既存イベントの ID。NEW の場合は null',
    },
  },
  required: ['matchType', 'matchedEventId'],
} as const;
