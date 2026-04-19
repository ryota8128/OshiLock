import { View, Text, StyleSheet, Pressable, Alert } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors, categoryColors } from "@/constants/theme";
import { useAuth } from "@/contexts/AuthContext";

const APPLE_CANCEL_CODE = "ERR_REQUEST_CANCELED";

export default function LoginScreen() {
  const insets = useSafeAreaInsets();
  const { signInWithApple, signInWithGoogle } = useAuth();

  const handleApple = async () => {
    try {
      await signInWithApple();
    } catch (e) {
      if (!(e instanceof Error && "code" in e && e.code === APPLE_CANCEL_CODE)) {
        Alert.alert("エラー", "Appleサインインに失敗しました");
      }
    }
  };

  const handleGoogle = async () => {
    try {
      await signInWithGoogle();
    } catch (e) {
      Alert.alert("エラー", "Googleサインインに失敗しました");
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom + 20 }]}>
      {/* Hero */}
      <View style={styles.hero}>
        <View style={styles.logo}>
          <Text style={styles.logoText}>O</Text>
        </View>
        <Text style={styles.appName}>OshiLock</Text>
        <Text style={styles.catchCopy}>
          推しの情報、{"\n"}ここだけ見ればOK
        </Text>
        <View style={styles.dots}>
          <View style={[styles.dot, { backgroundColor: categoryColors.event.line }]} />
          <View style={[styles.dot, { backgroundColor: categoryColors.media.line }]} />
          <View style={[styles.dot, { backgroundColor: categoryColors.sns.line }]} />
          <View style={[styles.dot, { backgroundColor: categoryColors.news.line }]} />
        </View>
      </View>

      {/* Auth buttons */}
      <View style={styles.authSection}>
        <Pressable
          style={styles.appleButton}
          onPress={handleApple}
        >
          <Text style={styles.appleButtonText}>Appleでサインイン</Text>
        </Pressable>

        <Pressable
          style={styles.googleButton}
          onPress={handleGoogle}
        >
          <Text style={styles.googleButtonText}>Googleで続ける</Text>
        </Pressable>
      </View>

      {/* Terms */}
      <Text style={styles.terms}>
        続行することで 利用規約 と{"\n"}プライバシーポリシー に同意したものとみなされます
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 28,
    backgroundColor: colors.paper,
  },
  hero: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: -30,
  },
  logo: {
    width: 72,
    height: 72,
    borderRadius: 22,
    backgroundColor: colors.ink,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 22,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 8,
  },
  logoText: {
    fontSize: 34,
    fontWeight: "700",
    color: colors.white,
    letterSpacing: -1,
  },
  appName: {
    fontSize: 34,
    fontWeight: "700",
    color: colors.ink,
    letterSpacing: -0.8,
    marginBottom: 10,
  },
  catchCopy: {
    fontSize: 13,
    color: colors.inkSoft,
    lineHeight: 21,
    textAlign: "center",
    maxWidth: 260,
  },
  dots: {
    flexDirection: "row",
    gap: 6,
    marginTop: 28,
    opacity: 0.5,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  authSection: {
    gap: 10,
  },
  appleButton: {
    height: 50,
    backgroundColor: "#000",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  appleButtonText: {
    fontSize: 15,
    fontWeight: "600",
    color: colors.white,
  },
  googleButton: {
    height: 50,
    backgroundColor: colors.white,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(43,42,40,0.18)",
  },
  googleButtonText: {
    fontSize: 15,
    fontWeight: "600",
    color: colors.ink,
  },
  terms: {
    marginTop: 18,
    fontSize: 10,
    color: colors.inkSoft,
    textAlign: "center",
    lineHeight: 17,
  },
});
