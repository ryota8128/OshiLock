import type { ZodError } from "zod";
import { OshiLockBeException } from "./oshilock-be.exception.js";

type FieldErrors = Record<string, string[]>;

export class ValidationException extends OshiLockBeException {
  readonly fieldErrors: FieldErrors;

  constructor(zodError: ZodError) {
    const flattened = zodError.flatten();
    const fieldErrors: FieldErrors = {
      ...flattened.fieldErrors as FieldErrors,
    };

    const fields = Object.keys(fieldErrors);
    const message = fields.length > 0
      ? `Validation failed: ${fields.join(", ")}`
      : "Validation failed";

    super(400, message);
    this.fieldErrors = fieldErrors;
  }

  override toJSON(): Record<string, unknown> {
    return {
      ...super.toJSON(),
      details: this.fieldErrors,
    };
  }
}
