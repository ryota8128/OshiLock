import { categoryColors, colors, typography } from "@/constants/theme";
import { MOCK_CARDS, MOCK_COMMENTS, MOCK_POSTER_NAMES } from "@/data/mock";
import type { EventCategory } from "@oshilock/shared";
import { TIMEZONES, UtcIsoString } from "@oshilock/shared";
import { router, useLocalSearchParams } from "expo-router";
import {
  BellOff,
  Bookmark,
  ChevronLeft,
  ExternalLink,
  Flag,
  Heart,
  Link2,
  MoreHorizontal,
  Share as ShareIcon,
  Trophy,
} from "lucide-react-native";
import { useState } from "react";
import {
  Pressable,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  View,
} from "react-native";
import * as WebBrowser from "expo-web-browser";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const catKey = (cat: EventCategory): keyof typeof categoryColors => {
  switch (cat) {
    case "EVENT":
      return "event";
    case "MEDIA":
      return "media";
    case "SNS":
      return "sns";
    case "NEWS":
      return "news";
    default:
      return "news";
  }
};

function formatDateTime(datetime: string): string {
  const utc = UtcIsoString.from(datetime);
  const date = UtcIsoString.toDateString(utc, TIMEZONES.ASIA_TOKYO);
  const time = UtcIsoString.toTimeString(utc, TIMEZONES.ASIA_TOKYO);
  const [y, m, d] = date.split("-");
  return `${y}/${Number(m)}/${Number(d)} ${time}`;
}

