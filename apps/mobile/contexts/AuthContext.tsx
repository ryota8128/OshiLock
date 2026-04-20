// TODO: Development Build 移行時に @react-native-firebase に置き換え
// 現在は Expo Go 互換のため Firebase Web SDK を使用
import * as AppleAuthentication from "expo-apple-authentication";
import * as Crypto from "expo-crypto";
import * as SecureStore from "expo-secure-store";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import {
  onAuthStateChanged,
  signOut as firebaseSignOut,
  type User as FirebaseUser,
} from "firebase/auth";
import { firebaseAuth, signInWithAppleCredential } from "@/config/firebase";

const TOKEN_KEY = "auth_token";

type AuthUser = {
  uid: string;
  email: string | null;
  displayName: string | null;
};

type AuthContextType = {
  user: AuthUser | null;
  isLoading: boolean;
  signInWithApple: () => Promise<void>;
  signOut: () => Promise<void>;
  getIdToken: () => Promise<string | null>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
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

  // Firebase の認証状態を監視（自動リフレッシュ含む）
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
    // nonce を生成して Apple に渡し、Firebase で検証する
    const nonce = Math.random().toString(36).substring(2, 10);
    const hashedNonce = await Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.SHA256,
      nonce,
    );

    const credential = await AppleAuthentication.signInAsync({
      requestedScopes: [
        AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
        AppleAuthentication.AppleAuthenticationScope.EMAIL,
      ],
      nonce: hashedNonce,
    });

    if (!credential.identityToken) {
      throw new Error("Apple Sign In: identityToken is null");
    }

    // Firebase に Apple の credential でサインイン
    await signInWithAppleCredential(credential.identityToken, nonce);
    // onAuthStateChanged が user を自動更新する
  }

  // TODO: Google Sign In は Development Build 移行時に @react-native-google-signin で実装

  async function signOut() {
    await firebaseSignOut(firebaseAuth);
    await SecureStore.deleteItemAsync(TOKEN_KEY);
    setUser(null);
  }

  // BE への API リクエスト時に使う Firebase ID Token を取得
  async function getIdToken(): Promise<string | null> {
    const currentUser = firebaseAuth.currentUser;
    if (!currentUser) return null;
    return currentUser.getIdToken();
  }

  return (
    <AuthContext.Provider
      value={{ user, isLoading, signInWithApple, signOut, getIdToken }}
    >
      {children}
    </AuthContext.Provider>
  );
}
