import { z } from "zod";

declare const __brand: unique symbol;

export type Branded<T, B extends string> = T & { readonly [__brand]: B };

export type UserId = Branded<string, "UserId">;
export namespace UserId {
  export const schema = z.string().min(1).transform(from);
  export function from(value: string): UserId { return value as UserId; }
}

export type GroupId = Branded<string, "GroupId">;
export namespace GroupId {
  export const schema = z.string().min(1).transform(from);
  export function from(value: string): GroupId { return value as GroupId; }
}

export type EventId = Branded<string, "EventId">;
export namespace EventId {
  export const schema = z.string().min(1).transform(from);
  export function from(value: string): EventId { return value as EventId; }
}

export type CommentId = Branded<string, "CommentId">;
export namespace CommentId {
  export const schema = z.string().min(1).transform(from);
  export function from(value: string): CommentId { return value as CommentId; }
}

export type PostId = Branded<string, "PostId">;
export namespace PostId {
  export const schema = z.string().min(1).transform(from);
  export function from(value: string): PostId { return value as PostId; }
}

export type OshiId = Branded<string, "OshiId">;
export namespace OshiId {
  export const schema = z.string().min(1).transform(from);
  export function from(value: string): OshiId { return value as OshiId; }
}
