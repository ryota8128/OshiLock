import { ContentfulStatusCode } from "hono/utils/http-status";

export class OshiLockBeException extends Error {
  readonly statusCode: ContentfulStatusCode;

  constructor(statusCode: ContentfulStatusCode, message: string) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
  }

  toJSON(): Record<string, unknown> {
    return {
      error: this.name,
      statusCode: this.statusCode,
      message: this.message,
    };
  }
}
