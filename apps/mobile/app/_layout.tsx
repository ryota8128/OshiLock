import { Stack, router, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import 'react-native-reanimated';

const queryClient = new QueryClient();

SplashScreen.preventAutoHideAsync();

function RootNavigator() {
  const { user, isLoading, isNewUser } = useAuth();
  const segments = useSegments();
  const firstSegment = segments[0];

  useEffect(() => {
    if (!isLoading) SplashScreen.hideAsync();
  }, [isLoading]);

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = firstSegment === 'login';

    if (!user && !inAuthGroup) {
      router.replace('/login');
      return;
    }
    if (!user || !inAuthGroup) return;

    router.replace(isNewUser ? '/onboarding' : '/(tabs)');
  }, [user, isLoading, isNewUser, firstSegment]);

  if (isLoading) return null;

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="login" />
      <Stack.Screen name="onboarding" />
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="event/[id]" />
      <Stack.Screen
        name="settings/notification"
        options={{
          title: '通知設定',
          headerShown: true,
          headerBackButtonDisplayMode: 'minimal',
          headerStyle: { backgroundColor: '#FAF8F4' },
        }}
      />
      <Stack.Screen
        name="settings/profile"
        options={{
          title: 'プロフィール編集',
          headerShown: true,
          headerBackButtonDisplayMode: 'minimal',
          headerStyle: { backgroundColor: '#FAF8F4' },
        }}
      />
      <Stack.Screen name="post" options={{ presentation: 'modal' }} />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>
        <StatusBar style="dark" />
        <AuthProvider>
          <RootNavigator />
        </AuthProvider>
      </SafeAreaProvider>
    </QueryClientProvider>
  );
}
