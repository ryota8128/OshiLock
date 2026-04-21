# Mobile 認証（Firebase Auth）

## Expo Go 互換の設定

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
