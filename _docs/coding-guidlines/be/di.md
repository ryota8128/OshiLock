# BE 依存注入（DI）

## 方針

- **DI コンテナは使わない**（過剰）
- `composition/dependencies.ts` を唯一の composition root とする
- infrastructure のインスタンス生成（`new`）はここだけで行う
- use-case はクラスベースで、コンストラクタで依存を受け取る
- application 層は domain の interface のみに依存する

## ルール

```typescript
// ✅ composition root で組み立て
// composition/dependencies.ts
const authGateway = new FirebaseAuthGateway();
const userRepository = new DynamoUserRepository();
export const signInUseCase = new SignInUseCase(authGateway, userRepository);

// ✅ controller は composition root から use-case を取得
import { signInUseCase } from "../../../composition/dependencies.js";
const result = await signInUseCase.execute(idToken);

// ✅ use-case は interface に依存
class SignInUseCase {
  constructor(
    private readonly authGateway: IAuthGateway,
    private readonly userRepository: IUserRepository,
  ) {}
}

// ❌ controller で直接 new しない
const repo = new DynamoUserRepository();

// ❌ application 層で infrastructure を import しない
import { DynamoUserRepository } from "../infrastructure/...";

// ❌ infrastructure ファイル内で export const instance = new Class() しない
```

## リクエストスキーマ

各ルートの `<リソース名>-request.schema.ts` に zod スキーマを定義する。

```typescript
// auth-request.schema.ts
import { z } from "zod";

export const signInRequestSchema = z.object({
  idToken: z.string().min(1),
});
```
