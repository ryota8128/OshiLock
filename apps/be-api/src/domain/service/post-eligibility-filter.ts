import type { UtcIsoString } from '@oshilock/shared';

const MAX_PAST_MS = 30 * 24 * 60 * 60 * 1000;

type EligibilityInput = {
  sortDate: UtcIsoString;
};

export class PostEligibilityFilter {
  shouldProcess(input: EligibilityInput): boolean {
    return this.isValidDate(input.sortDate);
  }

  filterToonEntries<T extends { sortDate: UtcIsoString }>(entries: T[]): T[] {
    return entries.filter((entry) => this.isValidDate(entry.sortDate));
  }

  private isValidDate(sortDate: UtcIsoString): boolean {
    const cutoff = new Date(Date.now() - MAX_PAST_MS).toISOString();
    return sortDate >= cutoff;
  }
}
