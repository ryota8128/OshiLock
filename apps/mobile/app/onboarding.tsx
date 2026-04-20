import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { Camera } from 'lucide-react-native';
import { colors, radii, typography } from '@/constants/theme';
import { useAuth } from '@/contexts/AuthContext';
import { Avatar } from '@/components/Avatar';
import { resizeForAvatar } from '@/utils/image';

const MAX_DISPLAY_NAME = 20;
const MIN_DISPLAY_NAME = 2;

export default function OnboardingScreen() {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const [displayName, setDisplayName] = useState(user?.displayName ?? '');
  const [avatarUri, setAvatarUri] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isValid = displayName.trim().length >= MIN_DISPLAY_NAME;

  async function pickImage() {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      const [sm, lg] = await Promise.all([
        resizeForAvatar(result.assets[0].uri, 'sm'),
        resizeForAvatar(result.assets[0].uri, 'lg'),
      ]);
      // プレビューは sm を表示、アップロード時に両方送信
      setAvatarUri(sm.uri);
      // TODO: lg.uri もアップロード時に使用
    }
  }

  async function handleSubmit() {
    if (!isValid || isSubmitting) return;

    setIsSubmitting(true);
    try {
      // TODO: BE に表示名 + アバター画像を送信
      // 1. アバター画像があれば presigned URL でアップロード
      // 2. PUT /users/me/profile で表示名 + avatarUrl を更新
      router.replace('/(tabs)');
    } catch (e) {
      Alert.alert('エラー', 'プロフィールの設定に失敗しました');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={[styles.container, { paddingTop: insets.top + 40, paddingBottom: insets.bottom + 20 }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <Text style={styles.title}>プロフィール設定</Text>
      <Text style={styles.subtitle}>表示名とアバターを設定しましょう</Text>

      {/* Avatar */}
      <Pressable style={styles.avatarSection} onPress={pickImage}>
        {avatarUri ? (
          <Avatar
            avatarUrl={avatarUri}
            displayName={displayName || '?'}
            userId={user?.uid ?? ''}
            size="lg"
          />
        ) : (
          <Avatar displayName={displayName || '?'} userId={user?.uid ?? ''} size="lg" />
        )}
        <View style={styles.cameraIcon}>
          <Camera size={14} color={colors.white} strokeWidth={2} />
        </View>
      </Pressable>
      <Text style={styles.avatarHint}>タップして写真を選択</Text>

      {/* Display Name */}
      <View style={styles.inputSection}>
        <Text style={styles.label}>表示名</Text>
        <TextInput
          style={styles.input}
          value={displayName}
          onChangeText={setDisplayName}
          placeholder="表示名を入力"
          placeholderTextColor={colors.inkSoft}
          maxLength={MAX_DISPLAY_NAME}
          autoFocus
        />
        <Text style={styles.charCount}>
          {displayName.length} / {MAX_DISPLAY_NAME}
        </Text>
      </View>

      {/* Submit */}
      <View style={styles.footer}>
        <Pressable
          style={[styles.submitButton, !isValid && styles.submitDisabled]}
          onPress={handleSubmit}
          disabled={!isValid || isSubmitting}
        >
          <Text style={[styles.submitText, !isValid && styles.submitTextDisabled]}>
            {isSubmitting ? '設定中...' : 'はじめる'}
          </Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.paper,
    paddingHorizontal: 28,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.ink,
    letterSpacing: -0.4,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    ...typography.caption,
    textAlign: 'center',
    marginBottom: 32,
  },
  avatarSection: {
    alignSelf: 'center',
    position: 'relative',
    marginBottom: 8,
  },
  cameraIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.ink,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.paper,
  },
  avatarHint: {
    ...typography.caption,
    textAlign: 'center',
    marginBottom: 32,
  },
  inputSection: {
    marginBottom: 24,
  },
  label: {
    ...typography.label,
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  input: {
    backgroundColor: colors.white,
    borderRadius: radii.infoBox,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 14,
    fontSize: 16,
    color: colors.ink,
  },
  charCount: {
    fontSize: 10,
    color: colors.inkSoft,
    textAlign: 'right',
    marginTop: 4,
  },
  footer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  submitButton: {
    backgroundColor: colors.ink,
    borderRadius: radii.button,
    paddingVertical: 15,
    alignItems: 'center',
  },
  submitDisabled: {
    opacity: 0.3,
  },
  submitText: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.white,
  },
  submitTextDisabled: {
    color: colors.white,
  },
});
