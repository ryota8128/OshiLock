---
name: implement-mobile-screen
description: Mobile 画面追加、ナビゲーション・レイアウト設定
---

# Mobile 画面実装スキル

新しい画面の追加、ナビゲーション・レイアウト設定を行う。

## 読み込むドキュメント

以下を Read ツールで読み込むこと:

1. `_docs/coding-guidlines/mobile/navigation.md` — Stack ナビゲーション・ヘッダー設定
2. `_docs/coding-guidlines/mobile/layout.md` — Safe Area の扱い
3. `_docs/coding-guidlines/mobile/auth.md` — Firebase Auth（認証画面の場合のみ）

## 既存コードの確認

- `apps/mobile/app/_layout.tsx` の既存 Stack.Screen 設定を確認する
- 同種の既存画面を確認し、パターンを踏襲する

## チェックリスト

- [ ] ヘッダー設定は `_layout.tsx` の `Stack.Screen` で行う（画面側で設定しない）
- [ ] `headerBackButtonDisplayMode: 'minimal'` を使う
- [ ] ヘッダーあり画面は `SafeAreaView edges={['bottom']}` で下だけ適用
- [ ] ヘッダーなし画面は `useSafeAreaInsets` で上下両方を手動制御
