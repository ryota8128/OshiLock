import { Tabs } from 'expo-router';
import { Pressable, StyleSheet, View, Text } from 'react-native';
import { colors, spacing } from '@/constants/theme';

function TabIcon({ name, focused }: { name: string; focused: boolean }) {
  const iconMap: Record<string, string> = {
    home: '🏠',
    timeline: '📋',
    favorites: '☆',
    mypage: '👤',
  };
  return (
    <Text style={{ fontSize: 20, opacity: focused ? 1 : 0.5 }}>
      {iconMap[name] || '●'}
    </Text>
  );
}

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
          tabBarIcon: ({ focused }) => <TabIcon name="home" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="timeline"
        options={{
          title: 'タイムライン',
          tabBarIcon: ({ focused }) => <TabIcon name="timeline" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="favorites"
        options={{
          title: '気になる',
          tabBarIcon: ({ focused }) => <TabIcon name="favorites" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="mypage"
        options={{
          title: 'マイページ',
          tabBarIcon: ({ focused }) => <TabIcon name="mypage" focused={focused} />,
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
