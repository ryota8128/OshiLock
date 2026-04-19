import type {
  EventInfoWithUserContext,
  User,
  Oshi,
  Comment,
  Check,
} from "@oshilock/shared";
import type { EventId, OshiId, UserId, CommentId } from "@oshilock/shared";
import { UtcIsoString } from "@oshilock/shared";

const eventId = (s: string) => s as EventId;
const oshiId = (s: string) => s as OshiId;
const userId = (s: string) => s as UserId;
const commentId = (s: string) => s as CommentId;
const utc = (s: string) => UtcIsoString.from(s);

// 今日・明日のUTC日時を動的生成
function todayAt(hour: number, min = 0): string {
  const d = new Date();
  d.setUTCHours(hour, min, 0, 0);
  return d.toISOString();
}
function tomorrowAt(hour: number, min = 0): string {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() + 1);
  d.setUTCHours(hour, min, 0, 0);
  return d.toISOString();
}

export const MOCK_POSTER_NAMES: Record<string, string> = {
  "user-1": "Sakura",
  "user-2": "乃木fan",
  "user-3": "まいやん推し",
  "user-4": "あしゅ担",
  "user-5": "かずみん",
  "user-6": "情報屋さん",
};

export const MOCK_OSHI: Oshi = {
  id: oshiId("oshi-1"),
  name: "乃木坂46",
  iconUrl: null,
  memberCount: 87,
  createdAt: utc("2026-04-01T00:00:00Z"),
  updatedAt: utc("2026-04-01T00:00:00Z"),
};

export const MOCK_USER: User = {
  id: userId("user-1"),
  displayName: "Sakura",
  avatarUrl: null,
  rank: "ACE",
  createdAt: utc("2026-03-01T00:00:00Z"),
  updatedAt: utc("2026-04-18T00:00:00Z"),
};

