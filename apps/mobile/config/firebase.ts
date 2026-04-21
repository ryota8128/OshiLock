// TODO: Development Build 移行時に @react-native-firebase に置き換え
// 現在は Expo Go 互換のため Firebase Web SDK を使用
import { initializeApp } from 'firebase/app';
import {
  initializeAuth,
  // @ts-ignore -- firebase/auth の型定義に getReactNativePersistence が含まれていない（実行時は存在する）
  getReactNativePersistence,
  OAuthProvider,
  signInWithCredential,
} from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: 'AIzaSyAn0BnHlDH9mLEzqthwyA8VJU2rjBlI7DM',
  projectId: 'oshilock-2a883',
  messagingSenderId: '631907126423',
  appId: '1:631907126423:ios:c364690a7c6ea45b4fadd2',
};

const app = initializeApp(firebaseConfig);
export const firebaseAuth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});

export async function signInWithAppleCredential(identityToken: string, nonce: string) {
  const provider = new OAuthProvider('apple.com');
  const credential = provider.credential({ idToken: identityToken, rawNonce: nonce });
  return signInWithCredential(firebaseAuth, credential);
}
