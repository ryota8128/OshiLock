export const TIMEZONES = {
  ASIA_TOKYO: {
    iana: "Asia/Tokyo",
    offset: 9 * 60 * 60 * 1000,
  },
} as const;

export type Timezone = (typeof TIMEZONES)[keyof typeof TIMEZONES];
