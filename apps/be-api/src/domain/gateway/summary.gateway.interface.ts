import type { OshiId } from '@oshilock/shared';

export interface ISummaryGateway {
  getToonSummary(oshiId: OshiId): Promise<string | null>;
  putToonSummary(oshiId: OshiId, toon: string): Promise<void>;
}
