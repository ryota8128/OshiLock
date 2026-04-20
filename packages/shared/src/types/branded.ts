import { z } from "zod";
import { ulid } from "ulid";

declare const __brand: unique symbol;

export type Branded<T, B extends string> = T & { readonly [__brand]: B };

export type UserId = Branded<string, "UserId">;
export namespace UserId {
  const PREFIX = "u_";
  export const schema = z.string().startsWith(PREFIX).transform(from);
  export function from(value: string): UserId {
    return value as UserId;
  }
  export function generate(): UserId {
    return from(`${PREFIX}${ulid()}`);
  }
}

export type EventId = Branded<string, "EventId">;
export namespace EventId {
  const PREFIX = "e_";
  export const schema = z.string().startsWith(PREFIX).transform(from);
  export function from(value: string): EventId {
    return value as EventId;
  }
  export function generate(): EventId {
    return from(`${PREFIX}${ulid()}`);
  }
}

export type CommentId = Branded<string, "CommentId">;
export namespace CommentId {
  const PREFIX = "c_";
  export const schema = z.string().startsWith(PREFIX).transform(from);
  export function from(value: string): CommentId {
    return value as CommentId;
  }
  export function generate(): CommentId {
    return from(`${PREFIX}${ulid()}`);
  }
}

export type PostId = Branded<string, "PostId">;
export namespace PostId {
  const PREFIX = "p_";
  export const schema = z.string().startsWith(PREFIX).transform(from);
  export function from(value: string): PostId {
    return value as PostId;
  }
  export function generate(): PostId {
    return from(`${PREFIX}${ulid()}`);
  }
}

export type OshiId = Branded<string, "OshiId">;
export namespace OshiId {
  const PREFIX = "o_";
  export const schema = z.string().startsWith(PREFIX).transform(from);
  export function from(value: string): OshiId {
    return value as OshiId;
  }
  export function generate(): OshiId {
    return from(`${PREFIX}${ulid()}`);
  }
}
