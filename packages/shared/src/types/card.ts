export type CardCategory = "event" | "goods" | "media" | "sns" | "news";

export type SourceReliability = "official" | "sourced" | "unverified";

export type Card = {
  id: string;
  groupId: string;
  title: string;
  category: CardCategory;
  datetime: string | null;
  deadline: string | null;
  sourceReliability: SourceReliability;
  sourceUrls: string[];
  firstPosterId: string | null;
  commentCount: number;
  favoriteCount: number;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
};