export default function EventDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const [menuOpen, setMenuOpen] = useState(false);

  const card = MOCK_CARDS.find((c) => c.id === id);
  if (!card) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <Text>カードが見つかりません</Text>
      </View>
    );
  }

  const c = categoryColors[catKey(card.category)];
  const comments = MOCK_COMMENTS.filter((cm) => cm.eventId === card.id);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Nav bar */}
      <View style={styles.navBar}>
        <Pressable onPress={() => router.back()} style={styles.navButton}>
          <ChevronLeft size={22} color={colors.ink} strokeWidth={1.5} />
        </Pressable>
        <View style={styles.navRight}>
          <Pressable
            style={styles.navCircle}
            onPress={() => {
              const dateStr = card.schedule.datetime
                ? `\n${formatDateTime(card.schedule.datetime)}`
                : "";
              Share.share({ message: `${card.title}${dateStr}` });
            }}
          >
            <ShareIcon size={15} color={colors.ink} strokeWidth={1.5} />
          </Pressable>
          <Pressable
            style={[styles.navCircle, menuOpen && styles.navCircleActive]}
            onPress={() => setMenuOpen(!menuOpen)}
          >
            <MoreHorizontal size={16} color={colors.ink} strokeWidth={1.5} />
          </Pressable>
        </View>
      </View>

      {/* Context menu */}
      {menuOpen && (
        <View style={styles.contextMenu}>
          {[
            { icon: Link2, label: "リンクをコピー", danger: false },
            { icon: BellOff, label: "通知をオフ", danger: false },
            { icon: Flag, label: "この情報を通報", danger: true },
          ].map((item, i, arr) => (
            <Pressable
              key={i}
              style={[
                styles.menuItem,
                i < arr.length - 1 && styles.menuItemBorder,
              ]}
              onPress={() => setMenuOpen(false)}
            >
              <item.icon
                size={14}
                color={item.danger ? colors.unreadDot : colors.ink}
                strokeWidth={1.5}
              />
              <Text
                style={[styles.menuText, item.danger && styles.menuTextDanger]}
              >
                {item.label}
              </Text>
            </Pressable>
          ))}
        </View>
      )}

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Category + reliability badges */}
        <View style={styles.badgeRow}>
          <View
            style={[
              styles.catBadge,
              { backgroundColor: c.bg, borderColor: c.line },
            ]}
          >
            <Text style={[styles.catBadgeText, { color: c.fg }]}>
              {c.label}
            </Text>
          </View>
          {card.sourceReliability === "OFFICIAL" && (
            <View style={styles.officialBadge}>
              <Text style={styles.officialText}>◎ 公式確認済</Text>
            </View>
          )}
        </View>

        {/* Title */}
        <Text style={styles.title}>{card.title}</Text>

        {/* Check button */}
        <Pressable style={styles.checkButton}>
          <Bookmark
            size={16}
            color={colors.watchedRose}
            strokeWidth={1.8}
            fill={card.checked ? colors.watchedRose : "none"}
          />
          <Text style={styles.checkButtonText}>チェックする</Text>
          <Text style={styles.checkCount}>{card.favoriteCount}</Text>
        </Pressable>
        <Text style={styles.checkHint}>
          最適なタイミング（前日 / 終了1時間前など）に通知されます
        </Text>

        {/* Key/Value info */}
        {card.schedule.datetime && (
          <>
            <Text style={styles.sectionLabel}>日時</Text>
            <View style={styles.infoCard}>
              <Text style={styles.infoValue}>
                {formatDateTime(card.schedule.datetime)}
              </Text>
            </View>
          </>
        )}

        {/* Body */}
        <Text style={styles.sectionLabel}>詳細</Text>
        <View style={styles.bodyCard}>
          <Text style={styles.bodyText}>{card.content}</Text>
        </View>

        {/* Source */}
        {card.sourceUrls.length > 0 && (
          <>
            <Text style={styles.sectionLabel}>ソース</Text>
            <View style={styles.sourceCard}>
              {card.sourceUrls.map((url, i) => (
                <Pressable
                  key={i}
                  style={styles.sourceRow}
                  onPress={() => WebBrowser.openBrowserAsync(url)}
                >
                  <Text style={styles.sourceUrl} numberOfLines={1}>
                    {url.replace(/^https?:\/\//, "")}
                  </Text>
                  <ExternalLink
                    size={11}
                    color={colors.inkSoft}
                    strokeWidth={1.5}
                  />
                </Pressable>
              ))}
            </View>
          </>
        )}

        {/* Fastest TOP3 */}
        {card.fastestPosterIds.some((uid) => uid !== null) && (
          <>
            <Text style={styles.sectionLabel}>
              最速投稿 · TOP{card.fastestPosterIds.filter(Boolean).length}
            </Text>
            <View style={styles.top3Card}>
              {card.fastestPosterIds.map((uid, i) => {
                if (!uid) return null;
                const name = MOCK_POSTER_NAMES[uid] || uid;
                const isLast = card.fastestPosterIds
                  .slice(i + 1)
                  .every((u) => u === null);
                return (
                  <View
                    key={i}
                    style={[styles.top3Row, !isLast && styles.top3RowBorder]}
                  >
                    <Trophy
                      size={16}
                      color={
                        i === 0
                          ? colors.medalGold
                          : i === 1
                            ? colors.medalSilver
                            : colors.medalBronze
                      }
                      strokeWidth={1.5}
                    />
                    <View style={styles.top3Avatar}>
                      <Text style={styles.top3AvatarText}>{name[0]}</Text>
                    </View>
                    <Text style={styles.top3Name}>{name}</Text>
                  </View>
                );
              })}
            </View>
          </>
        )}

        {/* Comments */}
        <Text style={styles.sectionLabel}>コメント · {card.commentCount}</Text>
        <View style={styles.commentList}>
          {comments.map((cm) => {
            const name = MOCK_POSTER_NAMES[cm.userId] || cm.userId;
            return (
              <View key={cm.id} style={styles.commentRow}>
                <View style={styles.commentAvatar}>
                  <Text style={styles.commentAvatarText}>{name[0]}</Text>
                </View>
                <View style={styles.commentBubble}>
                  <Text style={styles.commentAuthor}>@{name}</Text>
                  <Text style={styles.commentBody}>{cm.body}</Text>
                  <View style={styles.commentMeta}>
                    <Heart size={11} color={colors.inkSoft} strokeWidth={1.5} />
                    <Text style={styles.commentMetaText}>
                      {cm.likeCount} · 返信
                    </Text>
                  </View>
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.paper },
  navBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  navButton: { padding: 4 },
  navRight: { flexDirection: "row", gap: 14 },
  navCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "rgba(43,42,40,0.05)",
    justifyContent: "center",
    alignItems: "center",
  },
  navCircleActive: { backgroundColor: "rgba(43,42,40,0.1)" },
  contextMenu: {
    position: "absolute",
    top: 100,
    right: 16,
    width: 200,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    zIndex: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 24,
    elevation: 8,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 11,
    paddingHorizontal: 14,
  },
  menuItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: "rgba(43,42,40,0.06)",
  },
  menuText: { fontSize: 13, color: colors.ink },
  menuTextDanger: { color: colors.unreadDot, fontWeight: "600" },
  scrollContent: { paddingHorizontal: 16, paddingBottom: 40 },
  badgeRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 12,
    flexWrap: "wrap",
  },
  catBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 999,
    borderWidth: 1,
  },
  catBadgeText: { fontSize: 10, fontWeight: "700" },
  officialBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingVertical: 4,
    paddingHorizontal: 9,
    borderRadius: 999,
    backgroundColor: colors.officialGreenBg,
    borderWidth: 1,
    borderColor: colors.officialGreenBorder,
  },
  officialText: {
    fontSize: 10,
    fontWeight: "600",
    color: colors.officialGreen,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.ink,
    lineHeight: 27,
    marginBottom: 14,
    letterSpacing: -0.4,
  },
  sectionLabel: {
    ...typography.label,
    textTransform: "uppercase",
    marginBottom: 8,
    marginTop: 20,
  },
  checkButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    padding: 13,
    backgroundColor: colors.watchedRoseBg,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.watchedRoseBorder,
    marginBottom: 6,
  },
  checkButtonText: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.watchedRose,
  },
  checkCount: {
    fontSize: 11,
    fontWeight: "500",
    color: colors.watchedRose,
    opacity: 0.7,
  },
  checkHint: { fontSize: 10, color: colors.inkSoft, textAlign: "center" },
  infoCard: {
    backgroundColor: colors.white,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  infoValue: { fontSize: 12, color: colors.ink },
  bodyCard: {
    backgroundColor: colors.white,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 14,
  },
  bodyText: { fontSize: 12, color: colors.ink, lineHeight: 20 },
  sourceCard: {
    backgroundColor: colors.white,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: "hidden",
  },
  sourceRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  sourceUrl: { fontSize: 11, color: colors.inkSoft, flex: 1 },
  top3Card: {
    backgroundColor: colors.white,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: "hidden",
  },
  top3Row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  top3RowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  top3Avatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#E8DDC6",
    justifyContent: "center",
    alignItems: "center",
  },
  top3AvatarText: { fontSize: 10, fontWeight: "600", color: colors.ink },
  top3Name: { fontSize: 12, color: colors.ink, flex: 1 },
  commentList: { gap: 10 },
  commentRow: { flexDirection: "row", gap: 10, alignItems: "flex-start" },
  commentAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#E8DDC6",
    justifyContent: "center",
    alignItems: "center",
  },
  commentAvatarText: { fontSize: 11, fontWeight: "600", color: colors.ink },
  commentBubble: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  commentAuthor: {
    fontSize: 11,
    fontWeight: "600",
    color: colors.ink,
    marginBottom: 2,
  },
  commentBody: { fontSize: 12, color: colors.ink, lineHeight: 17 },
  commentMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 4,
  },
  commentMetaText: { fontSize: 10, color: colors.inkSoft },
});
