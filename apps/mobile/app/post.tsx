import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Plus, Info } from 'lucide-react-native';
import { colors, radii, typography } from '@/constants/theme';
import * as Burnt from 'burnt';
import { useCreatePost } from '@/hooks/useCreatePost';
import { MOCK_OSHI } from '@/data/mock';

const MAX_BODY = 500;
const MAX_URLS = 3;
const DAILY_LIMIT = 3;
const REMAINING = 2;

export default function PostScreen() {
  const insets = useSafeAreaInsets();
  const [body, setBody] = useState('');
  const [urls, setUrls] = useState<string[]>(['']);
  const { mutate, isPending } = useCreatePost();

  const addUrl = () => {
    if (urls.length < MAX_URLS) setUrls([...urls, '']);
  };

  const updateUrl = (index: number, value: string) => {
    const next = [...urls];
    next[index] = value;
    setUrls(next);
  };

  const handleSubmit = () => {
    const trimmed = body.trim();
    if (!trimmed) return;

    const sourceUrls = urls.map((u) => u.trim()).filter(Boolean);

    mutate(
      { oshiId: MOCK_OSHI.id, body: trimmed, sourceUrls },
      {
        onSuccess: () => {
          router.back();
          Burnt.toast({
            title: '投稿しました！',
            message: '反映まで少しお待ちください。',
            preset: 'done',
          });
        },
        onError: () =>
          Alert.alert('投稿に失敗しました', 'しばらくしてからもう一度お試しください。'),
      },
    );
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { paddingTop: insets.top }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {/* Nav bar */}
      <View style={styles.navBar}>
        <Pressable onPress={() => router.back()}>
          <Text style={styles.cancelText}>キャンセル</Text>
        </Pressable>
        <Text style={styles.navTitle}>情報を投稿</Text>
        <Pressable onPress={handleSubmit} disabled={isPending || !body.trim()}>
          <Text style={[styles.submitText, (isPending || !body.trim()) && styles.submitDisabled]}>
            {isPending ? '送信中...' : '投稿'}
          </Text>
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        {/* Group selector */}
        <View style={styles.groupSelector}>
          <Text style={styles.groupLabel}>グループ</Text>
          <Text style={styles.groupName}>{MOCK_OSHI.name}</Text>
          <Text style={styles.groupChevron}>▾</Text>
        </View>

        {/* Body */}
        <Text style={styles.fieldLabel}>
          本文 <Text style={styles.required}>必須</Text>
        </Text>
        <TextInput
          style={styles.textArea}
          multiline
          placeholder="情報を入力してください"
          placeholderTextColor={colors.inkSoft}
          value={body}
          onChangeText={setBody}
          maxLength={MAX_BODY}
        />
        <Text style={styles.charCount}>
          {body.length} / {MAX_BODY}
        </Text>

        {/* URLs */}
        <Text style={styles.fieldLabel}>
          参照URL <Text style={styles.optional}>任意 · 最大{MAX_URLS}件</Text>
        </Text>
        {urls.map((url, i) => (
          <TextInput
            key={i}
            style={styles.urlInput}
            placeholder="https://..."
            placeholderTextColor={colors.inkSoft}
            value={url}
            onChangeText={(v) => updateUrl(i, v)}
            autoCapitalize="none"
            keyboardType="url"
          />
        ))}
        {urls.length < MAX_URLS && (
          <Pressable style={styles.addUrlButton} onPress={addUrl}>
            <Plus size={14} color={colors.inkSoft} strokeWidth={1.5} />
            <Text style={styles.addUrlText}>URLを追加</Text>
          </Pressable>
        )}

        {/* Helper */}
        <View style={styles.helperBox}>
          <Info size={14} color={colors.ink} strokeWidth={1.5} />
          <View style={styles.helperTextWrap}>
            <Text style={styles.helperTitle}>URLがあると確度がアップ</Text>
            <Text style={styles.helperSub}>AIが自動でカード化 · 既存カードに統合されます</Text>
          </View>
        </View>

        {/* Daily limit */}
        <Text style={styles.limitText}>
          本日の残り投稿 ·{' '}
          <Text style={styles.limitCount}>
            {REMAINING} / {DAILY_LIMIT}
          </Text>
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.paper },
  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  cancelText: { fontSize: 14, color: colors.inkSoft },
  navTitle: { fontSize: 14, fontWeight: '700', color: colors.ink },
  submitText: { fontSize: 14, fontWeight: '600', color: colors.ink },
  submitDisabled: { color: colors.inkSoft, opacity: 0.5 },
  scrollContent: { padding: 16, paddingBottom: 40 },
  groupSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 12,
    backgroundColor: colors.white,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 14,
  },
  groupLabel: { fontSize: 10, color: colors.inkSoft },
  groupName: { fontSize: 12, fontWeight: '600', color: colors.ink, flex: 1 },
  groupChevron: { fontSize: 12, color: colors.inkSoft },
  fieldLabel: {
    ...typography.label,
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  required: { color: colors.unreadDot, fontWeight: '400', textTransform: 'none', letterSpacing: 0 },
  optional: { color: colors.inkSoft, fontWeight: '400', textTransform: 'none', letterSpacing: 0 },
  textArea: {
    backgroundColor: colors.white,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 12,
    minHeight: 130,
    fontSize: 13,
    color: colors.ink,
    lineHeight: 20,
    textAlignVertical: 'top',
    marginBottom: 4,
  },
  charCount: {
    fontSize: 10,
    color: colors.inkSoft,
    textAlign: 'right',
    marginBottom: 16,
  },
  urlInput: {
    backgroundColor: colors.white,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 12,
    fontSize: 12,
    color: colors.ink,
    marginBottom: 8,
  },
  addUrlButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    borderStyle: 'dashed',
    marginBottom: 14,
  },
  addUrlText: { fontSize: 12, color: colors.inkSoft },
  helperBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    backgroundColor: '#EEF4FA',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#D0E0F0',
    padding: 12,
    marginBottom: 14,
  },
  helperTextWrap: { flex: 1 },
  helperTitle: { fontSize: 11, fontWeight: '700', color: colors.ink, marginBottom: 2 },
  helperSub: { fontSize: 11, color: colors.inkSoft },
  limitText: {
    fontSize: 10,
    color: colors.inkSoft,
    textAlign: 'center',
    marginTop: 4,
  },
  limitCount: { color: colors.ink, fontWeight: '600' },
});
