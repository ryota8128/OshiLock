import { View, Text, Switch, StyleSheet, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, spacing, radii } from '@/constants/theme';
import { useSettings, useUpdateSettings } from '@/hooks/useSettings';

function ToggleRow({
  label,
  description,
  value,
  onValueChange,
  disabled,
}: {
  label: string;
  description: string;
  value: boolean;
  onValueChange: (val: boolean) => void;
  disabled?: boolean;
}) {
  return (
    <View style={styles.toggleRow}>
      <View style={styles.toggleTexts}>
        <Text style={styles.toggleLabel}>{label}</Text>
        <Text style={styles.toggleDescription}>{description}</Text>
      </View>
      <Switch value={value} onValueChange={onValueChange} disabled={disabled} />
    </View>
  );
}

export default function NotificationSettingsScreen() {
  const insets = useSafeAreaInsets();
  const { data: settings, isLoading } = useSettings();
  const { mutate: updateSettings, isPending } = useUpdateSettings();

  if (isLoading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color={colors.inkSoft} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom }]}>
      <View style={styles.group}>
        <ToggleRow
          label="リマインド通知"
          description="チェックしたイベントの前日にお知らせ"
          value={settings?.notification.reminder ?? true}
          onValueChange={(val) => updateSettings({ notification: { reminder: val } })}
          disabled={isPending}
        />
        <ToggleRow
          label="新着まとめ通知"
          description="推しの新着情報を毎日まとめてお届け"
          value={settings?.notification.dailySummary ?? true}
          onValueChange={(val) => updateSettings({ notification: { dailySummary: val } })}
          disabled={isPending}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.paper, paddingTop: spacing.lg },
  center: { justifyContent: 'center', alignItems: 'center' },
  group: {
    backgroundColor: colors.white,
    borderRadius: radii.card,
    marginHorizontal: spacing.lg,
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.borderLight,
  },
  toggleTexts: { flex: 1, marginRight: 12 },
  toggleLabel: { fontSize: 14, fontWeight: '600', color: colors.ink },
  toggleDescription: { fontSize: 11, color: colors.inkSoft, marginTop: 2 },
});
