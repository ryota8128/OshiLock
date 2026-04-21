# Mobile アーキテクチャ ガイドライン

## Stack ナビゲーションのヘッダー設定

### 設定場所

ヘッダーの設定は `app/_layout.tsx` の `Stack.Screen` で行う。画面側（`notification.tsx` 等）では設定しない。

```typescript
// ✅ _layout.tsx で設定
<Stack.Screen
  name="settings/notification"
  options={{
    title: '通知設定',
    headerShown: true,
    headerBackButtonDisplayMode: 'minimal',
    headerStyle: { backgroundColor: colors.paper },
  }}
/>

// ❌ 画面側で Stack.Screen options を設定しない
export default function NotificationScreen() {
  return (
    <>
      <Stack.Screen options={{ title: '通知設定' }} />
      ...
    </>
  );
}
```

### 戻るボタンのスタイル

iOS ネイティブのデフォルトスタイルに任せる。カスタムアイコンに置き換えない。

- `headerBackButtonDisplayMode: 'minimal'` でアイコンのみ表示（ラベル非表示）
- iOS 16+ の丸い背景はネイティブ標準なのでそのまま

### headerBackTitle の注意点

`headerBackTitle` は **遷移先ではなく遷移元の画面** に効くプロパティ。
`settings/notification` 画面の戻るボタンを制御したい場合、`headerBackTitle` を `settings/notification` に設定しても効かない。

```typescript
// ❌ これは notification 画面の戻るボタンには効かない
<Stack.Screen
  name="settings/notification"
  options={{ headerBackTitle: ' ' }}
/>

// ✅ headerBackButtonDisplayMode を使う
<Stack.Screen
  name="settings/notification"
  options={{ headerBackButtonDisplayMode: 'minimal' }}
/>
```

## TanStack Query によるデータ取得

### 方針

- グローバル state に永続化しない。画面を開いた時に取得する
- `staleTime` を数時間に設定し、同一セッション内の無駄な再取得を防ぐ
- アプリ起動時に全データを一括取得しない

### Query Hook パターン

```typescript
const PROFILE_KEY = ['users', 'me'] as const;
const STALE_TIME = 4 * 60 * 60 * 1000; // 4時間

export function useProfile() {
  return useQuery({
    queryKey: PROFILE_KEY,
    queryFn: () => userApi.getProfile(),
    staleTime: STALE_TIME,
    select: (data) => data.user,
  });
}

// キャッシュ無効化用
export function useInvalidateProfile() {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: PROFILE_KEY });
}
```

### Mutation Hook パターン（楽観的更新）

トグル等の即時フィードバックが必要な操作は楽観的更新を使う。

```typescript
export function useUpdateSettings() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: UpdateUserSettingsRequest) => userApi.updateSettings(body),
    // 1. キャッシュを即座に更新（UI が瞬時に反映）
    onMutate: async (body) => {
      await queryClient.cancelQueries({ queryKey: SETTINGS_KEY });
      const previous = queryClient.getQueryData(SETTINGS_KEY);
      queryClient.setQueryData(SETTINGS_KEY, (old) => {
        if (!old) return old;
        return { settings: { ...old.settings, notification: { ...old.settings.notification, ...body.notification } } };
      });
      return { previous };
    },
    // 2. 失敗時はロールバック
    onError: (_err, _body, context) => {
      if (context?.previous) {
        queryClient.setQueryData(SETTINGS_KEY, context.previous);
      }
    },
    // 3. 成功・失敗どちらでもサーバーから再取得して同期
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: SETTINGS_KEY });
    },
  });
}
```

## Safe Area の扱い

### ヘッダーあり画面

`headerShown: true` の画面では、React Navigation が上側の safe area を処理する。
画面側では `SafeAreaView` の `edges={['bottom']}` で **下だけ** 適用する。

```typescript
// ✅ ヘッダーあり画面 → bottom のみ
import { SafeAreaView } from 'react-native-safe-area-context';

return (
  <SafeAreaView style={styles.container} edges={['bottom']}>
    <KeyboardAvoidingView style={styles.inner} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      {/* コンテンツ */}
    </KeyboardAvoidingView>
  </SafeAreaView>
);

// ❌ useSafeAreaInsets で手動 paddingBottom（ヘッダーと競合する）
const insets = useSafeAreaInsets();
<View style={{ paddingBottom: insets.bottom + 20 }}>

// ❌ edges 指定なしの SafeAreaView（上下両方適用 → ヘッダーと二重パディング）
<SafeAreaView style={styles.container}>
```

### ヘッダーなし画面（ログイン、オンボーディング等）

`headerShown: false` の画面では `useSafeAreaInsets` で上下両方を手動制御する。

## Firebase Auth 永続化

### Expo Go 互換の設定

`@react-native-async-storage/async-storage` v2（Expo SDK 54 互換）を使用。
`getReactNativePersistence` は `firebase/auth` の型定義に含まれないため `@ts-ignore` で対応。

```typescript
import { initializeApp } from 'firebase/app';
import {
  initializeAuth,
  // @ts-ignore -- firebase/auth の型定義に含まれない（実行時は存在する）
  getReactNativePersistence,
  OAuthProvider,
  signInWithCredential,
} from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

const app = initializeApp(firebaseConfig);
export const firebaseAuth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});
```

- `getAuth()` ではなく `initializeAuth()` を使う（persistence オプションを渡すため）
- Development Build 移行時に `@react-native-firebase` に置き換え予定
