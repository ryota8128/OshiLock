declare const __brand: unique symbol;

export type Branded<T, B extends string> = T & { readonly [__brand]: B };

export type UserId = Branded<string, "UserId">;
export type GroupId = Branded<string, "GroupId">;
export type EventCardId = Branded<string, "EventCardId">;
export type CommentId = Branded<string, "CommentId">;
export type PostId = Branded<string, "PostId">;
export type OshiId = Branded<string, "OshiId">;
