import * as AppleAuthentication from "expo-apple-authentication";
import * as AuthSession from "expo-auth-session";
import * as SecureStore from "expo-secure-store";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { Alert } from "react-native";
import { AUTH_PROVIDER, type AuthProvider } from "@oshilock/shared";

function getGoogleClientId(): string {
  const id = process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID;
  if (!id) throw new Error("EXPO_PUBLIC_GOOGLE_CLIENT_ID is not set");
  return id;
}
const GOOGLE_CLIENT_ID = getGoogleClientId();

const TOKEN_KEY = "auth_token";
const USER_KEY = "auth_user";

type AuthUser = {
  id: string;
  email: string | null;
  displayName: string | null;
  provider: AuthProvider;
};

type AuthContextType = {
  user: AuthUser | null;
  isLoading: boolean;
  signInWithApple: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

const googleDiscovery = {
  authorizationEndpoint: "https://accounts.google.com/o/oauth2/v2/auth",
  tokenEndpoint: "https://oauth2.googleapis.com/token",
  revocationEndpoint: "https://oauth2.googleapis.com/revoke",
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [, googleResponse, googlePromptAsync] = AuthSession.useAuthRequest(
    {
      clientId: GOOGLE_CLIENT_ID,
      scopes: ["openid", "profile", "email"],
      redirectUri: AuthSession.makeRedirectUri(),
    },
    googleDiscovery,
  );

  // 起動時にトークン確認
  useEffect(() => {
    (async () => {
      try {
        const stored = await SecureStore.getItemAsync(USER_KEY);
        if (stored) {
          setUser(JSON.parse(stored));
        }
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  // Google レスポンスハンドリング
  useEffect(() => {
    if (googleResponse?.type === "success") {
      const { id_token } = googleResponse.params;
      handleGoogleToken(id_token);
    } else if (googleResponse?.type === "error") {
      Alert.alert("エラー", "Googleサインインに失敗しました");
    }
  }, [googleResponse]);

  async function handleGoogleToken(idToken: string) {
    // TODO: BE実装後はサーバーに送信して検証する
    const payload = JSON.parse(atob(idToken.split(".")[1]));
    const authUser: AuthUser = {
      id: payload.sub,
      email: payload.email || null,
      displayName: payload.name || null,
      provider: AUTH_PROVIDER.GOOGLE,
    };
    await saveUser(authUser, idToken);
  }

  async function signInWithApple() {
    const credential = await AppleAuthentication.signInAsync({
      requestedScopes: [
        AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
        AppleAuthentication.AppleAuthenticationScope.EMAIL,
      ],
    });

    if (!credential.identityToken) {
      throw new Error("Apple Sign In: identityToken is null");
    }

    // TODO: BE実装後はサーバーに送信して検証する
    const authUser: AuthUser = {
      id: credential.user,
      email: credential.email || null,
      displayName: credential.fullName
        ? `${credential.fullName.familyName || ""}${credential.fullName.givenName || ""}`.trim() ||
          null
        : null,
      provider: AUTH_PROVIDER.APPLE,
    };
    await saveUser(authUser, credential.identityToken);
  }

  async function signInWithGoogle() {
    await googlePromptAsync();
  }

  async function signOut() {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
    await SecureStore.deleteItemAsync(USER_KEY);
    setUser(null);
  }

  async function saveUser(authUser: AuthUser, token: string) {
    await SecureStore.setItemAsync(TOKEN_KEY, token);
    await SecureStore.setItemAsync(USER_KEY, JSON.stringify(authUser));
    setUser(authUser);
  }

  return (
    <AuthContext.Provider
      value={{ user, isLoading, signInWithApple, signInWithGoogle, signOut }}
    >
      {children}
    </AuthContext.Provider>
  );
}
