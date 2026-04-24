import type { EventInfo, OshiId } from '@oshilock/shared';
import type { ISummaryGateway } from '../../../domain/gateway/summary.gateway.interface.js';
import type { PostEligibilityFilter } from '../../../domain/service/post-eligibility-filter.js';
import type { ToonBuilder } from './toon-builder.js';

export class ToonService {
  constructor(
    private readonly summaryGateway: ISummaryGateway,
    private readonly eligibilityFilter: PostEligibilityFilter,
    private readonly toonBuilder: ToonBuilder,
  ) {}

  async getFilteredToon(oshiId: OshiId): Promise<{ rawToon: string; filteredToon: string }> {
    const rawToon = (await this.summaryGateway.getToonSummary(oshiId)) ?? '';
    const entries = this.toonBuilder.parseToon(rawToon);
    const filtered = this.eligibilityFilter.filterToonEntries(entries);
    const filteredToon = this.toonBuilder.entriesToToonForLlm(filtered);
    return { rawToon, filteredToon };
  }

  async updateToon(oshiId: OshiId, rawToon: string, event: EventInfo): Promise<void> {
    const entry = this.toonBuilder.eventInfoToEntry(event);
    const updatedToon = this.toonBuilder.addOrUpdateEntry(rawToon, entry);
    await this.summaryGateway.putToonSummary(oshiId, updatedToon);
  }
}
