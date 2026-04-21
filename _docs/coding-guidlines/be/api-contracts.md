# BE API 契約（リクエスト / レスポンス型）

API のリクエスト・レスポンスは `packages/shared/src/api/` に定義し、BE と Mobile で共有する。

```
packages/shared/src/api/
  request/
    auth.request.ts     <- schema + 入力型
    user.request.ts
  response/
    auth.response.ts    <- レスポンス型
    user.response.ts
```

## リクエスト

- schema（zod）と入力型（`z.input`）を shared に定義する
- BE の controller は shared から直接 import する（中間 re-export ファイルは作らない）
- Mobile の API 呼び出しで入力型を使って型安全を保証する

```typescript
// ✅ shared にリクエスト schema + 型を定義
// packages/shared/src/api/request/user.request.ts
export const updateProfileRequestSchema = z.object({
  displayName: DisplayName.schema,
  avatarPath: z.string().nullable().optional(),
});
export type UpdateProfileRequest = z.input<typeof updateProfileRequestSchema>;

// ✅ BE controller で shared から直接 import
import { type SignInResponse, signInRequestSchema } from '@oshilock/shared';
auth.post('/signin', validate({ body: signInRequestSchema }), async (c) => { ... });

// ✅ Mobile で入力型を使う
import type { UpdateProfileRequest } from '@oshilock/shared';
updateProfile(body: UpdateProfileRequest): Promise<UpdateProfileResponse> { ... }

// ❌ BE に中間 re-export ファイルを作らない
// auth-request.schema.ts <- 不要
export { signInRequestSchema } from '@oshilock/shared';

// ❌ コントローラー内で手動バリデーションしない
const { idToken } = await c.req.json();
if (!idToken) return c.json({ error: 'required' }, 400);
```

## レスポンス

- レスポンス型は `packages/shared/src/api/response/` に定義する
- controller でレスポンス型を明示的に型注釈して型を強制する

```typescript
// ✅ shared にレスポンス型を定義
export type UpdateProfileResponse = {
  user: UserWithAvatarUrl;
};

// ✅ controller で型注釈を付けて型を強制
const response: UpdateProfileResponse = { user: result };
return c.json(response);

// ✅ Mobile で同じ型を参照
const res = await apiClient.put<UpdateProfileResponse>('/users/me/profile', body);
```

## バリデーション定数（value-object）

- 文字数制限等のバリデーション定数は `packages/shared/src/domain/value-objects/` に zod schema として定義する
- BE のリクエストスキーマと Mobile のバリデーションで同じ値を使う

```typescript
// ✅ shared に value-object を定義
// packages/shared/src/domain/value-objects/display-name.ts
export namespace DisplayName {
  export const schema = z.string().min(2).max(20);
}

// ✅ BE のリクエストスキーマで使う
import { DisplayName } from "@oshilock/shared";
export const updateProfileRequestSchema = z.object({
  displayName: DisplayName.schema,
});

// ✅ Mobile のバリデーションでも使う
const isValid = DisplayName.schema.safeParse(input).success;
```
