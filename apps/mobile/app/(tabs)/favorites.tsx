import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, spacing, typography } from '@/constants/theme';
import { EventCardItem } from '@/components/EventCardItem';
import { MOCK_CARDS } from '@/data/mock';

export default function FavoritesScreen() {
  const insets = useSafeAreaInsets();
  const checkedCards = MOCK_CARDS.filter(c => c.checked);

  return (
    <ScrollView style={styles.container} contentContainerStyle={[styles.contentContainer, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>チェック</Text>
        <Text style={styles.headerSub}>チェック済みのカード</Text>
      </View>

      {checkedCards.length > 0 ? (
        <>
          <Text style={styles.sectionLabel}>近日中</Text>
          <View style={styles.cardList}>
            {checkedCards.map(card => (
              <EventCardItem key={card.id} card={card} />
            ))}
          </View>
        </>
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyTitle}>まだチェックしたカードがありません</Text>
          <Text style={styles.emptySub}>カードの ☆ ボタンを押すとここに表示されます</Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.paper },
  contentContainer: { paddingBottom: spacing.tabBarPadding },
  header: { padding: spacing.lg, paddingBottom: spacing.md },
  headerTitle: { ...typography.heading },
  headerSub: { ...typography.caption, marginTop: 2 },
  sectionLabel: {
    ...typography.label, textTransform: 'uppercase',
    paddingHorizontal: spacing.lg, marginBottom: spacing.sm, marginTop: spacing.md,
  },
  cardList: { paddingHorizontal: spacing.lg, gap: spacing.cardGap },
  emptyContainer: { alignItems: 'center', marginTop: 80 },
  emptyTitle: { fontSize: 15, fontWeight: '600', color: colors.ink, marginBottom: 8 },
  emptySub: { ...typography.caption, textAlign: 'center' },
});
