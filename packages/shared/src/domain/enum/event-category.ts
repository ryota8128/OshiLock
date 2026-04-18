export const EVENT_CATEGORY = {
  EVENT: "EVENT",
  GOODS: "GOODS",
  MEDIA: "MEDIA",
  SNS: "SNS",
  NEWS: "NEWS",
} as const;

export type EventCategory =
  (typeof EVENT_CATEGORY)[keyof typeof EVENT_CATEGORY];
