# User テーブル設計

## ドメインモデル

ユーザーに関するデータは以下の4モデルに分かれている（SK 分割パターン）。

### User（プロフィール + 認証）
```typescript
interface User {
  id: UserId;
  authProvider: AuthProvider; // APPLE | GOOGLE
  authSub: string;            // プロバイダーのユーザーID
  displayName: string;
  avatarUrl: string | null;
  rank: UserRank;             // LEGEND | STAR | ACE | REGULAR | ROOKIE | NO_RANK
  createdAt: UtcIsoString;
  updatedAt: UtcIsoString;
}
```

### UserOshi（推し × サブスク）
```typescript
interface UserOshi {
  userId: UserId;
  oshiId: OshiId;
  order: number;                          // 表示順（0始まり、小さい方が優先）
  subscriptionStatus: SubscriptionStatus; // FREE | TRIAL | ACTIVE | INACTIVE
  joinedAt: UtcIsoString;
  expiresAt: UtcIsoString | null;         // null = 無期限（FREE ユーザー）
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

---

## DynamoDB アイテム設計（シングルテーブル）

### PK / SK 構成

| PK | SK | データ | 用途 |
|---|---|---|---|
| `USER#<userId>` | `PROFILE` | authProvider, authSub, displayName, avatarUrl, rank, createdAt, updatedAt | プロフィール + 認証 |
| `USER#<userId>` | `OSHI#<oshiId>` | order, subscriptionStatus, joinedAt, expiresAt | 推し × サブスク |
| `USER#<userId>` | `SETTINGS` | notification: { reminder, dailySummary } | 通知設定 |
| `USER#<userId>` | `PUSH_TOKEN#<platform>` | token, platform, createdAt | Push トークン |

### GSI（グローバルセカンダリインデックス）

| GSI 名 | PK | SK | 用途 |
|---|---|---|---|
| `GSI1` | `AUTH#<authProvider>#<authSub>` | `USER#<userId>` | authSub からユーザー検索（ログイン時） |

※ GSI1 のデータは PROFILE アイテムに `GSI1PK` 属性として保存する。

---

## アクセスパターン

### 認証

| # | パターン | 操作 | キー |
|---|---|---|---|
| U-1 | authSub でユーザーを検索（ログイン時） | GSI1 Query | GSI1-PK: `AUTH#APPLE#<sub>` |
| U-2 | ユーザー新規作成（初回ログイン） | BatchWrite | PK: `USER#<id>`, SK: `PROFILE` + `SETTINGS` |
| U-3 | ユーザー削除（退会） | BatchWrite | PK: `USER#<id>`, 全 SK 削除 |

### プロフィール

| # | パターン | 操作 | キー |
|---|---|---|---|
| U-4 | プロフィール取得（マイページ） | GetItem | PK: `USER#<id>`, SK: `PROFILE` |
| U-5 | 表示名変更 | UpdateItem | PK: `USER#<id>`, SK: `PROFILE`, SET displayName |
| U-6 | ランク更新（年1回バッチ） | UpdateItem | PK: `USER#<id>`, SK: `PROFILE`, SET rank |
| U-7 | 他ユーザーのプロフィール取得（最速投稿者名表示等） | GetItem | PK: `USER#<id>`, SK: `PROFILE` |

### 推し × サブスク

| # | パターン | 操作 | キー |
|---|---|---|---|
| U-8 | ユーザーの推し一覧取得 | Query | PK: `USER#<id>`, SK: begins_with(`OSHI#`) |
| U-9 | 推しに参加（サブスク開始） | PutItem | PK: `USER#<id>`, SK: `OSHI#<oshiId>` |
| U-10 | 推しの表示順変更 | UpdateItem | PK: `USER#<id>`, SK: `OSHI#<oshiId>`, SET order |
| U-11 | サブスク状態更新 | UpdateItem | PK: `USER#<id>`, SK: `OSHI#<oshiId>`, SET subscriptionStatus, expiresAt |
| U-12 | 推しから離脱 | DeleteItem | PK: `USER#<id>`, SK: `OSHI#<oshiId>` |

### 設定

| # | パターン | 操作 | キー |
|---|---|---|---|
| U-13 | 通知設定取得 | GetItem | PK: `USER#<id>`, SK: `SETTINGS` |
| U-14 | 通知設定変更（個別項目） | UpdateItem | PK: `USER#<id>`, SK: `SETTINGS`, SET notification.reminder |

### Push トークン

| # | パターン | 操作 | キー |
|---|---|---|---|
| U-15 | Push トークン登録/更新 | PutItem | PK: `USER#<id>`, SK: `PUSH_TOKEN#IOS` |
| U-16 | Push トークン取得（通知送信時） | GetItem | PK: `USER#<id>`, SK: `PUSH_TOKEN#IOS` |
| U-17 | 全ユーザーの Push トークン取得（一斉通知） | Scan + Filter | SK: begins_with(`PUSH_TOKEN#`) |

### 複合取得

| # | パターン | 操作 | キー |
|---|---|---|---|
| U-18 | ユーザー全データ取得（アプリ起動時） | Query | PK: `USER#<id>` → PROFILE + OSHI# + SETTINGS + PUSH_TOKEN |

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
- U-17（全ユーザー Scan）は MVP ではユーザー数が少ないので問題ないが、スケール時は GSI 追加を検討
- `SubscriptionStatus.isActive(status)` でサブスクが有効かどうか判定可能
