import type { ErrorHandler } from "hono";
import { OshiLockBeException } from "../../domain/errors/oshilock-be.exception.js";

export const errorHandler: ErrorHandler = (err, c) => {
  if (err instanceof OshiLockBeException) {
    console.error(`[${err.name}] ${err.message}`, err.toJSON());
    return c.json(err.toJSON(), err.statusCode);
  }

  console.error("[UnhandledError]", err);
  return c.json(
    {
      error: "InternalServerError",
      statusCode: 500,
      message: "Internal Server Error",
    },
    500,
  );
};
