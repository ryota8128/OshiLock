# User テーブル設計

## ドメインモデル

ユーザーに関するデータは以下の3モデルに分かれている（SK 分割パターン）。

### User（プロフィール）
```typescript
interface User {
  id: UserId;
  displayName: string;
  avatarUrl: string | null;
  rank: UserRank;         // LEGEND | STAR | ACE | REGULAR | ROOKIE | NO_RANK
  oshiOrder: OshiId[];    // 推しの並び順
  createdAt: UtcIsoString;
  updatedAt: UtcIsoString;
}
```

### UserSettings（設定）
```typescript
interface UserSettings {
  userId: UserId;
  notification: {
    reminder: boolean;
    dailySummary: boolean;
  };
}
```

### UserPushToken（通知トークン）
```typescript
interface UserPushToken {
  userId: UserId;
  token: string;
  platform: Platform;     // IOS | ANDROID
  createdAt: UtcIsoString;
}
```

### 認証情報（DB 追加項目）
ドメインモデルには未定義だが、DB には以下を保存する必要がある。

| 項目 | 説明 |
|---|---|
| authProvider | APPLE / GOOGLE |
| authSub | プロバイダーのユーザーID（Apple の user / Google の sub） |
| email | 初回ログイン時に取得（Apple は2回目以降 null） |

---

## DynamoDB アイテム設計（シングルテーブル）

### PK / SK 構成

| PK | SK | データ | 用途 |
|---|---|---|---|
| `USER#<userId>` | `PROFILE` | displayName, avatarUrl, rank, oshiOrder, createdAt, updatedAt | プロフィール |
| `USER#<userId>` | `AUTH` | authProvider, authSub, email | 認証情報 |
| `USER#<userId>` | `SETTINGS` | notification: { reminder, dailySummary } | 通知設定 |
| `USER#<userId>` | `PUSH_TOKEN#<platform>` | token, platform, createdAt | Push トークン |

### GSI（グローバルセカンダリインデックス）

| GSI 名 | PK | SK | 用途 |
|---|---|---|---|
| `GSI1` | `AUTH#<authProvider>#<authSub>` | `USER#<userId>` | authSub からユーザー検索（ログイン時） |

---

## アクセスパターン

### 認証

| # | パターン | 操作 | キー |
|---|---|---|---|
| U-1 | authSub でユーザーを検索（ログイン時） | GSI1 Query | GSI1-PK: `AUTH#APPLE#<sub>` |
| U-2 | ユーザー新規作成（初回ログイン） | BatchWrite | PK: `USER#<id>`, SK: `PROFILE` + `AUTH` + `SETTINGS` |
| U-3 | ユーザー削除（退会） | BatchWrite | PK: `USER#<id>`, 全 SK 削除 |

### プロフィール

| # | パターン | 操作 | キー |
|---|---|---|---|
| U-4 | プロフィール取得（マイページ） | GetItem | PK: `USER#<id>`, SK: `PROFILE` |
| U-5 | 表示名変更 | UpdateItem | PK: `USER#<id>`, SK: `PROFILE`, SET displayName |
| U-6 | 推し順序変更 | UpdateItem | PK: `USER#<id>`, SK: `PROFILE`, SET oshiOrder |
| U-7 | ランク更新（年1回バッチ） | UpdateItem | PK: `USER#<id>`, SK: `PROFILE`, SET rank |
| U-8 | 他ユーザーのプロフィール取得（最速投稿者名表示等） | GetItem | PK: `USER#<id>`, SK: `PROFILE` |

### 設定

| # | パターン | 操作 | キー |
|---|---|---|---|
| U-9 | 通知設定取得 | GetItem | PK: `USER#<id>`, SK: `SETTINGS` |
| U-10 | 通知設定変更（個別項目） | UpdateItem | PK: `USER#<id>`, SK: `SETTINGS`, SET notification.reminder |

### Push トークン

| # | パターン | 操作 | キー |
|---|---|---|---|
| U-11 | Push トークン登録/更新 | PutItem | PK: `USER#<id>`, SK: `PUSH_TOKEN#IOS` |
| U-12 | Push トークン取得（通知送信時） | GetItem | PK: `USER#<id>`, SK: `PUSH_TOKEN#IOS` |
| U-13 | 全ユーザーの Push トークン取得（一斉通知） | Scan + Filter | SK: begins_with(`PUSH_TOKEN#`) |

### 複合取得

| # | パターン | 操作 | キー |
|---|---|---|---|
| U-14 | ユーザー全データ取得（アプリ起動時） | Query | PK: `USER#<id>` → PROFILE + AUTH + SETTINGS + PUSH_TOKEN |

---

## 退会処理

要件定義より：
- プロフィール情報: 完全削除
- コメント: 匿名化（「退会済みユーザー」表示）
- 最速投稿者表示: 匿名化（順位繰り上げなし）
- いいね: 紐付け削除、カウント数は維持
- チェックリスト: 完全削除
- 退会後30日の猶予期間 → 猶予期間後に物理削除

### 実装方針
1. 退会リクエスト時: PROFILE に `deletedAt: UtcIsoString` を追加、`isDeleted: true` に設定
2. 30日後バッチ: `isDeleted: true` かつ `deletedAt` が30日以上前のユーザーを物理削除
3. 猶予期間中にログインした場合: `isDeleted` を `false` に戻して復旧

---

## 備考

- `userId` は ULID を使用予定（時系列ソート可能 + ランダム性）
- U-13（全ユーザー Scan）は MVP ではユーザー数が少ないので問題ないが、スケール時は GSI 追加を検討
- Apple はメールを初回のみ返すため、AUTH アイテムに初回で保存必須
