import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, spacing, typography, radii } from '@/constants/theme';
import { useAuth } from '@/contexts/AuthContext';
import { MOCK_USER } from '@/data/mock';

function StatItem({ value, label }: { value: string; label: string }) {
  return (
    <View style={styles.statItem}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function SettingsRow({ label, value, onPress }: { label: string; value?: string; onPress?: () => void }) {
  return (
    <Pressable style={styles.settingsRow} onPress={onPress}>
      <Text style={styles.settingsLabel}>{label}</Text>
      <View style={styles.settingsRight}>
        {value && <Text style={styles.settingsValue}>{value}</Text>}
        <Text style={styles.chevron}>›</Text>
      </View>
    </Pressable>
  );
}

export default function MyPageScreen() {
  const insets = useSafeAreaInsets();
  const { signOut } = useAuth();
  return (
    <ScrollView style={styles.container} contentContainerStyle={[styles.contentContainer, { paddingTop: insets.top }]}>
      {/* Profile */}
      <View style={styles.profileSection}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{MOCK_USER.displayName[0]}</Text>
        </View>
        <Text style={styles.displayName}>{MOCK_USER.displayName}</Text>
        <View style={styles.rankBadge}>
          <Text style={styles.rankText}>🏆 {MOCK_USER.rank}</Text>
        </View>
      </View>

      {/* Stats */}
      <View style={styles.statsRow}>
        <StatItem value="12" label="最速投稿" />
        <StatItem value="3" label="🥇 1位" />
        <StatItem value="156" label="気になる" />
      </View>

      {/* Settings */}
      <View style={styles.settingsGroup}>
        <SettingsRow label="デフォルト推し" value="乃木坂46" />
        <SettingsRow label="通知設定" />
        <SettingsRow label="表示名の変更" />
      </View>

      <View style={styles.settingsGroup}>
        <SettingsRow label="利用規約" />
        <SettingsRow label="プライバシーポリシー" />
        <SettingsRow label="アカウント削除" />
      </View>

      <View style={styles.settingsGroup}>
        <SettingsRow label="ログアウト" onPress={() => signOut()} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.paper },
  contentContainer: { paddingBottom: spacing.tabBarPadding },
  profileSection: { alignItems: 'center', paddingTop: 24, paddingBottom: 20 },
  avatar: {
    width: 72, height: 72, borderRadius: 36,
    backgroundColor: '#E8DDC6', borderWidth: 1, borderColor: colors.borderStrong,
    justifyContent: 'center', alignItems: 'center', marginBottom: 12,
  },
  avatarText: { fontSize: 28, fontWeight: '600', color: colors.ink },
  displayName: { fontSize: 17, fontWeight: '700', color: colors.ink, marginBottom: 8 },
  rankBadge: {
    backgroundColor: colors.rankBadgeBg, borderRadius: radii.pill,
    borderWidth: 1, borderColor: colors.rankBadgeBorder,
    paddingHorizontal: 12, paddingVertical: 4,
  },
  rankText: { fontSize: 12, fontWeight: '700', color: colors.rankBadgeText },
  statsRow: {
    flexDirection: 'row', backgroundColor: colors.white, borderRadius: radii.widget,
    marginHorizontal: spacing.lg, marginBottom: 20, padding: 16,
  },
  statItem: { flex: 1, alignItems: 'center' },
  statValue: { fontSize: 18, fontWeight: '700', letterSpacing: -0.3, color: colors.ink },
  statLabel: { ...typography.meta, marginTop: 4 },
  settingsGroup: {
    backgroundColor: colors.white, borderRadius: radii.card,
    marginHorizontal: spacing.lg, marginBottom: 16,
  },
  settingsRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 14, paddingVertical: 13,
    borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.borderLight,
  },
  settingsLabel: { fontSize: 13, color: colors.ink },
  settingsRight: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  settingsValue: { ...typography.caption },
  chevron: { fontSize: 18, color: colors.inkSoft },
});
