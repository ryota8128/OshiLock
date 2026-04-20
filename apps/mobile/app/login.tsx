import { View, Text, StyleSheet, Pressable, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '@/constants/theme';
import { useAuth } from '@/contexts/AuthContext';
import { OshiLogo } from '@/components/OshiLogo';

const APPLE_CANCEL_CODE = 'ERR_REQUEST_CANCELED';

export default function LoginScreen() {
  const insets = useSafeAreaInsets();
  const { signInWithApple } = useAuth();

  const handleApple = async () => {
    try {
      await signInWithApple();
    } catch (e) {
      if (!(e instanceof Error && 'code' in e && e.code === APPLE_CANCEL_CODE)) {
        Alert.alert('エラー', 'Appleサインインに失敗しました');
      }
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom + 20 }]}>
      <View style={styles.hero}>
        <OshiLogo width={300} />
      </View>
      <View style={styles.authSection}>
        <Pressable style={styles.appleButton} onPress={handleApple}>
          <Text style={styles.appleButtonText}>Appleでサインイン</Text>
        </Pressable>

        {/* TODO: Google Sign In は Development Build 移行時に実装 */}
        <Pressable style={[styles.googleButton, styles.disabledButton]} disabled>
          <Text style={[styles.googleButtonText, styles.disabledText]}>
            Googleで続ける（準備中）
          </Text>
        </Pressable>

        <Text style={styles.terms}>
          続行することで 利用規約 と{'\n'}プライバシーポリシー に同意したものとみなされます
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 28,
    backgroundColor: colors.paper,
    justifyContent: 'center',
  },
  hero: {
    alignItems: 'center',
  },
  catchCopy: {
    fontSize: 13,
    color: colors.inkSoft,
    lineHeight: 21,
    textAlign: 'center',
    maxWidth: 260,
    marginTop: 16,
  },
  authSection: {
    gap: 10,
    marginTop: 32,
    alignSelf: 'stretch',
  },
  appleButton: {
    height: 50,
    backgroundColor: '#000',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  appleButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.white,
  },
  googleButton: {
    height: 50,
    backgroundColor: colors.white,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(43,42,40,0.18)',
  },
  googleButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.ink,
  },
  disabledButton: {
    opacity: 0.4,
  },
  disabledText: {
    color: colors.inkSoft,
  },
  terms: {
    marginTop: 18,
    fontSize: 10,
    color: colors.inkSoft,
    textAlign: 'center',
    lineHeight: 17,
  },
});
