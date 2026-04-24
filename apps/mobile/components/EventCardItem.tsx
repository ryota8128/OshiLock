import { View, Text, StyleSheet, Pressable } from 'react-native';
import { colors, categoryColors, radii, typography } from '@/constants/theme';
import type { EventInfo, EventCategory } from '@oshilock/shared';
import type { DateString, TimeString } from '@oshilock/shared';
import { MessageCircle, Bookmark, Trophy } from 'lucide-react-native';

function formatCountdown(startDate: DateString | null): { text: string; isToday: boolean } | null {
  if (!startDate) return null;
  const today = new Date().toISOString().slice(0, 10);
  if (startDate < today) return null;
  if (startDate === today) return { text: '今日', isToday: true };
  const diffMs = new Date(startDate).getTime() - new Date(today).getTime();
  const days = Math.round(diffMs / (24 * 60 * 60 * 1000));
  if (days === 1) return { text: '明日', isToday: false };
  return { text: `あと${days}日`, isToday: false };
}

function formatSchedule(startDate: DateString | null, startTime: TimeString | null): string | null {
  if (!startDate) return null;
  const [, m, d] = startDate.split('-');
  if (startTime) {
    return `${Number(m)}/${Number(d)} ${startTime}`;
  }
  return `${Number(m)}/${Number(d)}`;
}

type Props = {
  card: EventInfo;
  posterNames?: Record<string, string>;
  onPress?: () => void;
};

const catKey = (cat: EventCategory): keyof typeof categoryColors => {
  switch (cat) {
    case 'EVENT':
      return 'event';
    case 'MEDIA':
      return 'media';
    case 'SNS':
      return 'sns';
    case 'NEWS':
      return 'news';
    default:
      return 'news';
  }
};

export function EventCardItem({ card, posterNames, onPress }: Props) {
  const c = categoryColors[catKey(card.category)];
  const countdown = formatCountdown(card.schedule.startDate);
  const fastestId = card.fastestPosterIds[0];
  const fastestName = (fastestId && posterNames?.[fastestId]) || null;

  return (
    <Pressable onPress={onPress} style={styles.wrapper}>
      {/* isRead は EventInfoWithUserContext 固有のため、EventInfo では未読ドットは非表示 */}

      <View style={[styles.band, { backgroundColor: c.bg, borderBottomColor: c.line }]}>
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
        {formatSchedule(card.schedule.startDate, card.schedule.startTime) && (
          <Text style={styles.date}>
            {formatSchedule(card.schedule.startDate, card.schedule.startTime)}
          </Text>
        )}
        <Text style={styles.contentText} numberOfLines={2}>
          {card.summary}
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
              {/* TODO: saved はユーザーコンテキスト取得後に対応予定。現時点では常に未保存表示 */}
              <Bookmark size={14} color={colors.inkSoft} strokeWidth={1.5} fill="none" />
              <Text style={styles.meta}>{card.savedCount}</Text>
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
    overflow: 'hidden',
    position: 'relative',
  },
  unreadDot: {
    position: 'absolute',
    top: 10,
    left: 5,
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: colors.unreadDot,
    zIndex: 10,
  },
  band: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderBottomWidth: 1,
  },
  catLabel: {
    fontSize: 11,
    fontWeight: '700',
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
    fontWeight: '600',
    color: colors.inkSoft,
  },
  todayText: {
    color: colors.white,
    fontWeight: '700',
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
    borderStyle: 'dashed',
    paddingTop: 10,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  meta: {
    ...typography.meta,
  },
  fastestText: {
    fontSize: 10,
    fontWeight: '600',
    color: colors.medalGold,
  },
  metaRight: {
    flexDirection: 'row',
    gap: 14,
    marginLeft: 'auto',
  },
  savedMeta: {
    color: colors.watchedRose,
    fontWeight: '600',
  },
});
