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
  ActivityIndicator,
} from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { Camera } from 'lucide-react-native';
import { DisplayName } from '@oshilock/shared';
import { colors, radii, spacing, typography } from '@/constants/theme';
import { Avatar } from '@/components/Avatar';
import { useProfile, useInvalidateProfile } from '@/hooks/useProfile';
import { resizeForAvatar } from '@/utils/image';
import { userApi, uploadToS3 } from '@/api/user';

type AvatarUris = { sm: string; lg: string } | null;

export default function ProfileSettingsScreen() {
  const { data: profile, isLoading } = useProfile();
  const invalidateProfile = useInvalidateProfile();

  const [displayName, setDisplayName] = useState(profile?.displayName ?? '');
  const [avatarUris, setAvatarUris] = useState<AvatarUris>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isValid = DisplayName.schema.safeParse(displayName.trim()).success;
  const hasChanges = displayName.trim() !== profile?.displayName || avatarUris !== null;

  if (isLoading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color={colors.inkSoft} />
      </View>
    );
  }

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
      setAvatarUris({ sm: sm.uri, lg: lg.uri });
    }
  }

  async function handleSave() {
    if (!isValid || isSubmitting || !hasChanges) return;

    setIsSubmitting(true);
    try {
      let avatarPath: string | undefined;

      if (avatarUris) {
        const { avatarPath: path, smUploadUrl, lgUploadUrl } = await userApi.getAvatarUploadUrls();
        avatarPath = path;

        await Promise.all([
          uploadToS3(smUploadUrl, avatarUris.sm),
          uploadToS3(lgUploadUrl, avatarUris.lg),
        ]);
      }

      await userApi.updateProfile({
        displayName: displayName.trim(),
        avatarPath,
      });

      await invalidateProfile();
      router.back();
    } catch (e) {
      Alert.alert('エラー', 'プロフィールの更新に失敗しました');
    } finally {
      setIsSubmitting(false);
    }
  }

  const currentAvatarUrl = avatarUris?.sm ?? profile?.avatarUrl?.sm ?? null;

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <KeyboardAvoidingView
        style={styles.inner}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* Avatar */}
        <Pressable style={styles.avatarSection} onPress={pickImage}>
          <Avatar
            avatarUrl={currentAvatarUrl}
            displayName={displayName || '?'}
            userId={profile?.id ?? ''}
            size="lg"
          />
          <View style={styles.cameraIcon}>
            <Camera size={14} color={colors.white} strokeWidth={2} />
          </View>
        </Pressable>
        <Text style={styles.avatarHint}>タップして写真を変更</Text>

        {/* Display Name */}
        <View style={styles.inputSection}>
          <Text style={styles.label}>表示名</Text>
          <TextInput
            style={styles.input}
            value={displayName}
            onChangeText={setDisplayName}
            placeholder="表示名を入力"
            placeholderTextColor={colors.inkSoft}
            maxLength={DisplayName.maxLength}
          />
          <Text style={styles.charCount}>
            {displayName.length} / {DisplayName.maxLength}
          </Text>
        </View>

        {/* Save */}
        <View style={styles.footer}>
          <Pressable
            style={[styles.saveButton, (!isValid || !hasChanges) && styles.saveDisabled]}
            onPress={handleSave}
            disabled={!isValid || !hasChanges || isSubmitting}
          >
            {isSubmitting ? (
              <ActivityIndicator color={colors.white} />
            ) : (
              <Text style={[styles.saveText, (!isValid || !hasChanges) && styles.saveTextDisabled]}>
                保存
              </Text>
            )}
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.paper,
  },
  inner: {
    flex: 1,
    paddingHorizontal: 28,
    paddingTop: spacing.xl,
    paddingBottom: 20,
  },
  center: { justifyContent: 'center', alignItems: 'center' },
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
    marginTop: 'auto',
  },
  saveButton: {
    backgroundColor: colors.ink,
    borderRadius: radii.button,
    paddingVertical: 15,
    alignItems: 'center',
  },
  saveDisabled: {
    opacity: 0.3,
  },
  saveText: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.white,
  },
  saveTextDisabled: {
    color: colors.white,
  },
});
