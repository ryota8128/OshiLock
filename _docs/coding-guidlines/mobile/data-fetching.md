# Mobile データ取得（TanStack Query）

## 方針

- グローバル state に永続化しない。画面を開いた時に取得する
- `staleTime` を数時間に設定し、同一セッション内の無駄な再取得を防ぐ
- アプリ起動時に全データを一括取得しない

## Query Hook パターン

```typescript
const PROFILE_KEY = ['users', 'me'] as const;
const STALE_TIME = 4 * 60 * 60 * 1000; // 4時間

export function useProfile() {
  return useQuery({
    queryKey: PROFILE_KEY,
    queryFn: () => userApi.getProfile(),
    staleTime: STALE_TIME,
    select: (data) => data.user,
  });
}

// キャッシュ無効化用
export function useInvalidateProfile() {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: PROFILE_KEY });
}
```

## Mutation Hook パターン（楽観的更新）

トグル等の即時フィードバックが必要な操作は楽観的更新を使う。

```typescript
export function useUpdateSettings() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: UpdateUserSettingsRequest) => userApi.updateSettings(body),
    // 1. キャッシュを即座に更新（UI が瞬時に反映）
    onMutate: async (body) => {
      await queryClient.cancelQueries({ queryKey: SETTINGS_KEY });
      const previous = queryClient.getQueryData(SETTINGS_KEY);
      queryClient.setQueryData(SETTINGS_KEY, (old) => {
        if (!old) return old;
        return { settings: { ...old.settings, notification: { ...old.settings.notification, ...body.notification } } };
      });
      return { previous };
    },
    // 2. 失敗時はロールバック
    onError: (_err, _body, context) => {
      if (context?.previous) {
        queryClient.setQueryData(SETTINGS_KEY, context.previous);
      }
    },
    // 3. 成功・失敗どちらでもサーバーから再取得して同期
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: SETTINGS_KEY });
    },
  });
}
```

### 更新系は useMutation で統一

更新系（POST / PUT / DELETE）は必ず `useMutation` を使う。コンポーネント内で `try/catch` + `useState` で手動管理しない。

**理由:**
- `isPending` / `isError` / `error` が自動で取れる
- 二重送信防止（`isPending` 中のボタン disabled）が統一的に実装できる
- `onSuccess` / `onError` / `onSettled` でキャッシュ操作をフック内に閉じ込められる

### Mutation Hook パターン（送信のみ）

投稿など、キャッシュの楽観的更新が不要なケースのパターン。

```typescript
// hooks/useCreatePost.ts
export function useCreatePost() {
  return useMutation({
    mutationFn: (input: CreatePostRequest) => postApi.create(input),
  });
}

// 画面側 — mutate + コールバックで宣言的に書く
const { mutate, isPending } = useCreatePost();

const handleSubmit = () => {
  mutate(
    { oshiId, body, sourceUrls },
    {
      onSuccess: () => router.back(),
      onError: () => Alert.alert('投稿に失敗しました'),
    },
  );
};

// ボタン — isPending 中は disabled にして二重送信を防ぐ
<Pressable onPress={handleSubmit} disabled={isPending}>
  <Text>{isPending ? '送信中...' : '投稿'}</Text>
</Pressable>
```

### 二重送信防止

更新系ボタンは必ず `isPending` で disabled にする。

```typescript
// ✅ isPending で disabled
<Pressable onPress={handleSubmit} disabled={isPending}>

// ❌ useState で手動管理しない
const [isSubmitting, setIsSubmitting] = useState(false);
```
