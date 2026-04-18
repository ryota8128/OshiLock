import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, spacing, typography, radii } from '@/constants/theme';
import { EventCardItem } from '@/components/EventCardItem';
import { MOCK_CARDS, MOCK_USER, getUnreadCount, getTotalCardCount, getReadCount } from '@/data/mock';

function CoverageWidget() {
  const total = getTotalCardCount();
  const read = getReadCount();
  const unread = getUnreadCount();
  const ratio = total > 0 ? read / total : 0;

  return (
    <View style={styles.coverageWidget}>
      <Text style={styles.coverageTitle}>情報カバー率</Text>
      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: `${ratio * 100}%` }]} />
      </View>
      <Text style={styles.coverageSub}>
        {unread}件 未チェック / {read}/{total} チェック済
      </Text>
    </View>
  );
}

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const urgentCards = MOCK_CARDS.filter(c => c.urgent);
  const todayCards = MOCK_CARDS.filter(c => c.schedule.datetime !== null && !c.urgent).slice(0, 2);

  return (
    <ScrollView style={styles.container} contentContainerStyle={[styles.contentContainer, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>こんばんは、{MOCK_USER.displayName}さん</Text>
          <Text style={styles.headerTitle}>今日の推し</Text>
        </View>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{MOCK_USER.displayName[0]}</Text>
        </View>
      </View>

      <CoverageWidget />

      {urgentCards.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>要チェック</Text>
          <View style={styles.cardList}>
            {urgentCards.map(card => (
              <EventCardItem key={card.id} card={card} />
            ))}
          </View>
        </View>
      )}

      <View style={styles.section}>
        <Text style={styles.sectionLabel}>今日の予定</Text>
        <View style={styles.cardList}>
          {todayCards.map(card => (
            <EventCardItem key={card.id} card={card} />
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.paper },
  contentContainer: { paddingBottom: spacing.tabBarPadding },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.lg,
    paddingBottom: spacing.md,
  },
  greeting: { ...typography.caption },
  headerTitle: { fontSize: 24, fontWeight: '700', letterSpacing: -0.4, color: colors.ink, marginTop: 2 },
  avatar: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: '#E8DDC6', borderWidth: 1, borderColor: colors.borderStrong,
    justifyContent: 'center', alignItems: 'center',
  },
  avatarText: { fontSize: 14, fontWeight: '600', color: colors.ink },
  coverageWidget: {
    backgroundColor: colors.white, borderRadius: radii.widget,
    borderWidth: 1, borderColor: colors.border,
    marginHorizontal: spacing.lg, padding: spacing.lg, marginBottom: spacing.sectionGap,
  },
  coverageTitle: { fontSize: 14, fontWeight: '600', color: colors.ink, marginBottom: 8 },
  progressBar: {
    height: 6, borderRadius: 3, backgroundColor: colors.borderLight, marginBottom: 8,
  },
  progressFill: {
    height: 6, borderRadius: 3, backgroundColor: '#A03828',
  },
  coverageSub: { ...typography.caption },
  section: { marginTop: spacing.sectionGap },
  sectionLabel: { ...typography.label, textTransform: 'uppercase', paddingHorizontal: spacing.lg, marginBottom: spacing.sm },
  cardList: { paddingHorizontal: spacing.lg, gap: spacing.cardGap },
});
