// TODO: Development Build 移行時に @react-native-firebase に置き換え
// 現在は Expo Go 互換のため Firebase Web SDK を使用
import * as AppleAuthentication from 'expo-apple-authentication';
import * as Crypto from 'expo-crypto';
import * as SecureStore from 'expo-secure-store';
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { Alert } from 'react-native';
import {
  onAuthStateChanged,
  signOut as firebaseSignOut,
  type User as FirebaseUser,
} from 'firebase/auth';
import { firebaseAuth, signInWithAppleCredential } from '@/config/firebase';
import { authApi } from '@/api/auth';

const TOKEN_KEY = 'auth_token';

type AuthUser = {
  uid: string;
  email: string | null;
  displayName: string | null;
};

type AuthContextType = {
  user: AuthUser | null;
  isLoading: boolean;
  isNewUser: boolean;
  signInWithApple: () => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

function toAuthUser(firebaseUser: FirebaseUser): AuthUser {
  return {
    uid: firebaseUser.uid,
    email: firebaseUser.email,
    displayName: firebaseUser.displayName,
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isNewUser, setIsNewUser] = useState(false);

  // Firebase の認証状態を監視（起動時の自動ログイン復元 + トークンリフレッシュ）
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(firebaseAuth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(toAuthUser(firebaseUser));
        const token = await firebaseUser.getIdToken();
        await SecureStore.setItemAsync(TOKEN_KEY, token);
      } else {
        setUser(null);
        await SecureStore.deleteItemAsync(TOKEN_KEY);
      }
      setIsLoading(false);
    });
    return unsubscribe;
  }, []);

  async function signInWithApple() {
    const nonce = Math.random().toString(36).substring(2, 10);
    const hashedNonce = await Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, nonce);

    const credential = await AppleAuthentication.signInAsync({
      requestedScopes: [
        AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
        AppleAuthentication.AppleAuthenticationScope.EMAIL,
      ],
      nonce: hashedNonce,
    });

    if (!credential.identityToken) {
      throw new Error('Apple Sign In: identityToken is null');
    }

    // Firebase にサインイン
    const firebaseCredential = await signInWithAppleCredential(credential.identityToken, nonce);
    const token = await firebaseCredential.user.getIdToken();

    // BE にユーザー登録/ログイン
    try {
      const result = await authApi.signIn(token);
      setIsNewUser(result.isNewUser);

      // Custom Claims が設定された後、token をリフレッシュして claims を反映
      // Custom Claims 反映済みの token を取得して保存
      const refreshedToken = await firebaseCredential.user.getIdToken(true);
      await SecureStore.setItemAsync(TOKEN_KEY, refreshedToken);
    } catch (e) {
      console.error('BE signin failed:', e);
      await signOut();
      Alert.alert('エラー', 'サーバーへの登録に失敗しました。再度ログインしてください。');
    }
  }

  // TODO: Google Sign In は Development Build 移行時に @react-native-google-signin で実装

  async function signOut() {
    await firebaseSignOut(firebaseAuth);
    await SecureStore.deleteItemAsync(TOKEN_KEY);
    setUser(null);
    setIsNewUser(false);
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, isNewUser, signInWithApple, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}
