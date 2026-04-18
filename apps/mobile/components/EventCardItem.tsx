import { View, Text, StyleSheet, Pressable } from "react-native";
import {
  colors,
  categoryColors,
  radii,
  typography,
} from "@/constants/theme";
import { UtcIsoString, TIMEZONES } from "@oshilock/shared";
import type { EventInfoWithUserContext, EventCategory } from "@oshilock/shared";
import { MessageCircle, Bookmark, Trophy } from "lucide-react-native";

function formatCountdown(
  datetime: string | null,
): { text: string; isToday: boolean } | null {
  if (!datetime) return null;
  const target = UtcIsoString.toDateString(
    UtcIsoString.from(datetime),
    TIMEZONES.ASIA_TOKYO,
  );
  const today = UtcIsoString.toDateString(
    UtcIsoString.now(),
    TIMEZONES.ASIA_TOKYO,
  );
  if (target < today) return null;
  if (target === today) return { text: "今日", isToday: true };
  const diffMs = new Date(target).getTime() - new Date(today).getTime();
  const days = Math.round(diffMs / (24 * 60 * 60 * 1000));
  if (days === 1) return { text: "明日", isToday: false };
  return { text: `あと${days}日`, isToday: false };
}

function formatSchedule(
  schedule: EventInfoWithUserContext["schedule"],
): string | null {
  if (!schedule.datetime) return null;
  const utc = UtcIsoString.from(schedule.datetime);
  const date = UtcIsoString.toDateString(utc, TIMEZONES.ASIA_TOKYO);
  const [, m, d] = date.split("-");
  if (schedule.hasTime) {
    const time = UtcIsoString.toTimeString(utc, TIMEZONES.ASIA_TOKYO);
    return `${Number(m)}/${Number(d)} ${time}`;
  }
  return `${Number(m)}/${Number(d)}`;
}

type Props = {
  card: EventInfoWithUserContext;
  posterNames?: Record<string, string>;
  onPress?: () => void;
};

const catKey = (cat: EventCategory): keyof typeof categoryColors => {
  switch (cat) {
    case "EVENT": return "event";
    case "MEDIA": return "media";
    case "SNS": return "sns";
    case "NEWS": return "news";
    default: return "news";
  }
};

export function EventCardItem({ card, posterNames, onPress }: Props) {
  const c = categoryColors[catKey(card.category)];
  const countdown = formatCountdown(card.schedule.datetime);
  const fastestId = card.fastestPosterIds[0];
  const fastestName = fastestId && posterNames?.[fastestId] || null;

  return (
    <Pressable onPress={onPress} style={styles.wrapper}>
      {!card.isRead && <View style={styles.unreadDot} />}

      <View
        style={[styles.band, { backgroundColor: c.bg, borderBottomColor: c.line }]}
      >
        <Text style={[styles.catLabel, { color: c.fg }]}>{c.label}</Text>
        {countdown && (
          <View style={[styles.countdownBadge, countdown.isToday && styles.todayBadge]}>
            <Text style={[styles.countdownText, countdown.isToday && styles.todayText]}>
              {countdown.text}
            </Text>
          </View>
        )}
      </View>

      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2}>
          {card.title}
        </Text>
        {formatSchedule(card.schedule) && (
          <Text style={styles.date}>{formatSchedule(card.schedule)}</Text>
        )}
        <Text style={styles.contentText} numberOfLines={2}>
          {card.content}
        </Text>

        <View style={styles.metaRow}>
          {fastestName && (
            <View style={styles.metaItem}>
              <Trophy size={13} color={colors.medalGold} strokeWidth={1.8} />
              <Text style={styles.fastestText}>{fastestName}</Text>
            </View>
          )}
          <View style={styles.metaRight}>
            <View style={styles.metaItem}>
              <MessageCircle size={14} color={colors.inkSoft} strokeWidth={1.5} />
              <Text style={styles.meta}>{card.commentCount}</Text>
            </View>
            <View style={styles.metaItem}>
              <Bookmark
                size={14}
                color={card.checked ? colors.watchedRose : colors.inkSoft}
                strokeWidth={1.5}
                fill={card.checked ? colors.watchedRose : "none"}
              />
              <Text style={[styles.meta, card.checked && styles.checkedMeta]}>
                {card.favoriteCount}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: colors.white,
    borderRadius: radii.card,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: "hidden",
    position: "relative",
  },
  unreadDot: {
    position: "absolute",
    top: 10,
    left: 5,
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: colors.unreadDot,
    zIndex: 10,
  },
  band: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderBottomWidth: 1,
  },
  catLabel: {
    fontSize: 11,
    fontWeight: "700",
  },
  countdownBadge: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: radii.badge,
  },
  todayBadge: {
    backgroundColor: colors.urgentBg,
  },
  countdownText: {
    fontSize: 10,
    fontWeight: "600",
    color: colors.inkSoft,
  },
  todayText: {
    color: colors.white,
    fontWeight: "700",
  },
  content: {
    padding: 14,
    paddingTop: 12,
  },
  title: {
    ...typography.title,
    marginBottom: 4,
  },
  date: {
    ...typography.caption,
    marginBottom: 6,
  },
  contentText: {
    fontSize: 12,
    color: colors.inkSoft,
    lineHeight: 18,
    marginBottom: 10,
  },
  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
    borderStyle: "dashed",
    paddingTop: 10,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  meta: {
    ...typography.meta,
  },
  fastestText: {
    fontSize: 10,
    fontWeight: "600",
    color: colors.medalGold,
  },
  metaRight: {
    flexDirection: "row",
    gap: 14,
    marginLeft: "auto",
  },
  checkedMeta: {
    color: colors.watchedRose,
    fontWeight: "600",
  },
});
