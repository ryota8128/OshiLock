import { DateString, TIMEZONES } from '@oshilock/shared';

const MAX_PAST_DAYS = 30;

type EligibilityInput = {
  sortDate: DateString;
};

export class PostEligibilityFilter {
  shouldProcess(input: EligibilityInput): boolean {
    return this.isValidDate(input.sortDate);
  }

  filterToonEntries<T extends { sortDate: DateString }>(entries: T[]): T[] {
    return entries.filter((entry) => this.isValidDate(entry.sortDate));
  }

  private isValidDate(date: DateString): boolean {
    const cutoff = DateString.addDays(DateString.now(TIMEZONES.ASIA_TOKYO), -MAX_PAST_DAYS);
    return !DateString.isBefore(date, cutoff);
  }
}
