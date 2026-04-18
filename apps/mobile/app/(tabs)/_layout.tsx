import { Tabs } from 'expo-router';
import { StyleSheet } from 'react-native';
import { House, List, Bookmark, User } from 'lucide-react-native';
import { colors, spacing } from '@/constants/theme';

export default function TabLayout() {
  return (
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
});
