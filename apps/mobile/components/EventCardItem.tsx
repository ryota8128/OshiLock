import { View, Text, StyleSheet, Pressable } from 'react-native';
import { colors, categoryColors, spacing, radii, typography } from '@/constants/theme';
import type { EventCategory } from '@oshilock/shared';

type CardData = {
  id: string;
  title: string;
  category: EventCategory;
  countdown?: string;
  commentCount: number;
  favoriteCount: number;
  unread: boolean;
  watched: boolean;
  urgent: boolean;
  source?: string;
  fastest?: string;
};

type Props = {
  card: CardData;
  onPress?: () => void;
};

const catKey = (cat: EventCategory): keyof typeof categoryColors => {
  switch (cat) {
    case 'EVENT': return 'event';
    case 'MEDIA': return 'media';
    case 'SNS': return 'sns';
    case 'NEWS': return 'news';
    default: return 'news';
  }
};

export function EventCardItem({ card, onPress }: Props) {
  const c = categoryColors[catKey(card.category)];

  return (
    <Pressable onPress={onPress} style={styles.wrapper}>
      {/* Unread dot */}
      {card.unread && <View style={styles.unreadDot} />}

      {/* Category top band */}
      <View style={[styles.band, { backgroundColor: c.bg, borderBottomColor: c.line }]}>
        <Text style={[styles.catLabel, { color: c.fg }]}>{c.label}</Text>
        {card.countdown && (
          <View style={[styles.countdownBadge, card.urgent && styles.urgentBadge]}>
            <Text style={[styles.countdownText, card.urgent && styles.urgentText]}>
              {card.countdown}
            </Text>
          </View>
        )}
      </View>

      {/* Content */}
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2}>{card.title}</Text>

        {/* Meta row */}
        <View style={styles.metaRow}>
          {card.fastest && (
            <Text style={styles.meta}>🥇 {card.fastest}</Text>
          )}
          <View style={styles.metaRight}>
            <Text style={styles.meta}>💬 {card.commentCount}</Text>
            <Text style={[styles.meta, card.watched && styles.watchedMeta]}>
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
  urgentBadge: {
    backgroundColor: colors.urgentBg,
  },
  countdownText: {
    fontSize: 10,
    fontWeight: '600',
    color: colors.inkSoft,
  },
  urgentText: {
    color: colors.white,
    fontWeight: '700',
  },
  content: {
    padding: 14,
    paddingTop: 12,
  },
  title: {
    ...typography.title,
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
  meta: {
    ...typography.meta,
  },
  metaRight: {
    flexDirection: 'row',
    gap: 12,
  },
  watchedMeta: {
    color: colors.watchedRose,
    fontWeight: '600',
  },
});
