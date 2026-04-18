import { View, Text, StyleSheet, Pressable } from "react-native";
import {
  colors,
  categoryColors,
  spacing,
  radii,
  typography,
} from "@/constants/theme";
import { UtcIsoString, TIMEZONES } from "@oshilock/shared";
import type { EventInfoWithUserContext, EventCategory } from "@oshilock/shared";

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
  onPress?: () => void;
};

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

export function EventCardItem({ card, onPress }: Props) {
  const c = categoryColors[catKey(card.category)];
  const countdown = formatCountdown(card.schedule.datetime as string | null);

  return (
    <Pressable onPress={onPress} style={styles.wrapper}>
      {!card.isRead && <View style={styles.unreadDot} />}

      <View
        style={[
          styles.band,
          { backgroundColor: c.bg, borderBottomColor: c.line },
        ]}
      >
        <Text style={[styles.catLabel, { color: c.fg }]}>{c.label}</Text>
        {countdown && (
          <View
            style={[
              styles.countdownBadge,
              countdown.isToday && styles.todayBadge,
            ]}
          >
            <Text
              style={[
                styles.countdownText,
                countdown.isToday && styles.todayText,
              ]}
            >
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
          {card.fastestPosterIds[0] && <Text style={styles.meta}>🥇 最速</Text>}
          <View style={styles.metaRight}>
            <Text style={styles.meta}>💬 {card.commentCount}</Text>
            <Text style={[styles.meta, card.checked && styles.checkedMeta]}>
              ☆ {card.favoriteCount}
            </Text>
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
  meta: {
    ...typography.meta,
  },
  metaRight: {
    flexDirection: "row",
    gap: 12,
  },
  checkedMeta: {
    color: colors.watchedRose,
    fontWeight: "600",
  },
});
