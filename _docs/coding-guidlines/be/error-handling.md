# BE エラーハンドリング

## 例外クラス

- `OshiLockBeException` -- ベース例外。`statusCode` + `message` + `toJSON()`
- `ValidationException extends OshiLockBeException` -- zod のフィールドエラーを `details` に含む
- `TransactionCanceledException extends OshiLockBeException` -- DynamoDB トランザクション失敗時
- `NotFoundException extends OshiLockBeException` -- 404 Not Found。デフォルトメッセージ「リソースが見つかりません」
- `RateLimitException extends OshiLockBeException` -- 429 Too Many Requests。投稿制限（日次上限・クールダウン）等
- `AiGatewayException extends OshiLockBeException` -- 500。AI 処理失敗時
- 新しいエラー種別は `OshiLockBeException` を継承して `domain/errors/` に追加する
- **BE 内で `throw new Error()` は禁止。必ずカスタム例外を使う**

## エラーレスポンス形式

```json
{
  "error": "ValidationException",
  "statusCode": 400,
  "message": "Validation failed: idToken",
  "details": {
    "idToken": ["String must contain at least 1 character(s)"]
  }
}
```

## エラーハンドラー

`app.onError(errorHandler)` で全ルート共通のエラーハンドリング。
- `OshiLockBeException`: `toJSON()` をレスポンスとして返す
- その他: 500 エラーを返す

コントローラーで try-catch は不要（エラーハンドラーが処理する）。
