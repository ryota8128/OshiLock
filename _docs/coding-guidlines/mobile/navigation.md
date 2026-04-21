# Mobile ナビゲーション

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
