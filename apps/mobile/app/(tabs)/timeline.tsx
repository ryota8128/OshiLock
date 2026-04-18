import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, spacing, typography, radii } from '@/constants/theme';
import { EventCardItem } from '@/components/EventCardItem';
import { MOCK_CARDS, MOCK_OSHI, MOCK_POSTER_NAMES } from '@/data/mock';
import type { EventCategory } from '@oshilock/shared';

const FILTERS = [
  { key: 'all', label: 'すべて' },
  { key: 'unread', label: '未読' },
  { key: 'EVENT', label: 'イベント' },
  { key: 'MEDIA', label: 'メディア' },
  { key: 'SNS', label: 'SNS' },
  { key: 'NEWS', label: 'ニュース' },
] as const;

type FilterKey = typeof FILTERS[number]['key'];

export default function TimelineScreen() {
  const insets = useSafeAreaInsets();
  const [activeTab] = useState(MOCK_OSHI.name);
  const [activeFilter, setActiveFilter] = useState<FilterKey>('all');

  const filteredCards = MOCK_CARDS.filter(card => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'unread') return !card.isRead;
    return card.category === activeFilter;
  });

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Tab bar (group switcher) */}
      <View style={styles.tabRow}>
        <Pressable style={[styles.tab, styles.tabActive]}>
          <Text style={[styles.tabText, styles.tabTextActive]}>{MOCK_OSHI.name}</Text>
        </Pressable>
        <Pressable style={styles.tab}>
          <Text style={styles.tabText}>全て</Text>
        </Pressable>
      </View>
      <View style={styles.tabDivider} />

      {/* Filter pills */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterRow} contentContainerStyle={styles.filterContent}>
        {FILTERS.map(f => (
          <Pressable
            key={f.key}
            style={[styles.filterPill, activeFilter === f.key && styles.filterPillActive]}
            onPress={() => setActiveFilter(f.key)}
          >
            <Text style={[styles.filterText, activeFilter === f.key && styles.filterTextActive]}>
              {f.label}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      {/* Card list */}
      <ScrollView style={styles.cardScroll} contentContainerStyle={styles.cardContent}>
        {filteredCards.map(card => (
          <EventCardItem key={card.id} card={card} posterNames={MOCK_POSTER_NAMES} />
        ))}
        {filteredCards.length === 0 && (
          <Text style={styles.emptyText}>カードがありません</Text>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.paper },
  tabRow: { flexDirection: 'row', paddingHorizontal: spacing.lg, paddingTop: 8, gap: 20 },
  tab: { paddingVertical: 6, paddingBottom: 10 },
  tabActive: { borderBottomWidth: 2, borderBottomColor: colors.ink },
  tabText: { fontSize: 13, color: colors.inkSoft },
  tabTextActive: { fontWeight: '600', color: colors.ink },
  tabDivider: { height: 1, backgroundColor: colors.borderLight },
  filterRow: { maxHeight: 44 },
  filterContent: { flexDirection: 'row', paddingHorizontal: spacing.lg, paddingVertical: 8, gap: 6 },
  filterPill: {
    paddingHorizontal: 12, paddingVertical: 5, borderRadius: radii.pill,
    borderWidth: 1, borderColor: colors.borderStrong,
  },
  filterPillActive: { backgroundColor: colors.ink, borderColor: colors.ink },
  filterText: { fontSize: 12, color: colors.ink },
  filterTextActive: { color: colors.white, fontWeight: '600' },
  cardScroll: { flex: 1 },
  cardContent: { paddingHorizontal: spacing.lg, paddingTop: 8, paddingBottom: spacing.tabBarPadding, gap: spacing.cardGap },
  emptyText: { ...typography.caption, textAlign: 'center', marginTop: 40 },
});