export const MOCK_CARDS: EventInfoWithUserContext[] = [
  {
    id: eventId("card-today-1"),
    oshiId: oshiId("oshi-1"),
    title: "ラジオ生出演 オールナイトニッポン",
    schedule: { datetime: utc(todayAt(16, 0)), hasTime: true },
    content: "今夜25:00〜放送のオールナイトニッポンに生出演。リスナーからのメッセージ募集中。",
    category: "MEDIA",
    sourceReliability: "OFFICIAL",
    sourceUrls: ["https://example.com/ann"],
    fastestPosterIds: [userId("user-3"), null, null],
    commentCount: 15,
    favoriteCount: 78,
    createdAt: utc("2026-04-18T02:00:00Z"),
    updatedAt: utc("2026-04-18T02:00:00Z"),
    isRead: false,
    checked: true,
  },
  {
    id: eventId("card-tomorrow-1"),
    oshiId: oshiId("oshi-1"),
    title: "握手会 幕張メッセ",
    schedule: { datetime: utc(tomorrowAt(3, 0)), hasTime: true },
    content: "明日12:00〜 幕張メッセにて握手会開催。第3部まであり。",
    category: "EVENT",
    sourceReliability: "OFFICIAL",
    sourceUrls: ["https://example.com/handshake"],
    fastestPosterIds: [userId("user-2"), userId("user-4"), null],
    commentCount: 32,
    favoriteCount: 210,
    createdAt: utc("2026-04-17T10:00:00Z"),
    updatedAt: utc("2026-04-17T10:00:00Z"),
    isRead: false,
    checked: true,
  },
  {
    id: eventId("card-1"),
    oshiId: oshiId("oshi-1"),
    title: "真夏の全国ツアー チケット先行受付",
    schedule: { datetime: utc("2026-07-01T14:59:00Z"), hasTime: true },
    content: "7/20〜8/15の全国ツアーチケット先行受付開始。ファンクラブ会員は本日23:59まで。",
    category: "EVENT",
    sourceReliability: "OFFICIAL",
    sourceUrls: ["https://example.com/ticket"],
    fastestPosterIds: [userId("user-2"), null, null],
    commentCount: 24,
    favoriteCount: 156,
    createdAt: utc("2026-04-17T06:00:00Z"),
    updatedAt: utc("2026-04-17T06:00:00Z"),
    isRead: false,
    checked: true,
  },
  {
    id: eventId("card-2"),
    oshiId: oshiId("oshi-1"),
    title: "Mステ 生出演決定",
    schedule: { datetime: utc("2026-07-05T13:00:00Z"), hasTime: true },
    content: "7/5(金) 22:00〜放送のMステに生出演決定。新曲を初披露予定。",
    category: "MEDIA",
    sourceReliability: "OFFICIAL",
    sourceUrls: ["https://example.com/mst"],
    fastestPosterIds: [userId("user-3"), userId("user-1"), null],
    commentCount: 18,
    favoriteCount: 89,
    createdAt: utc("2026-04-16T12:00:00Z"),
    updatedAt: utc("2026-04-16T12:00:00Z"),
    isRead: false,
    checked: false,
  },
  {
    id: eventId("card-3"),
    oshiId: oshiId("oshi-1"),
    title: "池袋サンシャインシティ ミニライブ",
    schedule: { datetime: utc("2026-07-12T09:00:00Z"), hasTime: true },
    content: "7/12(土) 14:00〜 / 17:00〜 の2回公演。観覧無料、整理券配布あり。",
    category: "EVENT",
    sourceReliability: "SOURCED",
    sourceUrls: [],
    fastestPosterIds: [userId("user-4"), userId("user-5"), userId("user-1")],
    commentCount: 8,
    favoriteCount: 42,
    createdAt: utc("2026-04-15T08:00:00Z"),
    updatedAt: utc("2026-04-15T08:00:00Z"),
    isRead: true,
    checked: false,
  },
  {
    id: eventId("card-4"),
    oshiId: oshiId("oshi-1"),
    title: "公式インスタ オフショット更新",
    schedule: { datetime: null, hasTime: false },
    content: "メンバーのオフショット写真が公式インスタグラムに投稿されました。",
    category: "SNS",
    sourceReliability: "OFFICIAL",
    sourceUrls: ["https://example.com/insta"],
    fastestPosterIds: [userId("user-1"), null, null],
    commentCount: 12,
    favoriteCount: 67,
    createdAt: utc("2026-04-18T03:00:00Z"),
    updatedAt: utc("2026-04-18T03:00:00Z"),
    isRead: false,
    checked: false,
  },
  {
    id: eventId("card-5"),
    oshiId: oshiId("oshi-1"),
    title: "non-no 8月号 表紙決定",
    schedule: { datetime: utc("2026-07-19T15:00:00Z"), hasTime: false },
    content: "non-no 8月号の表紙に決定。7/20発売。",
    category: "MEDIA",
    sourceReliability: "OFFICIAL",
    sourceUrls: ["https://example.com/nonno"],
    fastestPosterIds: [userId("user-6"), null, null],
    commentCount: 6,
    favoriteCount: 38,
    createdAt: utc("2026-04-14T10:00:00Z"),
    updatedAt: utc("2026-04-14T10:00:00Z"),
    isRead: true,
    checked: false,
  },
  {
    id: eventId("card-6"),
    oshiId: oshiId("oshi-1"),
    title: "YouTube 公式チャンネル 200万人突破",
    schedule: { datetime: null, hasTime: false },
    content: "公式YouTubeチャンネルの登録者数が200万人を突破しました。",
    category: "NEWS",
    sourceReliability: "OFFICIAL",
    sourceUrls: ["https://example.com/yt"],
    fastestPosterIds: [null, null, null],
    commentCount: 4,
    favoriteCount: 22,
    createdAt: utc("2026-04-13T14:00:00Z"),
    updatedAt: utc("2026-04-13T14:00:00Z"),
    isRead: true,
    checked: false,
  },
];

export const MOCK_COMMENTS: Comment[] = [
  {
    id: commentId("comment-1"),
    eventId: eventId("card-1"),
    userId: userId("user-2"),
    body: "チケット取れるか不安…でも絶対行く！",
    likeCount: 12,
    createdAt: utc("2026-04-17T08:00:00Z"),
  },
  {
    id: commentId("comment-2"),
    eventId: eventId("card-1"),
    userId: userId("user-3"),
    body: "今回は東京公演狙いです🎫",
    likeCount: 8,
    createdAt: utc("2026-04-17T09:30:00Z"),
  },
  {
    id: commentId("comment-3"),
    eventId: eventId("card-2"),
    userId: userId("user-4"),
    body: "楽しみ！何歌うかな",
    likeCount: 5,
    createdAt: utc("2026-04-16T14:00:00Z"),
  },
];

export const MOCK_CHECKS: Check[] = [
  {
    userId: userId("user-1"),
    eventId: eventId("card-1"),
    createdAt: utc("2026-04-17T07:00:00Z"),
  },
];

export function getUnreadCount(): number {
  return MOCK_CARDS.filter((c) => !c.isRead).length;
}

export function getTotalCardCount(): number {
  return MOCK_CARDS.length;
}

export function getReadCount(): number {
  return MOCK_CARDS.filter((c) => c.isRead).length;
}
