import { Tabs, router } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';
import { House, List, Bookmark, User, Plus } from 'lucide-react-native';
import { colors, spacing } from '@/constants/theme';

export default function TabLayout() {
  return (
    <>
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: colors.ink,
        tabBarInactiveTintColor: colors.inkSoft,
        tabBarLabelStyle: styles.tabBarLabel,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'ホーム',
          tabBarIcon: ({ color, size }) => <House size={size} color={color} strokeWidth={1.5} />,
        }}
      />
      <Tabs.Screen
        name="timeline"
        options={{
          title: 'タイムライン',
          tabBarIcon: ({ color, size }) => <List size={size} color={color} strokeWidth={1.5} />,
        }}
      />
      <Tabs.Screen
        name="favorites"
        options={{
          title: 'チェック',
          tabBarIcon: ({ color, size }) => <Bookmark size={size} color={color} strokeWidth={1.5} />,
        }}
      />
      <Tabs.Screen
        name="mypage"
        options={{
          title: 'マイページ',
          tabBarIcon: ({ color, size }) => <User size={size} color={color} strokeWidth={1.5} />,
        }}
      />
    </Tabs>

    {/* FAB */}
    <Pressable style={styles.fab} onPress={() => router.push("/post")}>
      <Plus size={28} color={colors.white} strokeWidth={2} />
    </Pressable>
    </>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: 'rgba(255,255,255,0.92)',
    borderTopColor: colors.borderMedium,
    height: spacing.tabBarHeight,
    paddingBottom: 20,
  },
  tabBarLabel: {
    fontSize: 10,
    fontWeight: '600',
  },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: spacing.tabBarHeight + 8,
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: colors.ink,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
  },
});
