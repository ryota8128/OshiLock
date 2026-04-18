export const REPORT_CATEGORY = {
  FAKE_INFO: "FAKE_INFO", // 虚偽情報
  SPAM: "SPAM", // スパム
  INAPPROPRIATE: "INAPPROPRIATE", // 不適切なコンテンツ
  HARASSMENT: "HARASSMENT", // 嫌がらせ
} as const;

export type ReportCategory =
  (typeof REPORT_CATEGORY)[keyof typeof REPORT_CATEGORY];
