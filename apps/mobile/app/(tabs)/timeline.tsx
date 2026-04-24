import { useState, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  ActivityIndicator,
  FlatList,
  RefreshControl,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { colors, spacing, typography, radii } from '@/constants/theme';
import { EventCardItem } from '@/components/EventCardItem';
import { useEventInfoList } from '@/hooks/useEventInfoList';
import type { EventCategory, EventInfo } from '@oshilock/shared';

/**
 * 暫定の推しID。
 * TODO: ユーザーの推し設定から取得するよう変更する。
 */
const MOCK_OSHI_ID = 'o_01JTESTMOCKOSHI00000000000';
const MOCK_OSHI_NAME = 'UVERworld';

const FILTERS = [
  { key: 'all', label: 'すべて' },
  { key: 'unread', label: '未読' },
  { key: 'EVENT', label: 'イベント' },
  { key: 'MEDIA', label: 'メディア' },
  { key: 'SNS', label: 'SNS' },
  { key: 'NEWS', label: 'ニュース' },
] as const;

type FilterKey = (typeof FILTERS)[number]['key'];

export default function TimelineScreen() {
  const insets = useSafeAreaInsets();
  const [activeFilter, setActiveFilter] = useState<FilterKey>('all');

  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
    isRefetching,
  } = useEventInfoList(MOCK_OSHI_ID);

  const allItems = useMemo(() => data?.pages.flatMap((page) => page.items) ?? [], [data]);

  const filteredCards = useMemo(
    () =>
      allItems.filter((card) => {
        if (activeFilter === 'all') return true;
        // TODO: unread は EventInfoWithUserContext 取得後に実装予定
        if (activeFilter === 'unread') return true;
        return card.category === (activeFilter as EventCategory);
      }),
    [allItems, activeFilter],
  );

  const handleEndReached = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const renderItem = useCallback(
    ({ item }: { item: EventInfo }) => (
      <EventCardItem
        card={item}
        posterNames={{}}
        onPress={() => router.push(`/event/${item.id}`)}
      />
    ),
    [],
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Tab bar (group switcher) */}
      <View style={styles.tabRow}>
        <Pressable style={[styles.tab, styles.tabActive]}>
          <Text style={[styles.tabText, styles.tabTextActive]}>{MOCK_OSHI_NAME}</Text>
        </Pressable>
        <Pressable style={styles.tab}>
          <Text style={styles.tabText}>全て</Text>
        </Pressable>
      </View>
      <View style={styles.tabDivider} />

      {/* Filter pills */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filterRow}
        contentContainerStyle={styles.filterContent}
      >
        {FILTERS.map((f) => (
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
      {isLoading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={colors.ink} />
        </View>
      ) : isError ? (
        <View style={styles.centered}>
          <Text style={styles.errorText}>読み込みに失敗しました</Text>
        </View>
      ) : (
        <FlatList
          data={filteredCards}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.cardContent}
          onEndReached={handleEndReached}
          onEndReachedThreshold={0.5}
          refreshControl={
            <RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor={colors.ink} />
          }
          ListFooterComponent={
            isFetchingNextPage ? (
              <ActivityIndicator style={styles.footer} color={colors.ink} />
            ) : null
          }
          ListEmptyComponent={<Text style={styles.emptyText}>カードがありません</Text>}
        />
      )}
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
  filterContent: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    paddingVertical: 8,
    gap: 6,
  },
  filterPill: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: radii.pill,
    borderWidth: 1,
    borderColor: colors.borderStrong,
  },
  filterPillActive: { backgroundColor: colors.ink, borderColor: colors.ink },
  filterText: { fontSize: 12, color: colors.ink },
  filterTextActive: { color: colors.white, fontWeight: '600' },
  cardContent: {
    paddingHorizontal: spacing.lg,
    paddingTop: 8,
    paddingBottom: spacing.tabBarPadding,
    gap: spacing.cardGap,
  },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { ...typography.caption, textAlign: 'center', marginTop: 40 },
  errorText: { ...typography.caption, textAlign: 'center', color: colors.inkSoft },
  footer: { paddingVertical: 16 },
});
