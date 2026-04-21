# Mobile レイアウト（Safe Area）

## ヘッダーあり画面

`headerShown: true` の画面では、React Navigation が上側の safe area を処理する。
画面側では `SafeAreaView` の `edges={['bottom']}` で **下だけ** 適用する。

```typescript
// ✅ ヘッダーあり画面 -> bottom のみ
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

// ❌ edges 指定なしの SafeAreaView（上下両方適用 -> ヘッダーと二重パディング）
<SafeAreaView style={styles.container}>
```

## ヘッダーなし画面（ログイン、オンボーディング等）

`headerShown: false` の画面では `useSafeAreaInsets` で上下両方を手動制御する。
